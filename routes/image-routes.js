const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/upload-middleware')
const {uploadImage, fetchImages, deleteImages} = require('../controllers/image-controller')

//upload image
router.post('/upload', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImage)

//get images
router.get('/get', authMiddleware, fetchImages)

//delete images
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImages)

module.exports=router