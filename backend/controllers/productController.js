import { db, putBinary, deleteBinary, newId } from "../lib/db.js"

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

export const fileUrl = (id) => (id ? `/api/media/file/${id}` : '')

// What the storefront reads, in the shape it already expects.
export const toStorefront = (product) => ({
    _id: product.sku,
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image || [],
    category: product.category,
    subCategory: product.subCategory,
    panels: product.panels || null,
    orientation: product.orientation || null,
    sizes: product.sizes || [],
    bestseller: !!product.bestseller,
    isCustom: !!product.isCustom,
    tags: product.tags || [],
    outOfStock: !!product.outOfStock,
    // Sizes with nothing left are hidden from the picker.
    soldOutSizes: (product.stock || []).filter(s => !s.available || s.quantity <= 0).map(s => s.size),
    date: product.date,
})

const totalStock = (product) => (product.stock || []).reduce((t, s) => t + (s.available ? s.quantity : 0), 0)

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

// Uploaded images are stored and referenced by url.
const collectImages = async (req) => {
    const urls = []
    for (const key of ['image1', 'image2', 'image3', 'image4']) {
        const file = req.files?.[key]?.[0]
        if (!file) continue
        const id = newId()
        await putBinary(id, file.buffer, { contentType: file.mimetype, name: file.originalname, size: file.size })
        urls.push(fileUrl(id))
    }
    return urls
}

// The next free sku, so the admin never has to invent one.
const nextSku = async () => {
    const products = await db.products.all()
    const highest = products
        .map(p => parseInt(String(p.sku).replace(/\D/g, ''), 10))
        .filter(n => !Number.isNaN(n))
        .reduce((max, n) => Math.max(max, n), 0)
    return `sk${String(highest + 1).padStart(3, '0')}`
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

        const wantedSku = (sku || '').trim() || await nextSku()
        if (await db.products.findOne(p => p.sku === wantedSku)) {
            return res.json({ success: false, message: 'That SKU already exists.' })
        }

        const product = await db.products.put({
            sku: wantedSku,
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
            isCustom: false,
            tags: parseList(tags, []),
            stock: buildStock(sizeList, stock),
            outOfStock: false,
            active: true,
            sold: 0,
            date: Date.now(),
        })

        res.json({ success: true, message: `${product.name} added`, product: toStorefront(product) })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        const existing = await db.products.byId(req.body.id)
        if (!existing) return res.json({ success: false, message: 'Product not found' })

        const changes = { ...existing }
        for (const field of ['name', 'description', 'category', 'subCategory', 'orientation']) {
            if (req.body[field] !== undefined) changes[field] = req.body[field]
        }
        if (req.body.price !== undefined) changes.price = Number(req.body.price)
        if (req.body.originalPrice !== undefined) changes.originalPrice = Number(req.body.originalPrice) || undefined
        if (req.body.panels !== undefined) changes.panels = req.body.panels ? Number(req.body.panels) : null
        if (req.body.bestseller !== undefined) changes.bestseller = asBool(req.body.bestseller)
        if (req.body.active !== undefined) changes.active = asBool(req.body.active)
        if (req.body.tags !== undefined) changes.tags = parseList(req.body.tags, [])

        if (req.body.sizes !== undefined) {
            changes.sizes = parseList(req.body.sizes, existing.sizes)
            changes.stock = buildStock(changes.sizes, JSON.stringify(existing.stock || []))
        }

        const newImages = await collectImages(req)
        if (newImages.length) changes.image = [...(existing.image || []), ...newImages]
        if (req.body.image !== undefined) changes.image = parseList(req.body.image, existing.image)

        const product = await db.products.put(changes)
        res.json({ success: true, message: 'Product updated', product: toStorefront(product) })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// The out-of-stock switch, for the whole poster or one size.
const setStock = async (req, res) => {
    try {
        const { id, outOfStock, stock, size, quantity, available } = req.body
        const existing = await db.products.byId(id)
        if (!existing) return res.json({ success: false, message: 'Product not found' })

        const next = { ...existing, stock: [...(existing.stock || [])] }

        if (outOfStock !== undefined) next.outOfStock = asBool(outOfStock)

        if (size) {
            const at = next.stock.findIndex(s => s.size === size)
            const entry = at === -1
                ? { size, quantity: 0, available: true }
                : { ...next.stock[at] }
            if (quantity !== undefined) entry.quantity = Math.max(0, Number(quantity) || 0)
            if (available !== undefined) entry.available = asBool(available)
            if (at === -1) next.stock.push(entry)
            else next.stock[at] = entry
        }

        if (stock !== undefined) next.stock = buildStock(next.sizes || [], stock)

        // A poster with nothing left anywhere is off the floor automatically.
        if (outOfStock === undefined && next.stock.length > 0 && !next.stock.some(s => s.available && s.quantity > 0)) {
            next.outOfStock = true
        }

        const product = await db.products.put(next)
        res.json({ success: true, message: 'Stock updated', product: toStorefront(product) })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// What the storefront reads: live products only, newest first.
const listProducts = async (req, res) => {
    try {
        const products = (await db.products.find(p => p.active !== false)).sort((a, b) => b.date - a.date)
        res.json({ success: true, products: products.map(toStorefront) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// What the admin reads: everything, with the stock detail.
const adminListProducts = async (req, res) => {
    try {
        const products = (await db.products.all()).sort((a, b) => b.date - a.date)
        res.json({
            success: true,
            products: products.map(p => ({
                ...toStorefront(p),
                id: p.id,
                sku: p.sku,
                active: p.active !== false,
                stock: p.stock || [],
                sold: p.sold || 0,
                totalStock: totalStock(p),
            })),
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const removeProduct = async (req, res) => {
    try {
        const product = await db.products.byId(req.body.id)
        if (!product) return res.json({ success: false, message: 'Product not found' })

        // Clear up any images this product owned.
        for (const url of product.image || []) {
            const match = /\/api\/media\/file\/([\w-]+)/.exec(url)
            if (match) await deleteBinary(match[1])
        }
        await db.products.remove(product.id)
        res.json({ success: true, message: 'Product removed' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await db.products.findOne(p => p.sku === productId || p.id === productId)
        if (!product) return res.json({ success: false, message: 'Product not found' })
        res.json({ success: true, product: toStorefront(product) })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, adminListProducts, addProduct, updateProduct, setStock, removeProduct, singleProduct, totalStock }
