// Storage for artwork the shopper uploads.
//
// The files themselves live in IndexedDB, as the exact Blobs that were picked —
// never re-encoded, so a 12 MP photo stays a 12 MP photo and a GIF keeps its
// frames. localStorage could not hold them (a few MB of base64 blows the quota),
// and the cart needs them to survive a refresh, so the order can still be sent
// with its attachments tomorrow morning.

const DB_NAME = 'sketchover'
const DB_VERSION = 1
const STORE = 'customPosterFiles'

let dbPromise = null

const openDb = () => {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('No IndexedDB'))
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return dbPromise
}

const withStore = async (mode, work) => {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const store = tx.objectStore(STORE)
    const result = work(store)
    tx.oncomplete = () => resolve(result?.result ?? result)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

// Files are stored one row per image: { id, posterId, name, type, blob }.
export const putFiles = async (posterId, files) => {
  const rows = files.map((file, index) => ({
    id: `${posterId}__${index}`,
    posterId,
    index,
    name: file.name,
    type: file.type,
    blob: file,
  }))
  await withStore('readwrite', (store) => { rows.forEach(row => store.put(row)) })
  return rows.map(({ id, name, type }) => ({ id, name, type }))
}

export const getFiles = async (posterId) => {
  const rows = await withStore('readonly', (store) => store.getAll())
  return (rows || [])
    .filter(row => row.posterId === posterId)
    .sort((a, b) => a.index - b.index)
}

// Rebuild real File objects, so sharing sends the original bytes under the
// original filename.
export const getFilesAsFiles = async (posterId) => {
  const rows = await getFiles(posterId)
  return rows.map(row => new File([row.blob], row.name, { type: row.type || row.blob.type }))
}

export const deleteFiles = async (posterId) => {
  const rows = await getFiles(posterId)
  await withStore('readwrite', (store) => { rows.forEach(row => store.delete(row.id)) })
}

// Drop anything that is no longer referenced by the cart or a recent order.
export const pruneFiles = async (keepPosterIds = []) => {
  const keep = new Set(keepPosterIds)
  const rows = await withStore('readonly', (store) => store.getAll())
  const stale = (rows || []).filter(row => !keep.has(row.posterId))
  if (stale.length === 0) return 0
  await withStore('readwrite', (store) => { stale.forEach(row => store.delete(row.id)) })
  return stale.length
}
