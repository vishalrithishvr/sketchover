import mongoose from 'mongoose'

// Where a piece of media can be shown on the storefront. The admin picks a slot
// when uploading, and the page for that slot renders whatever is live there.
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

const mediaSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    caption: { type: String, default: '' },
    // 'video' or 'image'
    kind: { type: String, required: true, default: 'video' },
    slot: { type: String, required: true, index: true },
    // GridFS file id, or an external URL (YouTube, CDN) when linked instead.
    fileId: { type: mongoose.Schema.Types.ObjectId, default: null },
    externalUrl: { type: String, default: '' },
    posterFileId: { type: mongoose.Schema.Types.ObjectId, default: null },
    mimeType: { type: String, default: '' },
    sizeBytes: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    date: { type: Number, default: () => Date.now() },
}, { timestamps: true })

const mediaModel = mongoose.models.media || mongoose.model('media', mediaSchema)
export default mediaModel
