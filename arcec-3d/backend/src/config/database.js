import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host:     process.env.DB_HOST || 'localhost',
  port:     process.env.DB_PORT || 3306,
  user:     process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'arcec3d',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Verifica la conexión al arrancar el servidor
export const verificarConexion = async () => {
  try {
    const conn = await pool.getConnection()
    console.log('✅ Conectado a MySQL correctamente')
    conn.release()
  } catch (err) {
    console.error('❌ Error al conectar a MySQL:', err.message)
    process.exit(1)
  }
}

export default pool
