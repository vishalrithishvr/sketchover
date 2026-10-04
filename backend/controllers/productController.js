import productModel from "../models/productModel.js"
import { putFile, deleteFile, mediaUrl } from "../config/gridfs.js"

const parseList = (value, fallback = []) => {
    if (value === undefined || value === null || value === '') return fallback
    if (Array.isArray(value)) return value
    try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : fallback
    } catch {
        return String(value).split(',').map(v => v.trim()).filter(Boolean)
    }
}

const asBool = (value) => value === true || value === 'true' || value === 'on' || value === 1 || value === '1'

// Uploaded images go to GridFS; anything already a URL is kept as-is.
const collectImages = async (req) => {
    const uploaded = []
    for (const key of ['image1', 'image2', 'image3', 'image4']) {
        const file = req.files?.[key]?.[0]
        if (file) uploaded.push(mediaUrl(await putFile(file)))
    }
    return uploaded
}

// The next free sku, so the admin never has to invent one.
const nextSku = async () => {
    const latest = await productModel.find({ sku: /^sk\d+$/ }).sort({ sku: -1 }).limit(1)
    const highest = latest[0] ? parseInt(latest[0].sku.slice(2), 10) : 0
    return `sk${String(Math.max(highest, 0) + 1).padStart(3, '0')}`
}

const buildStock = (sizes, stockInput, fallbackQty = 25) => {
    const given = parseList(stockInput, [])
    return sizes.map(size => {
        const match = given.find(entry => entry.size === size)
        return {
            size,
            quantity: match ? Number(match.quantity) || 0 : fallbackQty,
            available: match ? match.available !== false : true,
        }
    })
}

const addProduct = async (req, res) => {
    try {
        const { name, description, price, originalPrice, category, subCategory, sizes, bestseller,
                panels, orientation, tags, sku, stock } = req.body

        const sizeList = parseList(sizes, ['A4'])
        const images = await collectImages(req)
        const extraUrls = parseList(req.body.imageUrls, [])

        if (images.length === 0 && extraUrls.length === 0) {
            return res.json({ success: false, message: 'Add at least one image.' })
        }

        const product = new productModel({
            sku: (sku || '').trim() || await nextSku(),
            name,
            description: description || '',
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            image: [...images, ...extraUrls],
            category,
            subCategory: subCategory || 'Single',
            sizes: sizeList,
            panels: panels ? Number(panels) : null,
            orientation: orientation || null,
            bestseller: asBool(bestseller),
            tags: parseList(tags, []),
            stock: buildStock(sizeList, stock),
            date: Date.now(),
        })

        await product.save()
        res.json({ success: true, message: `${product.name} added`, product: product.toStorefront() })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.code === 11000 ? 'That SKU already exists.' : error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.body
        const product = await productModel.findById(id)
        if (!product) return res.json({ success: false, message: 'Product not found' })

        const fields = ['name', 'description', 'category', 'subCategory', 'orientation']
        fields.forEach(field => {
            if (req.body[field] !== undefined) product[field] = req.body[field]
        })
        if (req.body.price !== undefined) product.price = Number(req.body.price)
        if (req.body.originalPrice !== undefined) product.originalPrice = Number(req.body.originalPrice) || undefined
        if (req.body.panels !== undefined) product.panels = req.body.panels ? Number(req.body.panels) : null
        if (req.body.bestseller !== undefined) product.bestseller = asBool(req.body.bestseller)
        if (req.body.active !== undefined) product.active = asBool(req.body.active)
        if (req.body.tags !== undefined) product.tags = parseList(req.body.tags, [])

        if (req.body.sizes !== undefined) {
            product.sizes = parseList(req.body.sizes, product.sizes)
            product.stock = buildStock(product.sizes, JSON.stringify(product.stock))
        }

        const newImages = await collectImages(req)
        if (newImages.length) product.image = [...product.image, ...newImages]
        if (req.body.image !== undefined) product.image = parseList(req.body.image, product.image)

        await product.save()
        res.json({ success: true, message: 'Product updated', product: product.toStorefront() })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// The out-of-stock switch, for the whole poster or one size.
const setStock = async (req, res) => {
    try {
        const { id, outOfStock, stock, size, quantity, available } = req.body
        const product = await productModel.findById(id)
        if (!product) return res.json({ success: false, message: 'Product not found' })

        if (outOfStock !== undefined) product.outOfStock = asBool(outOfStock)

        if (size) {
            const entry = product.stock.find(s => s.size === size)
            if (entry) {
                if (quantity !== undefined) entry.quantity = Math.max(0, Number(quantity) || 0)
                if (available !== undefined) entry.available = asBool(available)
            } else {
                product.stock.push({ size, quantity: Math.max(0, Number(quantity) || 0), available: available !== false })
            }
        }

        if (stock !== undefined) {
            product.stock = buildStock(product.sizes, stock)
        }

        // A poster with nothing left anywhere is off the floor automatically.
        const anyLeft = product.stock.some(s => s.available && s.quantity > 0)
        if (!anyLeft && product.stock.length > 0 && outOfStock === undefined) product.outOfStock = true

        await product.save()
        res.json({ success: true, message: 'Stock updated', product: product.toStorefront() })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// What the storefront reads: live products only.
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({ active: true }).sort({ date: -1 })
        res.json({ success: true, products: products.map(p => p.toStorefront()) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// What the admin reads: everything, with the stock detail.
const adminListProducts = async (req, res) => {
    try {
        const products = await productModel.find({}).sort({ createdAt: -1 })
        res.json({
            success: true,
            products: products.map(p => ({
                ...p.toStorefront(),
                id: p._id.toString(),
                sku: p.sku,
                active: p.active,
                stock: p.stock,
                sold: p.sold,
                totalStock: p.stock.reduce((sum, s) => sum + (s.available ? s.quantity : 0), 0),
            })),
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.id)
        if (!product) return res.json({ success: false, message: 'Product not found' })

        // Clear up any images this product owned in GridFS.
        for (const url of product.image) {
            const match = /\/api\/media\/file\/([a-f\d]{24})/.exec(url)
            if (match) await deleteFile(match[1])
        }
        await product.deleteOne()
        res.json({ success: true, message: 'Product removed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        // Look up by sku ("sk001") or by the database id, whichever came in.
        const query = /^[a-f\d]{24}$/.test(productId || '')
            ? { $or: [{ sku: productId }, { _id: productId }] }
            : { sku: productId }
        const product = await productModel.findOne(query)
        if (!product) return res.json({ success: false, message: 'Product not found' })
        res.json({ success: true, product: product.toStorefront() })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, adminListProducts, addProduct, updateProduct, setStock, removeProduct, singleProduct }
