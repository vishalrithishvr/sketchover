import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB, { isConfigured } from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import mediaRouter from './routes/mediaRoute.js'
import adminRouter from './routes/adminRoute.js'

const app = express()
const port = process.env.PORT || 4000

app.use(express.json({ limit: '5mb' }))
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/media', mediaRouter)
app.use('/api/admin', adminRouter)

// Something to curl when a deploy looks wrong.
app.get('/health', (req, res) => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
    res.json({
        ok: mongoose.connection.readyState === 1,
        db: states[mongoose.connection.readyState] || 'unknown',
        configured: isConfigured(),
        uptime: Math.round(process.uptime()),
    })
})

app.get('/', (req, res) => res.send('Sketchover API'))

const start = async () => {
    try {
        await connectDB()
    } catch (error) {
        // Serve anyway: the health endpoint then says exactly what is wrong,
        // instead of the whole host looking dead.
        console.error('[server] starting without a database:', error.message)
    }
    app.listen(port, () => console.log(`[server] listening on ${port}`))
}

start()

export default app
