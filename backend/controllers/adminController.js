import orderModel from "../models/orderModel.js"
import productModel from "../models/productModel.js"
import settingModel from "../models/settingModel.js"
import couponModel from "../models/couponModel.js"

const DAY = 24 * 60 * 60 * 1000

// Money only counts once it has actually been paid for.
const PAID_STATUSES = ['Paid', 'Printing', 'Packed', 'Shipped', 'Delivered']

const sum = (rows, field) => rows.reduce((total, row) => total + (row[field] || 0), 0)

// Everything the dashboard shows, in one round trip.
const dashboard = async (req, res) => {
    try {
        const now = Date.now()
        const orders = await orderModel.find({}).sort({ date: -1 })
        const products = await productModel.find({})

        const since = (days) => orders.filter(o => o.date >= now - days * DAY)
        const paid = (rows) => rows.filter(o => PAID_STATUSES.includes(o.status) || o.payment)

        const revenue = {
            today: sum(paid(since(1)), 'amount'),
            week: sum(paid(since(7)), 'amount'),
            month: sum(paid(since(30)), 'amount'),
            all: sum(paid(orders), 'amount'),
            // Placed but not yet paid — what is still to collect.
            pending: sum(orders.filter(o => !PAID_STATUSES.includes(o.status) && !o.payment), 'amount'),
        }

        const counts = { total: orders.length, today: since(1).length, week: since(7).length }
        for (const order of orders) {
            counts[order.status] = (counts[order.status] || 0) + 1
        }

        // Revenue per day for the last fortnight, for the chart.
        const daily = []
        for (let i = 13; i >= 0; i--) {
            const start = new Date(now - i * DAY).setHours(0, 0, 0, 0)
            const end = start + DAY
            const dayOrders = orders.filter(o => o.date >= start && o.date < end)
            daily.push({
                date: start,
                orders: dayOrders.length,
                revenue: sum(paid(dayOrders), 'amount'),
            })
        }

        // What is selling, counted off the orders themselves.
        const soldBySku = new Map()
        for (const order of orders) {
            for (const item of order.items) {
                const key = item.sku || item.name
                const entry = soldBySku.get(key) || { key, name: item.name, quantity: 0, revenue: 0 }
                entry.quantity += item.quantity
                entry.revenue += item.lineTotal || 0
                soldBySku.set(key, entry)
            }
        }
        const topProducts = [...soldBySku.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 8)

        const lowStock = products
            .map(p => ({
                id: p._id.toString(),
                sku: p.sku,
                name: p.name,
                outOfStock: p.outOfStock,
                total: p.stock.reduce((t, s) => t + (s.available ? s.quantity : 0), 0),
                sizes: p.stock.map(s => ({ size: s.size, quantity: s.quantity, available: s.available })),
            }))
            .filter(p => p.outOfStock || p.total <= 5)
            .sort((a, b) => a.total - b.total)
            .slice(0, 12)

        res.json({
            success: true,
            revenue,
            counts,
            daily,
            topProducts,
            lowStock,
            catalogue: {
                products: products.length,
                active: products.filter(p => p.active).length,
                outOfStock: products.filter(p => p.outOfStock).length,
            },
            recentOrders: orders.slice(0, 8).map(o => ({
                id: o._id.toString(),
                reference: o.reference,
                customerName: o.customerName,
                amount: o.amount,
                status: o.status,
                date: o.date,
                items: o.items.length,
            })),
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// --- Site settings ---------------------------------------------------------

const defaults = {
    key: 'site',
    marqueeMessages: [
        'Free Delivery from ₹399',
        'Free Mystery Gift Pack on Orders Above ₹599 — More Merch, More Savings!',
    ],
    ribbonMessages: [
        'Mystery gift on orders above ₹599',
        'Get 5% OFF with your Student ID',
        'Sunday = Fandom Fun',
    ],
}

const loadSettings = async () => {
    let settings = await settingModel.findOne({ key: 'site' })
    if (!settings) settings = await settingModel.create(defaults)
    return settings
}

const getSettings = async (req, res) => {
    try {
        const settings = await loadSettings()
        res.json({ success: true, settings })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateSettings = async (req, res) => {
    try {
        const settings = await loadSettings()
        const fields = ['marqueeMessages', 'ribbonMessages', 'announcement', 'whatsappNumber',
                        'freeDeliveryFrom', 'platformFee', 'deliveryDaysChennai', 'deliveryDaysIndia']
        for (const field of fields) {
            if (req.body[field] === undefined) continue
            const value = req.body[field]
            if (Array.isArray(settings[field])) {
                settings[field] = Array.isArray(value)
                    ? value.filter(Boolean)
                    : String(value).split('\n').map(v => v.trim()).filter(Boolean)
            } else {
                settings[field] = value
            }
        }
        settings.updatedAt = Date.now()
        await settings.save()
        res.json({ success: true, message: 'Settings saved', settings })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// --- Coupons ---------------------------------------------------------------

const listCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find({}).sort({ createdAt: -1 })
        res.json({ success: true, coupons })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const saveCoupon = async (req, res) => {
    try {
        const { id, code, percent, active, minOrder, expiresAt, usageLimit, note } = req.body
        const payload = {
            code: (code || '').trim().toUpperCase(),
            percent: Number(percent),
            active: active === undefined ? true : (active === true || active === 'true'),
            minOrder: Number(minOrder) || 0,
            expiresAt: expiresAt ? new Date(expiresAt).getTime() : null,
            usageLimit: Number(usageLimit) || 0,
            note: note || '',
        }
        if (!payload.code) return res.json({ success: false, message: 'A code is required.' })
        if (!payload.percent) return res.json({ success: false, message: 'Set a discount percentage.' })

        const coupon = id
            ? await couponModel.findByIdAndUpdate(id, payload, { new: true })
            : await couponModel.create(payload)

        res.json({ success: true, message: 'Coupon saved', coupon })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.code === 11000 ? 'That code already exists.' : error.message })
    }
}

const removeCoupon = async (req, res) => {
    try {
        await couponModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Coupon removed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// What the storefront calls when a shopper types a code.
const validateCoupon = async (req, res) => {
    try {
        const code = (req.body.code || '').trim().toUpperCase()
        const orderValue = Number(req.body.orderValue) || 0
        if (!code) return res.json({ success: false, message: 'Enter a code.' })

        const coupon = await couponModel.findOne({ code })
        if (!coupon) return res.json({ success: false, message: "That code isn't valid." })

        const problem = coupon.whyNotUsable(orderValue)
        if (problem) return res.json({ success: false, message: problem })

        res.json({ success: true, code: coupon.code, percent: coupon.percent })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { dashboard, getSettings, updateSettings, listCoupons, saveCoupon, removeCoupon, validateCoupon }
