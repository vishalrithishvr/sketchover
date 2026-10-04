// Storage for the shop.
//
// On Netlify the data lives in Netlify Blobs, which every site gets for free —
// no second account, no connection string, nothing to expire. Running on a
// machine it falls back to JSON files under backend/.data, so the same code
// works in both places.
//
// Collections are small (a few dozen posters, a growing list of orders), so a
// collection is held as one JSON document and read in full. Uploaded pictures
// and videos are stored as their own blobs beside it.
import fs from 'node:fs/promises'
import path from 'node:path'

const STORE_NAME = 'sketchover'
const LOCAL_DIR = path.resolve(process.env.LOCAL_DATA_DIR || '.data')

let blobStorePromise = null

// v2 functions expose a global Netlify object; older ones only env vars.
const onNetlify = () => !!(
    globalThis.Netlify
    || process.env.NETLIFY_BLOBS_CONTEXT
    || process.env.NETLIFY
    || process.env.AWS_LAMBDA_FUNCTION_NAME
)

const blobStore = async () => {
    if (!blobStorePromise) {
        blobStorePromise = import('@netlify/blobs').then(({ getStore }) =>
            getStore({ name: STORE_NAME, consistency: 'strong' })
        )
    }
    return blobStorePromise
}

// --- raw get/set, either backend -------------------------------------------

const localPath = (key) => path.join(LOCAL_DIR, key.replace(/[^\w.-]/g, '_'))

const readJson = async (key) => {
    if (onNetlify()) {
        const store = await blobStore()
        return (await store.get(key, { type: 'json' })) || null
    }
    try {
        return JSON.parse(await fs.readFile(localPath(key) + '.json', 'utf8'))
    } catch {
        return null
    }
}

const writeJson = async (key, value) => {
    if (onNetlify()) {
        const store = await blobStore()
        await store.setJSON(key, value)
        return
    }
    await fs.mkdir(LOCAL_DIR, { recursive: true })
    await fs.writeFile(localPath(key) + '.json', JSON.stringify(value), 'utf8')
}

export const putBinary = async (id, buffer, metadata = {}) => {
    if (onNetlify()) {
        const store = await blobStore()
        await store.set(`file_${id}`, buffer, { metadata })
        return id
    }
    await fs.mkdir(path.join(LOCAL_DIR, 'files'), { recursive: true })
    await fs.writeFile(path.join(LOCAL_DIR, 'files', id), buffer)
    await fs.writeFile(path.join(LOCAL_DIR, 'files', `${id}.meta.json`), JSON.stringify(metadata), 'utf8')
    return id
}

export const getBinary = async (id) => {
    if (onNetlify()) {
        const store = await blobStore()
        const result = await store.getWithMetadata(`file_${id}`, { type: 'arrayBuffer' })
        if (!result) return null
        return { buffer: Buffer.from(result.data), metadata: result.metadata || {} }
    }
    try {
        const buffer = await fs.readFile(path.join(LOCAL_DIR, 'files', id))
        let metadata = {}
        try { metadata = JSON.parse(await fs.readFile(path.join(LOCAL_DIR, 'files', `${id}.meta.json`), 'utf8')) } catch { /* none */ }
        return { buffer, metadata }
    } catch {
        return null
    }
}

export const deleteBinary = async (id) => {
    if (!id) return
    if (onNetlify()) {
        const store = await blobStore()
        await store.delete(`file_${id}`).catch(() => {})
        return
    }
    await fs.unlink(path.join(LOCAL_DIR, 'files', id)).catch(() => {})
    await fs.unlink(path.join(LOCAL_DIR, 'files', `${id}.meta.json`)).catch(() => {})
}

// --- collections ------------------------------------------------------------

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

const collection = (name) => {
    const key = `collection_${name}`

    const all = async () => (await readJson(key)) || []

    const save = async (rows) => { await writeJson(key, rows) }

    return {
        name,
        all,
        async find(predicate) {
            const rows = await all()
            return predicate ? rows.filter(predicate) : rows
        },
        async byId(id) {
            if (!id) return null
            const rows = await all()
            return rows.find(row => row.id === String(id)) || null
        },
        async findOne(predicate) {
            const rows = await all()
            return rows.find(predicate) || null
        },
        // Insert or replace, returning the stored row.
        async put(doc) {
            const rows = await all()
            const row = { ...doc, id: doc.id || newId() }
            const at = rows.findIndex(r => r.id === row.id)
            if (at === -1) rows.push(row)
            else rows[at] = row
            await save(rows)
            return row
        },
        // Change one row in place.
        async update(id, changes) {
            const rows = await all()
            const at = rows.findIndex(r => r.id === String(id))
            if (at === -1) return null
            rows[at] = typeof changes === 'function' ? changes(rows[at]) : { ...rows[at], ...changes }
            await save(rows)
            return rows[at]
        },
        async remove(id) {
            const rows = await all()
            const next = rows.filter(row => row.id !== String(id))
            if (next.length === rows.length) return false
            await save(next)
            return true
        },
        async replaceAll(rows) {
            await save(rows)
            return rows
        },
    }
}

export const db = {
    products: collection('products'),
    orders: collection('orders'),
    media: collection('media'),
    coupons: collection('coupons'),
    settings: collection('settings'),
}

export const storageKind = () => (onNetlify() ? 'netlify-blobs' : 'local-files')
