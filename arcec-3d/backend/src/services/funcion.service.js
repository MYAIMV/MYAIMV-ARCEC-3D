import { FuncionModel } from '../models/funcion.model.js'

const MAX_EXPRESION_LEN = 1000
const MAX_NOMBRE_LEN    = 150

export const FuncionService = {
  async guardar({ id_usuario, expresion_algebraica, nombre_experimento, imagen_preview }) {
    if (!expresion_algebraica || !expresion_algebraica.trim()) {
      throw new Error('La expresión algebraica es obligatoria')
    }
    if (!nombre_experimento || !nombre_experimento.trim()) {
      throw new Error('El nombre del experimento es obligatorio')
    }
    if (expresion_algebraica.length > MAX_EXPRESION_LEN) {
      throw new Error(`La expresión algebraica excede el límite de ${MAX_EXPRESION_LEN} caracteres`)
    }
    if (nombre_experimento.length > MAX_NOMBRE_LEN) {
      throw new Error(`El nombre del experimento excede el límite de ${MAX_NOMBRE_LEN} caracteres`)
    }
    if (imagen_preview && !/^data:image\/(png|jpeg);base64,/.test(imagen_preview)) {
      throw new Error('imagen_preview debe ser un string base64 válido')
    }

    const id_funcion = await FuncionModel.create({
      id_usuario,
      expresion_algebraica: expresion_algebraica.trim(),
      nombre_experimento: nombre_experimento.trim(),
      imagen_preview: imagen_preview || null
    })

    return { id_funcion, expresion_algebraica, nombre_experimento }
  },

  async consultarHistorial(id_usuario) {
    return FuncionModel.findByUsuario(id_usuario)
  },

  async consultarDetalle(id_funcion, id_usuario) {
    const funcion = await FuncionModel.findById(id_funcion)
    if (!funcion) throw new Error('Función no encontrada')
    if (funcion.id_usuario !== id_usuario) throw new Error('No tienes permiso para ver esta función')
    return funcion
  },

  async eliminar(id_funcion, id_usuario) {
    const eliminado = await FuncionModel.delete(id_funcion, id_usuario)
    if (!eliminado) throw new Error('Función no encontrada o no te pertenece')
    return true
  }
}
