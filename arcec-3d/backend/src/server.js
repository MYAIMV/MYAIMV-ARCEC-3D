import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'
import { verificarConexion } from './config/database.js'

const PORT = process.env.PORT || 3001

const iniciar = async () => {
  await verificarConexion()
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ARCEC-3D corriendo en http://localhost:${PORT}`)
  })
}

iniciar()
