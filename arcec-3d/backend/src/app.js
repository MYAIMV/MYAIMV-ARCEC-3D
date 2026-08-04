import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import archivoRoutes from './routes/archivo.routes.js'
import funcionRoutes from './routes/funcion.routes.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/archivos', archivoRoutes)
app.use('/api/funciones', funcionRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', servicio: 'ARCEC-3D Backend v2' }))
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))

export default app
