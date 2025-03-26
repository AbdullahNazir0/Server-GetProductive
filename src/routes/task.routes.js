import { Router } from 'express'
import { verifyJwt } from '../middlewares/auth.middleware.js'

const router = Router()

import {
  getHomeTasks,
  getAllTasks,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controllers.js'

router.route('/')
  .get(verifyJwt, getTasks)
  .post(verifyJwt, createTask)
router.route('/home')
  .get(verifyJwt, getHomeTasks)
router.route('/all')
  .get(verifyJwt, getAllTasks)
router.route('/:id')
  .get(verifyJwt, getTaskById)
  .put(verifyJwt, updateTask)
  .delete(verifyJwt, deleteTask)

export default router
