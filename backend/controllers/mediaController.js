import { db, putBinary, getBinary, deleteBinary, newId } from "../lib/db.js"

export const MEDIA_SLOTS = [
    { id: 'home-hero',      label: 'Home · under the hero banner' },
    { id: 'home-reviews',   label: 'Home · customer review videos' },
    { id: 'home-ads',       label: 'Home · advertisement strip' },
    { id: 'home-split',     label: 'Home · split sets section' },
    { id: 'collection-top', label: 'Collection · above the grid' },
    { id: 'product-below',  label: 'Product page · below the details' },
    { id: 'custom-posters', label: 'Custom posters page' },
    { id: 'footer',         label: 'Footer · above the newsletter' },
]

const asBool = (v) => v === true || v === 'true' || v === 'on' || v === 1 || v === '1'

const fileUrl = (id) => (id ? `/api/media/file/${id}` : '')

const shape = (item) => ({
    id: item.id,
    title: item.title,
    caption: item.caption,
    kind: item.kind,
    slot: item.slot,
    url: item.externalUrl || fileUrl(item.fileId),
    poster: item.posterFileId ? fileUrl(item.posterFileId) : '',
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes,
    active: item.active !== false,
    order: item.order || 0,
    date: item.date,
})

// Upload a video or picture and pin it to a slot on the storefront.
const uploadMedia = async (req, res) => {
    try {
        const { title, caption, slot, kind, externalUrl, order } = req.body
        if (!slot) return res.json({ success: false, message: 'Pick where this should appear.' })

        const file = req.files?.file?.[0]
        const poster = req.files?.poster?.[0]

        if (!file && !externalUrl) {
            return res.json({ success: false, message: 'Choose a file or paste a link.' })
        }

        let fileId = null
        if (file) {
            fileId = newId()
            await putBinary(fileId, file.buffer, { contentType: file.mimetype, name: file.originalname, size: file.size })
        }

        let posterFileId = null
        if (poster) {
            posterFileId = newId()
            await putBinary(posterFileId, poster.buffer, { contentType: poster.mimetype, name: poster.originalname, size: poster.size })
        }

        const item = await db.media.put({
            title: title || file?.originalname || 'Untitled',
            caption: caption || '',
            kind: kind || (file?.mimetype?.startsWith('image/') ? 'image' : 'video'),
            slot,
            fileId,
            posterFileId,
            externalUrl: externalUrl || '',
            mimeType: file?.mimetype || '',
            sizeBytes: file?.size || 0,
            order: Number(order) || 0,
            active: true,
            date: Date.now(),
        })

        res.json({ success: true, message: 'Uploaded', media: shape(item) })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Everything, for the admin library.
const listMedia = async (req, res) => {
    try {
        const items = (await db.media.all()).sort((a, b) => (a.order || 0) - (b.order || 0) || b.date - a.date)
        res.json({ success: true, media: items.map(shape), slots: MEDIA_SLOTS })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// What the storefront asks for: the live items, grouped by slot.
const publicMedia = async (req, res) => {
    try {
        const items = (await db.media.find(m => m.active !== false))
            .sort((a, b) => (a.order || 0) - (b.order || 0) || b.date - a.date)

        const bySlot = {}
        for (const item of items) {
            bySlot[item.slot] = bySlot[item.slot] || []
            bySlot[item.slot].push(shape(item))
        }
        res.json({ success: true, media: bySlot })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateMedia = async (req, res) => {
    try {
        const { id, title, caption, slot, active, order } = req.body
        const existing = await db.media.byId(id)
        if (!existing) return res.json({ success: false, message: 'Not found' })

        const next = { ...existing }
        if (title !== undefined) next.title = title
        if (caption !== undefined) next.caption = caption
        if (slot !== undefined) next.slot = slot
        if (active !== undefined) next.active = asBool(active)
        if (order !== undefined) next.order = Number(order) || 0

        const item = await db.media.put(next)
        res.json({ success: true, message: 'Updated', media: shape(item) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const removeMedia = async (req, res) => {
    try {
        const item = await db.media.byId(req.body.id)
        if (!item) return res.json({ success: false, message: 'Not found' })
        await deleteBinary(item.fileId)
        await deleteBinary(item.posterFileId)
        await db.media.remove(item.id)
        res.json({ success: true, message: 'Removed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Serving the bytes themselves, with range support so videos can seek.
const serveFile = async (req, res) => {
    try {
        const stored = await getBinary(req.params.fileId)
        if (!stored) return res.status(404).json({ success: false, message: 'Not found' })

        const { buffer, metadata } = stored
        const type = metadata.contentType || 'application/octet-stream'
        const total = buffer.length

        res.setHeader('Content-Type', type)
        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

        const range = req.headers.range
        if (range) {
            const match = /bytes=(\d*)-(\d*)/.exec(range)
            const start = match && match[1] ? parseInt(match[1], 10) : 0
            const end = match && match[2] ? parseInt(match[2], 10) : total - 1
            if (start >= total || end >= total || start > end) {
                return res.status(416).setHeader('Content-Range', `bytes */${total}`).end()
            }
            res.status(206)
            res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`)
            res.setHeader('Content-Length', end - start + 1)
            return res.end(buffer.subarray(start, end + 1))
        }

        res.setHeader('Content-Length', total)
        res.end(buffer)

    } catch (error) {
        console.log(error)
        if (!res.headersSent) res.status(404).json({ success: false, message: 'Not found' })
    }
}

export { uploadMedia, listMedia, publicMedia, updateMedia, removeMedia, serveFile }
