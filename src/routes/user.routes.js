import { Router } from 'express'
import { verifyJwt } from '../middlewares/auth.middleware.js'

const router = Router()

import {
  registerUser,
  loginUser,
  isUserAuthenticated,
  logoutUser,
  updateUser,
  resetPassword,
  deleteUser
} from '../controllers/user.controllers.js'

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/status').get(isUserAuthenticated)
router.route('/logout').post(logoutUser)
router.route('/:id/update').post(verifyJwt, updateUser)
router.route('/:id/reset-password').post(verifyJwt, resetPassword)
router.route('/:id/delete').post(verifyJwt, deleteUser)

export default router
