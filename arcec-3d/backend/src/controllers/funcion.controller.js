import { FuncionService } from '../services/funcion.service.js'

export const FuncionController = {
  async guardar(req, res) {
    try {
      const id_usuario = req.usuario.id_usuario
      const { expresion_algebraica, nombre_experimento, imagen_preview } = req.body

      const resultado = await FuncionService.guardar({
        id_usuario, expresion_algebraica, nombre_experimento, imagen_preview
      })

      res.status(201).json({ message: 'Función destacada guardada correctamente', funcion: resultado })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  async historial(req, res) {
    try {
      const id_usuario = req.usuario.id_usuario
      const funciones = await FuncionService.consultarHistorial(id_usuario)
      res.json({ total: funciones.length, funciones })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },

  async detalle(req, res) {
    try {
      const id_usuario = req.usuario.id_usuario
      const { id } = req.params
      const funcion = await FuncionService.consultarDetalle(Number(id), id_usuario)
      res.json({ funcion })
    } catch (err) {
      const status = err.message.includes('no encontrada') ? 404 : 403
      res.status(status).json({ error: err.message })
    }
  },

  async eliminar(req, res) {
    try {
      const id_usuario = req.usuario.id_usuario
      const { id } = req.params
      await FuncionService.eliminar(Number(id), id_usuario)
      res.json({ message: 'Función eliminada correctamente' })
    } catch (err) {
      res.status(404).json({ error: err.message })
    }
  }
}
