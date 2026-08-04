import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes    from './routes/auth.routes.js'
import archivoRoutes from './routes/archivo.routes.js'
import funcionRoutes from './routes/funcion.routes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(cors())
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Rutas de la API ──
app.use('/api/auth',      authRoutes)
app.use('/api/archivos',  archivoRoutes)
app.use('/api/funciones', funcionRoutes)
app.get('/api/health', (req, res) => res.json({ status: 'ok', servicio: 'ARCEC-3D Backend v2' }))

// ── Servir el frontend ya compilado (carpeta backend/public, generada con "npm run build") ──
const rutaFrontend = path.join(__dirname, '..', 'public')
app.use(express.static(rutaFrontend))

// Cualquier ruta que NO empiece con /api debe regresar index.html, para que
// React Router maneje la navegación en el navegador (Login, Dashboard, etc.)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(rutaFrontend, 'index.html'))
})

// 404 solo para rutas de API que no existan
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))

export default app