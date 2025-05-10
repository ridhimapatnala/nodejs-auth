const express = require('express')
const {registerUser, loginUser, changePassword} = require('../controllers/auth-controller')
const authMiddleware = require('../middleware/auth-middleware')
const router = express.Router()


//all routes related to user auth
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/changepassword', authMiddleware, changePassword)
router.get

module.exports = router