import { db } from "../lib/db.js"
import { totalStock } from "./productController.js"

const DAY = 24 * 60 * 60 * 1000

// Money only counts once it has actually been paid for.
const PAID_STATUSES = ['Paid', 'Printing', 'Packed', 'Shipped', 'Delivered']

const sum = (rows, field) => rows.reduce((total, row) => total + (row[field] || 0), 0)

// Everything the dashboard shows, in one round trip.
const dashboard = async (req, res) => {
    try {
        const now = Date.now()
        const orders = (await db.orders.all()).sort((a, b) => b.date - a.date)
        const products = await db.products.all()

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
            daily.push({ date: start, orders: dayOrders.length, revenue: sum(paid(dayOrders), 'amount') })
        }

        // What is selling, counted off the orders themselves.
        const soldBySku = new Map()
        for (const order of orders) {
            for (const item of order.items || []) {
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
                id: p.id,
                sku: p.sku,
                name: p.name,
                outOfStock: !!p.outOfStock,
                total: totalStock(p),
                sizes: p.stock || [],
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
                active: products.filter(p => p.active !== false).length,
                outOfStock: products.filter(p => p.outOfStock).length,
            },
            recentOrders: orders.slice(0, 8).map(o => ({
                id: o.id,
                reference: o.reference,
                customerName: o.customerName,
                amount: o.amount,
                status: o.status,
                date: o.date,
                items: (o.items || []).length,
            })),
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// --- Site settings ---------------------------------------------------------

const defaults = {
    id: 'site',
    marqueeMessages: [
        'Free Delivery from ₹399',
        'Free Mystery Gift Pack on Orders Above ₹599 — More Merch, More Savings!',
    ],
    ribbonMessages: [
        'Mystery gift on orders above ₹599',
        'Get 5% OFF with your Student ID',
        'Sunday = Fandom Fun',
    ],
    announcement: '',
    whatsappNumber: '918870333236',
    freeDeliveryFrom: 399,
    platformFee: 4,
    deliveryDaysChennai: '2-3',
    deliveryDaysIndia: '4-7',
}

const loadSettings = async () => {
    const existing = await db.settings.byId('site')
    if (existing) return existing
    return db.settings.put(defaults)
}

const getSettings = async (req, res) => {
    try {
        res.json({ success: true, settings: await loadSettings() })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateSettings = async (req, res) => {
    try {
        const settings = { ...(await loadSettings()) }
        const fields = ['marqueeMessages', 'ribbonMessages', 'announcement', 'whatsappNumber',
                        'freeDeliveryFrom', 'platformFee', 'deliveryDaysChennai', 'deliveryDaysIndia']

        for (const field of fields) {
            if (req.body[field] === undefined) continue
            const value = req.body[field]
            if (Array.isArray(defaults[field])) {
                settings[field] = Array.isArray(value)
                    ? value.filter(Boolean)
                    : String(value).split('\n').map(v => v.trim()).filter(Boolean)
            } else {
                settings[field] = value
            }
        }
        settings.updatedAt = Date.now()

        const saved = await db.settings.put(settings)
        res.json({ success: true, message: 'Settings saved', settings: saved })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// --- Coupons ---------------------------------------------------------------

const withMongoId = (coupon) => ({ ...coupon, _id: coupon.id })

const listCoupons = async (req, res) => {
    try {
        const coupons = (await db.coupons.all()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        res.json({ success: true, coupons: coupons.map(withMongoId) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const saveCoupon = async (req, res) => {
    try {
        const { id, code, percent, active, minOrder, expiresAt, usageLimit, note } = req.body
        const cleanCode = (code || '').trim().toUpperCase()
        if (!cleanCode) return res.json({ success: false, message: 'A code is required.' })
        if (!Number(percent)) return res.json({ success: false, message: 'Set a discount percentage.' })

        const clash = await db.coupons.findOne(c => c.code === cleanCode && c.id !== String(id || ''))
        if (clash) return res.json({ success: false, message: 'That code already exists.' })

        const existing = id ? await db.coupons.byId(id) : null
        const coupon = await db.coupons.put({
            ...(existing || { usedCount: 0, createdAt: Date.now() }),
            ...(existing ? { id: existing.id } : {}),
            code: cleanCode,
            percent: Number(percent),
            active: active === undefined ? true : (active === true || active === 'true'),
            minOrder: Number(minOrder) || 0,
            expiresAt: expiresAt ? new Date(expiresAt).getTime() : null,
            usageLimit: Number(usageLimit) || 0,
            note: note || '',
        })

        res.json({ success: true, message: 'Coupon saved', coupon: withMongoId(coupon) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const removeCoupon = async (req, res) => {
    try {
        await db.coupons.remove(req.body.id)
        res.json({ success: true, message: 'Coupon removed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Why a code cannot be used right now, or null when it can.
const whyNotUsable = (coupon, orderValue) => {
    if (!coupon.active) return 'This code is no longer active.'
    if (coupon.expiresAt && Date.now() > coupon.expiresAt) return 'This code has expired.'
    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) return 'This code has been fully claimed.'
    if (coupon.minOrder && orderValue < coupon.minOrder) return `Spend ₹${coupon.minOrder} to use this code.`
    return null
}

// What the storefront calls when a shopper types a code.
const validateCoupon = async (req, res) => {
    try {
        const code = (req.body.code || '').trim().toUpperCase()
        const orderValue = Number(req.body.orderValue) || 0
        if (!code) return res.json({ success: false, message: 'Enter a code.' })

        const coupon = await db.coupons.findOne(c => c.code === code)
        if (!coupon) return res.json({ success: false, message: "That code isn't valid." })

        const problem = whyNotUsable(coupon, orderValue)
        if (problem) return res.json({ success: false, message: problem })

        res.json({ success: true, code: coupon.code, percent: coupon.percent })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { dashboard, getSettings, updateSettings, listCoupons, saveCoupon, removeCoupon, validateCoupon }
