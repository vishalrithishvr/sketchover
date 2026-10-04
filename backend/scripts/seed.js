// Fill the shop from the storefront's own catalogue file, against any running
// API — the one on your machine or the live one on Netlify.
//
//   API=https://sketchover-admin.netlify.app node scripts/seed.js
//   API=http://localhost:4000 node scripts/seed.js
//
// Signs in with ADMIN_EMAIL / ADMIN_PASSWORD from backend/.env. Posters that
// are already there are left alone; pass --replace to overwrite them.
import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL } from 'node:url'

const API = (process.env.API || 'http://localhost:4000').replace(/\/+$/, '')
const ASSETS_DIR = path.resolve('../frontend/src/assets')
const replace = process.argv.includes('--replace')

// The catalogue file imports images, which Node cannot. Swap each import for
// its path and the module becomes plain data.
const loadCatalogue = async () => {
    const source = await fs.readFile(path.join(ASSETS_DIR, 'assets.js'), 'utf8')
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

const post = async (route, body, token) => {
    const res = await fetch(`${API}${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { token } : {}) },
        body: JSON.stringify(body),
    })
    const text = await res.text()
    try {
        return JSON.parse(text)
    } catch {
        return { success: false, message: `${res.status}: ${text.slice(0, 120)}` }
    }
}

const run = async () => {
    console.log(`[seed] api: ${API}`)

    const login = await post('/api/user/admin', { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
    if (!login.success) throw new Error(`could not sign in: ${login.message}`)
    const token = login.token

    const { products, SIZES, CUSTOM_SIZES } = await loadCatalogue()
    console.log(`[seed] catalogue has ${products.length} posters`)

    let added = 0
    let skipped = 0
    let failed = 0

    for (const item of products) {
        const images = []
        for (const image of item.image) {
            const file = path.join(ASSETS_DIR, image.replace(/^\.\//, ''))
            const buffer = await fs.readFile(file)
            const ext = path.extname(file).toLowerCase()
            images.push({
                name: path.basename(file),
                type: ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg',
                size: buffer.length,
                data: buffer.toString('base64'),
            })
        }

        const sizes = item.sizes || (item.isCustom ? CUSTOM_SIZES : SIZES)
        const result = await post('/api/admin/seed', {
            replace,
            images,
            product: {
                sku: item._id,
                name: item.name,
                description: item.description || '',
                price: item.price,
                originalPrice: item.originalPrice,
                category: item.category,
                subCategory: item.subCategory || 'Single',
                sizes,
                panels: item.panels || null,
                orientation: item.orientation || null,
                bestseller: !!item.bestseller,
                isCustom: !!item.isCustom,
                tags: [],
                // Made to order, so a custom print never runs out.
                stock: item.isCustom ? [] : sizes.map(size => ({ size, quantity: 25, available: true })),
                outOfStock: false,
                active: true,
                sold: 0,
                date: item.date || Date.now(),
            },
        }, token)

        if (!result.success) { failed += 1; console.log(`[seed] ${item._id} failed: ${result.message}`) }
        else if (result.skipped) skipped += 1
        else added += 1
    }

    const basics = await post('/api/admin/seed-basics', {}, token)
    console.log(`[seed] posters: ${added} added, ${skipped} already there, ${failed} failed`)
    console.log(`[seed] coupons created: ${(basics.coupons || []).join(', ') || 'none needed'}`)
    if (failed) process.exitCode = 1
}

run().catch((error) => {
    console.error('[seed] failed:', error.message)
    process.exit(1)
})
