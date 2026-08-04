import { Router } from 'express'
import { ArchivoController } from '../controllers/archivo.controller.js'
import { SuperficieController } from '../controllers/superficie.controller.js'
import { uploadCsv } from '../middlewares/upload.middleware.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/subir',       authMiddleware, uploadCsv.single('archivo'), ArchivoController.subir)
router.post('/variables',   authMiddleware, SuperficieController.variables)
router.post('/superficies', authMiddleware, SuperficieController.superficies)
router.post('/curva',       authMiddleware, SuperficieController.curva2D)

export default router
