import express from 'express'
import cors    from 'cors'

import authRoutes    from './routes/auth.routes.js'
import csvRoutes      from './routes/csv.routes.js'
import funcionRoutes  from './routes/funcion.routes.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '15mb' })) // suficiente para imagen_preview en base64
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/api/auth',      authRoutes)
app.use('/api/csv',       csvRoutes)
app.use('/api/funciones', funcionRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', servicio: 'ARCEC-3D Backend' })
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

export default app
