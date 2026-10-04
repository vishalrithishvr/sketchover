import mongoose from 'mongoose'

export const ORDER_STATUSES = [
    'Order Placed',
    'Payment Pending',
    'Paid',
    'Printing',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled',
]

const itemSchema = new mongoose.Schema({
    sku: { type: String },
    name: { type: String, required: true },
    image: { type: String },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
    isCustom: { type: Boolean, default: false },
    // Artwork the shopper uploaded, named so the studio can match it to the
    // files that arrive on WhatsApp.
    fileNames: { type: [String], default: [] },
    posterType: { type: String },
    panels: { type: Number },
}, { _id: false })

const orderSchema = new mongoose.Schema({
    reference: { type: String, required: true, unique: true, index: true },
    // Guests can order: there is no account wall in front of the shop.
    userId: { type: String, default: 'guest' },
    items: { type: [itemSchema], required: true },

    subtotal: { type: Number, required: true },
    comboDiscount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    couponDiscount: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    amount: { type: Number, required: true },

    address: { type: Object, required: true },
    customerName: { type: String },
    phone: { type: String },
    email: { type: String },
    isChennai: { type: Boolean, default: false },

    status: { type: String, required: true, default: 'Order Placed', enum: ORDER_STATUSES, index: true },
    statusHistory: {
        type: [{ status: String, at: Number, note: String }],
        default: [],
    },
    paymentMethod: { type: String, required: true, default: 'WhatsApp' },
    payment: { type: Boolean, required: true, default: false },
    notes: { type: String, default: '' },

    date: { type: Number, required: true, default: () => Date.now() },
}, { timestamps: true })

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;
