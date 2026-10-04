import mediaModel, { MEDIA_SLOTS } from "../models/mediaModel.js"
import { putFile, deleteFile, streamFile, mediaUrl } from "../config/gridfs.js"

const asBool = (v) => v === true || v === 'true' || v === 'on' || v === 1 || v === '1'

const shape = (item) => ({
    id: item._id.toString(),
    title: item.title,
    caption: item.caption,
    kind: item.kind,
    slot: item.slot,
    url: item.externalUrl || mediaUrl(item.fileId),
    poster: item.posterFileId ? mediaUrl(item.posterFileId) : '',
    mimeType: item.mimeType,
    sizeBytes: item.sizeBytes,
    active: item.active,
    order: item.order,
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

        const item = new mediaModel({
            title: title || file?.originalname || 'Untitled',
            caption: caption || '',
            kind: kind || (file?.mimetype?.startsWith('image/') ? 'image' : 'video'),
            slot,
            fileId: file ? await putFile(file) : null,
            posterFileId: poster ? await putFile(poster) : null,
            externalUrl: externalUrl || '',
            mimeType: file?.mimetype || '',
            sizeBytes: file?.size || 0,
            order: Number(order) || 0,
            active: true,
            date: Date.now(),
        })

        await item.save()
        res.json({ success: true, message: 'Uploaded', media: shape(item) })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Everything, for the admin library.
const listMedia = async (req, res) => {
    try {
        const items = await mediaModel.find({}).sort({ slot: 1, order: 1, date: -1 })
        res.json({ success: true, media: items.map(shape), slots: MEDIA_SLOTS })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// What the storefront asks for: the live items, grouped by slot.
const publicMedia = async (req, res) => {
    try {
        const items = await mediaModel.find({ active: true }).sort({ order: 1, date: -1 })
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
        const item = await mediaModel.findById(id)
        if (!item) return res.json({ success: false, message: 'Not found' })

        if (title !== undefined) item.title = title
        if (caption !== undefined) item.caption = caption
        if (slot !== undefined) item.slot = slot
        if (active !== undefined) item.active = asBool(active)
        if (order !== undefined) item.order = Number(order) || 0

        await item.save()
        res.json({ success: true, message: 'Updated', media: shape(item) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const removeMedia = async (req, res) => {
    try {
        const item = await mediaModel.findById(req.body.id)
        if (!item) return res.json({ success: false, message: 'Not found' })
        await deleteFile(item.fileId)
        await deleteFile(item.posterFileId)
        await item.deleteOne()
        res.json({ success: true, message: 'Removed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Serving the bytes themselves, with range support so videos can seek.
const serveFile = async (req, res) => {
    try {
        await streamFile(req.params.fileId, req, res)
    } catch (error) {
        console.log(error)
        if (!res.headersSent) res.status(404).json({ success: false, message: 'Not found' })
    }
}

export { uploadMedia, listMedia, publicMedia, updateMedia, removeMedia, serveFile, MEDIA_SLOTS }
