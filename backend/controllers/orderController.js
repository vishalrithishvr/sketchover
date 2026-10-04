import orderModel, { ORDER_STATUSES } from "../models/orderModel.js"
import productModel from "../models/productModel.js"
import couponModel from "../models/couponModel.js"

// SKO-261004-4F2A
const makeReference = () => {
    const d = new Date()
    const stamp = [d.getFullYear() % 100, d.getMonth() + 1, d.getDate()]
        .map(n => String(n).padStart(2, '0')).join('')
    return `SKO-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

// Take stock off the shelf for what was just bought. Custom prints are made to
// order, so they have no stock to move.
const drawDownStock = async (items) => {
    for (const item of items) {
        if (item.isCustom || !item.sku) continue
        const product = await productModel.findOne({ sku: item.sku })
        if (!product) continue

        const entry = product.stock.find(s => s.size === item.size)
        if (entry) {
            entry.quantity = Math.max(0, entry.quantity - item.quantity)
            if (entry.quantity === 0) entry.available = false
        }
        product.sold += item.quantity
        if (product.stock.length && !product.stock.some(s => s.available && s.quantity > 0)) {
            product.outOfStock = true
        }
        await product.save()
    }
}

// The storefront books the order here when the shopper confirms it, before the
// WhatsApp hand-off, so the studio sees it even if the chat is never sent.
const placeOrder = async (req, res) => {
    try {
        const { items, address, subtotal, comboDiscount, couponCode, couponDiscount,
                platformFee, amount, isChennai, paymentMethod, reference } = req.body

        if (!Array.isArray(items) || items.length === 0) {
            return res.json({ success: false, message: 'The cart is empty.' })
        }
        if (!address || !address.firstName || !address.phone) {
            return res.json({ success: false, message: 'A delivery address is required.' })
        }

        const order = new orderModel({
            reference: reference || makeReference(),
            userId: req.body.userId || 'guest',
            items,
            subtotal: Number(subtotal) || 0,
            comboDiscount: Number(comboDiscount) || 0,
            couponCode: (couponCode || '').toUpperCase(),
            couponDiscount: Number(couponDiscount) || 0,
            platformFee: Number(platformFee) || 0,
            amount: Number(amount) || 0,
            address,
            customerName: `${address.firstName || ''} ${address.lastName || ''}`.trim(),
            phone: address.phone,
            email: address.email,
            isChennai: !!isChennai,
            paymentMethod: paymentMethod || 'WhatsApp',
            status: 'Order Placed',
            statusHistory: [{ status: 'Order Placed', at: Date.now(), note: 'Placed on the website' }],
            date: Date.now(),
        })

        await order.save()
        await drawDownStock(items)

        if (order.couponCode) {
            await couponModel.updateOne({ code: order.couponCode }, { $inc: { usedCount: 1 } })
        }

        res.json({ success: true, message: 'Order placed', reference: order.reference, orderId: order._id })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const allOrders = async (req, res) => {
    try {
        const { status, search, limit } = req.body
        const query = {}
        if (status && status !== 'All') query.status = status
        if (search) {
            const rx = new RegExp(String(search).trim(), 'i')
            query.$or = [{ reference: rx }, { customerName: rx }, { phone: rx }, { email: rx }]
        }

        const orders = await orderModel.find(query).sort({ date: -1 }).limit(Number(limit) || 200)
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId }).sort({ date: -1 })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Look an order up by its reference — what a customer quotes on WhatsApp.
const trackOrder = async (req, res) => {
    try {
        const order = await orderModel.findOne({ reference: (req.body.reference || '').trim().toUpperCase() })
        if (!order) return res.json({ success: false, message: 'No order with that reference.' })
        res.json({
            success: true,
            order: {
                reference: order.reference,
                status: order.status,
                statusHistory: order.statusHistory,
                date: order.date,
                amount: order.amount,
                items: order.items.map(i => ({ name: i.name, size: i.size, quantity: i.quantity })),
            },
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status, note, payment } = req.body
        if (status && !ORDER_STATUSES.includes(status)) {
            return res.json({ success: false, message: 'Unknown status' })
        }

        const order = await orderModel.findById(orderId)
        if (!order) return res.json({ success: false, message: 'Order not found' })

        if (status && status !== order.status) {
            order.status = status
            order.statusHistory.push({ status, at: Date.now(), note: note || '' })
            if (status === 'Paid') order.payment = true
        }
        if (payment !== undefined) order.payment = payment === true || payment === 'true'
        if (note !== undefined && !status) order.notes = note

        await order.save()
        res.json({ success: true, message: 'Order updated', order })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, allOrders, userOrders, updateStatus, trackOrder, ORDER_STATUSES }
