import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/registro', AuthController.registro)
router.post('/login',    AuthController.login)
router.get('/perfil',    authMiddleware, AuthController.perfil)

export default router
