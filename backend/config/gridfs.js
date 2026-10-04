import mongoose from 'mongoose'
import { Readable } from 'node:stream'

// Uploaded pictures and videos live in the database itself (GridFS) rather than
// a third-party bucket: one connection string is then the only thing standing
// between a fresh deploy and a working shop, and media survives redeploys on
// hosts with no persistent disk.
const BUCKET = 'media'

export const getBucket = () => {
    const db = mongoose.connection?.db
    if (!db) throw new Error('Database not connected')
    return new mongoose.mongo.GridFSBucket(db, { bucketName: BUCKET })
}

// Store a multer memory-buffer file, returning its id.
export const putFile = (file) => new Promise((resolve, reject) => {
    const bucket = getBucket()
    const stream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: { uploadedAt: Date.now(), size: file.size },
    })
    Readable.from(file.buffer).pipe(stream)
        .on('error', reject)
        .on('finish', () => resolve(stream.id))
})

export const deleteFile = async (fileId) => {
    if (!fileId) return
    try {
        await getBucket().delete(new mongoose.Types.ObjectId(String(fileId)))
    } catch { /* already gone */ }
}

export const findFile = async (fileId) => {
    const files = await getBucket().find({ _id: new mongoose.Types.ObjectId(String(fileId)) }).toArray()
    return files[0] || null
}

// Stream a file to the client, honouring Range requests so videos can seek.
export const streamFile = async (fileId, req, res) => {
    const file = await findFile(fileId)
    if (!file) {
        res.status(404).json({ success: false, message: 'Not found' })
        return
    }

    const bucket = getBucket()
    const id = new mongoose.Types.ObjectId(String(fileId))
    const type = file.contentType || 'application/octet-stream'
    const total = file.length

    res.setHeader('Content-Type', type)
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

    const range = req.headers.range
    if (range) {
        const match = /bytes=(\d*)-(\d*)/.exec(range)
        const start = match && match[1] ? parseInt(match[1], 10) : 0
        const end = match && match[2] ? parseInt(match[2], 10) : total - 1
        if (start >= total || end >= total || start > end) {
            res.status(416).setHeader('Content-Range', `bytes */${total}`).end()
            return
        }
        res.status(206)
        res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`)
        res.setHeader('Content-Length', end - start + 1)
        bucket.openDownloadStream(id, { start, end: end + 1 }).pipe(res)
        return
    }

    res.setHeader('Content-Length', total)
    bucket.openDownloadStream(id).pipe(res)
}

export const mediaUrl = (fileId) => (fileId ? `/api/media/file/${fileId}` : '')
