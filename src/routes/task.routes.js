import express from 'express'
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controllers.js'
import verifyToken from '../middleware/auth.middleware.js'

const router = express.Router()

// Rutas protegidas con JWT
router.get('/', verifyToken, getTasks)
router.get('/:id', verifyToken, getTaskById)
router.post('/', verifyToken, createTask)
router.put('/:id', verifyToken, updateTask)
router.delete('/:id', verifyToken, deleteTask)

export default router
