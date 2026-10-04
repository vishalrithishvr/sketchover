import express from 'express'
import {
    dashboard, getSettings, updateSettings,
    listCoupons, saveCoupon, removeCoupon, validateCoupon,
} from '../controllers/adminController.js'
import adminAuth from '../middleware/adminAuth.js'

const adminRouter = express.Router()

// Storefront
adminRouter.get('/settings', getSettings)
adminRouter.post('/coupon/validate', validateCoupon)

// Admin
adminRouter.post('/dashboard', adminAuth, dashboard)
adminRouter.post('/settings', adminAuth, updateSettings)
adminRouter.post('/coupon/list', adminAuth, listCoupons)
adminRouter.post('/coupon/save', adminAuth, saveCoupon)
adminRouter.post('/coupon/remove', adminAuth, removeCoupon)

export default adminRouter
