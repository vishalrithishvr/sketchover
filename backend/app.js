import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { storageKind, db, putBinary, newId } from './lib/db.js'
import {
    listProducts, adminListProducts, addProduct, updateProduct,
    setStock, removeProduct, singleProduct,
} from './controllers/productController.js'
import { placeOrder, allOrders, updateStatus, trackOrder } from './controllers/orderController.js'
import { uploadMedia, listMedia, publicMedia, updateMedia, removeMedia, serveFile, MEDIA_SLOTS } from './controllers/mediaController.js'
import {
    dashboard, getSettings, updateSettings,
    listCoupons, saveCoupon, removeCoupon, validateCoupon,
} from './controllers/adminController.js'

// Files are held in memory on their way to storage. Netlify caps a function
// request at about 6 MB, so anything bigger belongs on YouTube — the media
// library takes a link for exactly that case.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } })

const adminAuth = (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) return res.json({ success: false, message: 'Not Authorized Login Again' })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded?.role !== 'admin' || decoded?.user !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        next()
    } catch (error) {
        const message = error.name === 'TokenExpiredError'
            ? 'Your session has expired — sign in again.'
            : 'Not Authorized Login Again'
        res.json({ success: false, message })
    }
}

export const createApp = () => {
    const app = express()

    app.use(express.json({ limit: '5mb' }))
    app.use(cors())

    const productImages = upload.fields([
        { name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 },
    ])
    const mediaFiles = upload.fields([{ name: 'file', maxCount: 1 }, { name: 'poster', maxCount: 1 }])

    // --- admin sign-in ------------------------------------------------------
    app.post('/api/user/admin', (req, res) => {
        const { email, password } = req.body || {}
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // A claim, never the credentials: a JWT payload is only base64.
            const token = jwt.sign({ role: 'admin', user: email }, process.env.JWT_SECRET, { expiresIn: '7d' })
            return res.json({ success: true, token })
        }
        res.json({ success: false, message: 'Invalid credentials' })
    })

    // --- storefront ---------------------------------------------------------
    app.get('/api/product/list', listProducts)
    app.post('/api/product/single', singleProduct)
    app.post('/api/order/place', placeOrder)
    app.post('/api/order/track', trackOrder)
    app.get('/api/media/public', publicMedia)
    app.get('/api/media/file/:fileId', serveFile)
    app.get('/api/admin/settings', getSettings)
    app.post('/api/admin/coupon/validate', validateCoupon)

    // --- admin --------------------------------------------------------------
    app.post('/api/product/admin-list', adminAuth, adminListProducts)
    app.post('/api/product/add', adminAuth, productImages, addProduct)
    app.post('/api/product/update', adminAuth, productImages, updateProduct)
    app.post('/api/product/stock', adminAuth, setStock)
    app.post('/api/product/remove', adminAuth, removeProduct)

    app.post('/api/order/list', adminAuth, allOrders)
    app.post('/api/order/status', adminAuth, updateStatus)

    app.post('/api/media/list', adminAuth, listMedia)
    app.post('/api/media/upload', adminAuth, mediaFiles, uploadMedia)
    app.post('/api/media/update', adminAuth, updateMedia)
    app.post('/api/media/remove', adminAuth, removeMedia)

    app.post('/api/admin/dashboard', adminAuth, dashboard)
    app.post('/api/admin/settings', adminAuth, updateSettings)
    app.post('/api/admin/coupon/list', adminAuth, listCoupons)
    app.post('/api/admin/coupon/save', adminAuth, saveCoupon)
    app.post('/api/admin/coupon/remove', adminAuth, removeCoupon)

    // Filling a fresh shop, one poster per request (Netlify caps a request at
    // about 6 MB, and a poster with its pictures is well under that).
    app.post('/api/admin/seed', adminAuth, async (req, res) => {
        try {
            const { product, images = [], replace = false } = req.body
            if (!product?.sku) return res.json({ success: false, message: 'A product with a sku is required.' })

            const existing = await db.products.findOne(p => p.sku === product.sku)
            if (existing && !replace) return res.json({ success: true, skipped: true, sku: product.sku })

            const urls = []
            for (const image of images) {
                const id = newId()
                await putBinary(id, Buffer.from(image.data, 'base64'), {
                    contentType: image.type || 'image/jpeg', name: image.name, size: image.size,
                })
                urls.push(`/api/media/file/${id}`)
            }

            const saved = await db.products.put({
                ...(existing ? { id: existing.id } : {}),
                ...product,
                image: urls.length ? urls : (product.image || []),
            })
            res.json({ success: true, sku: saved.sku, images: urls.length })
        } catch (error) {
            console.log(error)
            res.json({ success: false, message: error.message })
        }
    })

    // Settings and the starter coupons, once.
    app.post('/api/admin/seed-basics', adminAuth, async (req, res) => {
        try {
            const created = []
            for (const [code, percent] of Object.entries({ SKO10: 10, SKO5: 5, WELCOME5: 5, STUDENT5: 5 })) {
                if (!await db.coupons.findOne(c => c.code === code)) {
                    await db.coupons.put({ code, percent, active: true, minOrder: 0, usageLimit: 0, usedCount: 0, createdAt: Date.now() })
                    created.push(code)
                }
            }
            res.json({ success: true, coupons: created })
        } catch (error) {
            res.json({ success: false, message: error.message })
        }
    })

    // --- health -------------------------------------------------------------
    app.get('/health', async (req, res) => {
        try {
            const products = await db.products.all()
            res.json({ ok: true, storage: storageKind(), products: products.length, slots: MEDIA_SLOTS.length })
        } catch (error) {
            res.json({ ok: false, storage: storageKind(), message: error.message })
        }
    })

    app.get('/api', (req, res) => res.json({ ok: true, name: 'Sketchover API' }))

    return app
}

export default createApp
