import mongoose from "mongoose";

// The URI may already name a database; if it does not, use ours.
const withDatabase = (uri) => {
    const [base, query] = uri.split('?')
    const trimmed = base.replace(/\/+$/, '')
    const hasDb = /mongodb(\+srv)?:\/\/[^/]+\/[^/]+$/.test(trimmed)
    const full = hasDb ? trimmed : `${trimmed}/sketchover`
    return query ? `${full}?${query}` : full
}

export const isConfigured = () => {
    const uri = (process.env.MONGODB_URI || '').trim()
    return /^mongodb(\+srv)?:\/\//.test(uri)
}

const connectDB = async () => {
    const uri = (process.env.MONGODB_URI || '').trim()

    if (!isConfigured()) {
        // Say plainly what is missing instead of crashing on a placeholder.
        console.error('\n[db] MONGODB_URI is not set to a MongoDB connection string.')
        console.error('[db] Put your Atlas URI in backend/.env, e.g.')
        console.error('[db]   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net\n')
        throw new Error('MONGODB_URI missing or malformed')
    }

    mongoose.connection.on('connected', () => console.log('[db] connected'))
    mongoose.connection.on('error', (err) => console.error('[db] error:', err.message))
    mongoose.connection.on('disconnected', () => console.warn('[db] disconnected'))

    await mongoose.connect(withDatabase(uri), { serverSelectionTimeoutMS: 10000 })
    return mongoose.connection
}

export default connectDB;
