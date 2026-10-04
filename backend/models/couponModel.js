import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    percent: { type: Number, required: true, min: 1, max: 90 },
    active: { type: Boolean, default: true },
    minOrder: { type: Number, default: 0 },
    expiresAt: { type: Number, default: null },
    usageLimit: { type: Number, default: 0 },   // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    note: { type: String, default: '' },
}, { timestamps: true })

// Why a code cannot be used right now, or null when it can.
couponSchema.methods.whyNotUsable = function whyNotUsable(orderValue = 0) {
    if (!this.active) return 'This code is no longer active.'
    if (this.expiresAt && Date.now() > this.expiresAt) return 'This code has expired.'
    if (this.usageLimit && this.usedCount >= this.usageLimit) return 'This code has been fully claimed.'
    if (this.minOrder && orderValue < this.minOrder) return `Spend ₹${this.minOrder} to use this code.`
    return null
}

const couponModel = mongoose.models.coupon || mongoose.model('coupon', couponSchema)
export default couponModel
