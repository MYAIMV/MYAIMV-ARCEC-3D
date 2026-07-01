import pool from '../config/database.js'

export const FuncionModel = {
  async create({ id_usuario, expresion_algebraica, nombre_experimento, imagen_preview }) {
    const [result] = await pool.query(
      `INSERT INTO funciones_destacadas
        (id_usuario, expresion_algebraica, nombre_experimento, imagen_preview)
       VALUES (?, ?, ?, ?)`,
      [id_usuario, expresion_algebraica, nombre_experimento, imagen_preview]
    )
    return result.insertId
  },

  async findByUsuario(id_usuario) {
    const [rows] = await pool.query(
      `SELECT id_funcion, id_usuario, expresion_algebraica, nombre_experimento, fecha_guardado
       FROM funciones_destacadas
       WHERE id_usuario = ?
       ORDER BY fecha_guardado DESC`,
      [id_usuario]
    )
    return rows
  },

  async findById(id_funcion) {
    const [rows] = await pool.query(
      `SELECT * FROM funciones_destacadas WHERE id_funcion = ?`,
      [id_funcion]
    )
    return rows[0] || null
  },

  async delete(id_funcion, id_usuario) {
    const [result] = await pool.query(
      `DELETE FROM funciones_destacadas WHERE id_funcion = ? AND id_usuario = ?`,
      [id_funcion, id_usuario]
    )
    return result.affectedRows > 0
  }
}
