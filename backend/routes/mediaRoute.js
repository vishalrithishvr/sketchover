import express from 'express'
import { uploadMedia, listMedia, publicMedia, updateMedia, removeMedia, serveFile } from '../controllers/mediaController.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js'

const mediaRouter = express.Router()

const files = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'poster', maxCount: 1 },
])

// Storefront
mediaRouter.get('/public', publicMedia)
mediaRouter.get('/file/:fileId', serveFile)

// Admin
mediaRouter.post('/list', adminAuth, listMedia)
mediaRouter.post('/upload', adminAuth, files, uploadMedia)
mediaRouter.post('/update', adminAuth, updateMedia)
mediaRouter.post('/remove', adminAuth, removeMedia)

export default mediaRouter
