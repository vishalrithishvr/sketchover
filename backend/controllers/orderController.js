import { db } from "../lib/db.js"

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
        const product = await db.products.findOne(p => p.sku === item.sku)
        if (!product) continue

        const stock = (product.stock || []).map(entry => {
            if (entry.size !== item.size) return entry
            const quantity = Math.max(0, entry.quantity - item.quantity)
            return { ...entry, quantity, available: quantity === 0 ? false : entry.available }
        })

        await db.products.put({
            ...product,
            stock,
            sold: (product.sold || 0) + item.quantity,
            outOfStock: stock.length > 0 && !stock.some(s => s.available && s.quantity > 0)
                ? true
                : product.outOfStock,
        })
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

        const order = await db.orders.put({
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
            payment: false,
            status: 'Order Placed',
            statusHistory: [{ status: 'Order Placed', at: Date.now(), note: 'Placed on the website' }],
            notes: '',
            date: Date.now(),
        })

        await drawDownStock(items)

        if (order.couponCode) {
            const coupon = await db.coupons.findOne(c => c.code === order.couponCode)
            if (coupon) await db.coupons.put({ ...coupon, usedCount: (coupon.usedCount || 0) + 1 })
        }

        res.json({ success: true, message: 'Order placed', reference: order.reference, orderId: order.id })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const allOrders = async (req, res) => {
    try {
        const { status, search, limit } = req.body
        let orders = (await db.orders.all()).sort((a, b) => b.date - a.date)

        if (status && status !== 'All') orders = orders.filter(o => o.status === status)
        if (search) {
            const needle = String(search).trim().toLowerCase()
            orders = orders.filter(o => [o.reference, o.customerName, o.phone, o.email]
                .filter(Boolean).some(field => String(field).toLowerCase().includes(needle)))
        }

        res.json({ success: true, orders: orders.slice(0, Number(limit) || 200).map(o => ({ ...o, _id: o.id })) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const userOrders = async (req, res) => {
    try {
        const orders = (await db.orders.find(o => o.userId === req.body.userId)).sort((a, b) => b.date - a.date)
        res.json({ success: true, orders: orders.map(o => ({ ...o, _id: o.id })) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Look an order up by its reference — what a customer quotes on WhatsApp.
const trackOrder = async (req, res) => {
    try {
        const reference = (req.body.reference || '').trim().toUpperCase()
        const order = await db.orders.findOne(o => o.reference === reference)
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

        const existing = await db.orders.byId(orderId)
        if (!existing) return res.json({ success: false, message: 'Order not found' })

        const next = { ...existing, statusHistory: [...(existing.statusHistory || [])] }

        if (status && status !== existing.status) {
            next.status = status
            next.statusHistory.push({ status, at: Date.now(), note: note || '' })
            if (status === 'Paid') next.payment = true
        }
        if (payment !== undefined) next.payment = payment === true || payment === 'true'
        if (note !== undefined && !status) next.notes = note

        const order = await db.orders.put(next)
        res.json({ success: true, message: 'Order updated', order: { ...order, _id: order.id } })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { placeOrder, allOrders, userOrders, updateStatus, trackOrder }
