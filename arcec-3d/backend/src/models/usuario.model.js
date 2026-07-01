import pool from '../config/database.js'

export const UsuarioModel = {
  async create({ nombre_completo, correo_institucional, contrasena }) {
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre_completo, correo_institucional, contrasena)
       VALUES (?, ?, ?)`,
      [nombre_completo, correo_institucional, contrasena]
    )
    return result.insertId
  },

  async findByCorreo(correo_institucional) {
    const [rows] = await pool.query(
      `SELECT * FROM usuarios WHERE correo_institucional = ?`,
      [correo_institucional]
    )
    return rows[0] || null
  },

  async findById(id_usuario) {
    const [rows] = await pool.query(
      `SELECT id_usuario, nombre_completo, correo_institucional, fecha_registro
       FROM usuarios WHERE id_usuario = ?`,
      [id_usuario]
    )
    return rows[0] || null
  }
}
