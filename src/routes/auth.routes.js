import express from 'express'

import { register, login, logoutUser } from '../controllers/auth.controllers.js'
import verifyToken from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', verifyToken, logoutUser)

export default router
