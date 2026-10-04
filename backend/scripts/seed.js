// Fill a fresh database from the storefront's own catalogue file, so the shop
// looks the same the moment the API comes up. Poster images are uploaded into
// GridFS, which makes the database the single thing a deploy depends on.
//
//   npm run seed            # add anything missing
//   npm run seed -- --force # wipe products/media and start over
import 'dotenv/config'
import mongoose from 'mongoose'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL } from 'node:url'
import connectDB from '../config/mongodb.js'
import { putFile, mediaUrl } from '../config/gridfs.js'
import productModel from '../models/productModel.js'
import settingModel from '../models/settingModel.js'
import couponModel from '../models/couponModel.js'

const ASSETS_DIR = path.resolve('../frontend/src/assets')
const ASSETS_FILE = path.join(ASSETS_DIR, 'assets.js')

// The catalogue file imports images; Node cannot. Swap those imports for the
// paths themselves and the module becomes plain data.
const loadCatalogue = async () => {
    const source = await fs.readFile(ASSETS_FILE, 'utf8')
    const asData = source.replace(
        /import\s+(\w+)\s+from\s+'(\.\/[^']+\.(?:jpg|jpeg|png|webp|svg))'/g,
        (_, name, file) => `const ${name} = ${JSON.stringify(file)}`
    )
    const temp = path.join(os.tmpdir(), `sko-catalogue-${Date.now()}.mjs`)
    await fs.writeFile(temp, asData, 'utf8')
    try {
        return await import(pathToFileURL(temp).href)
    } finally {
        fs.unlink(temp).catch(() => {})
    }
}

const uploadedCache = new Map()

const uploadAsset = async (relativePath) => {
    if (uploadedCache.has(relativePath)) return uploadedCache.get(relativePath)

    const filePath = path.join(ASSETS_DIR, relativePath.replace(/^\.\//, ''))
    const buffer = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'

    const id = await putFile({
        originalname: path.basename(filePath),
        mimetype: mime,
        buffer,
        size: buffer.length,
    })
    const url = mediaUrl(id)
    uploadedCache.set(relativePath, url)
    return url
}

const run = async () => {
    const force = process.argv.includes('--force')
    await connectDB()

    const catalogue = await loadCatalogue()
    const { products, SIZES, CUSTOM_SIZES } = catalogue
    console.log(`[seed] catalogue has ${products.length} products`)

    if (force) {
        await productModel.deleteMany({})
        console.log('[seed] cleared existing products')
    }

    let added = 0
    let skipped = 0

    for (const item of products) {
        const existing = await productModel.findOne({ sku: item._id })
        if (existing) { skipped += 1; continue }

        const images = []
        for (const image of item.image) {
            images.push(await uploadAsset(image))
        }

        const sizes = item.sizes || (item.isCustom ? CUSTOM_SIZES : SIZES)
        await productModel.create({
            sku: item._id,
            name: item.name,
            description: item.description || '',
            price: item.price,
            originalPrice: item.originalPrice,
            image: images,
            category: item.category,
            subCategory: item.subCategory || 'Single',
            sizes,
            panels: item.panels || null,
            orientation: item.orientation || null,
            bestseller: !!item.bestseller,
            isCustom: !!item.isCustom,
            // Made to order, so a custom print never runs out.
            stock: item.isCustom ? [] : sizes.map(size => ({ size, quantity: 25, available: true })),
            date: item.date || Date.now(),
        })
        added += 1
    }

    console.log(`[seed] products: ${added} added, ${skipped} already there`)

    // Settings the admin can edit afterwards.
    const settings = await settingModel.findOne({ key: 'site' })
    if (!settings) {
        await settingModel.create({
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
            minOrderBySize: catalogue.MIN_ORDER_BY_SIZE || {},
            platformFee: catalogue.PLATFORM_FEE || 4,
        })
        console.log('[seed] settings created')
    }

    // The codes the storefront used to carry in its source.
    for (const [code, percent] of Object.entries({ SKO10: 10, SKO5: 5, WELCOME5: 5, STUDENT5: 5 })) {
        const existing = await couponModel.findOne({ code })
        if (!existing) await couponModel.create({ code, percent, active: true })
    }
    console.log('[seed] coupons ready')

    await mongoose.disconnect()
    console.log('[seed] done')
}

run().catch(async (error) => {
    console.error('[seed] failed:', error.message)
    await mongoose.disconnect().catch(() => {})
    process.exit(1)
})
