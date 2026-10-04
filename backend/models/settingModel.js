import mongoose from 'mongoose'

// One row holding everything the admin can reword without a deploy.
const settingSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: 'site' },
    marqueeMessages: { type: [String], default: [] },
    ribbonMessages: { type: [String], default: [] },
    announcement: { type: String, default: '' },
    whatsappNumber: { type: String, default: '918870333236' },
    freeDeliveryFrom: { type: Number, default: 399 },
    platformFee: { type: Number, default: 4 },
    minOrderBySize: { type: Object, default: {} },
    deliveryDaysChennai: { type: String, default: '2-3' },
    deliveryDaysIndia: { type: String, default: '4-7' },
    updatedAt: { type: Number, default: () => Date.now() },
})

const settingModel = mongoose.models.setting || mongoose.model('setting', settingSchema)
export default settingModel
