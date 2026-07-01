import { Router }            from 'express'
import { FuncionController } from '../controllers/funcion.controller.js'
import { authMiddleware }    from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/',      authMiddleware, FuncionController.guardar)
router.get('/',       authMiddleware, FuncionController.historial)
router.get('/:id',    authMiddleware, FuncionController.detalle)
router.delete('/:id', authMiddleware, FuncionController.eliminar)

export default router
