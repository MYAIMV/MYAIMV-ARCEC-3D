import { Router }               from 'express'
import { CsvController }        from '../controllers/csv.controller.js'
import { SuperficieController } from '../controllers/superficie.controller.js'
import { uploadCsv }            from '../middlewares/upload.middleware.js'
import { authMiddleware }       from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/subir',      authMiddleware, uploadCsv.single('archivo'), CsvController.subir)
router.post('/variables',  authMiddleware, SuperficieController.variables)
router.post('/superficie', authMiddleware, SuperficieController.superficie)

export default router
