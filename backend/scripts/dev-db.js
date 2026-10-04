// A throwaway MongoDB for working on the machine, so the API and the admin
// panel can be driven end to end without an Atlas account. Data lives in
// .dev-db/ and survives restarts; it is never meant for real orders.
//
//   npm run dev:db     # prints a MONGODB_URI to use
import { MongoMemoryServer } from 'mongodb-memory-server'
import fs from 'node:fs/promises'
import path from 'node:path'

const dbPath = path.resolve('.dev-db')
await fs.mkdir(dbPath, { recursive: true })

const server = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: 'wiredTiger', port: 27018 },
})

const uri = server.getUri()
await fs.writeFile(path.resolve('.dev-db-uri'), uri, 'utf8')
console.log('[dev-db] running at', uri)
console.log('[dev-db] stop with Ctrl+C')

const stop = async () => {
    await server.stop()
    process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
