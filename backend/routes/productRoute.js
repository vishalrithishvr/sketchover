import express from 'express'
import {
    listProducts, adminListProducts, addProduct, updateProduct,
    setStock, removeProduct, singleProduct,
} from '../controllers/productController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js'

const productRouter = express.Router();

const images = upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
])

// Storefront
productRouter.get('/list', listProducts)
productRouter.post('/single', singleProduct)

// Admin
productRouter.post('/admin-list', adminAuth, adminListProducts)
productRouter.post('/add', adminAuth, images, addProduct)
productRouter.post('/update', adminAuth, images, updateProduct)
productRouter.post('/stock', adminAuth, setStock)
productRouter.post('/remove', adminAuth, removeProduct)

export default productRouter
