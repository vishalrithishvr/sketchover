import express from 'express'
import { placeOrder, allOrders, userOrders, updateStatus, trackOrder } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Storefront — guests can order, so this one is open.
orderRouter.post('/place', placeOrder)
orderRouter.post('/track', trackOrder)

// Signed-in customers
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter
