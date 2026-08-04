import { parsearArchivoGenerico } from '../utils/parser.generico.js'
import { parsearXlsxGenerico } from '../utils/parser.xlsx.js'

export const ArchivoController = {
  // POST /api/archivos/subir
  async subir(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo' })
      }

      const nombreArchivo = req.file.originalname.toLowerCase()
      const resultado = nombreArchivo.endsWith('.xlsx')
        ? parsearXlsxGenerico(req.file.buffer)
        : parsearArchivoGenerico(req.file.buffer.toString('utf-8'))

      if (resultado.columnasExpresion.length === 0) {
        return res.status(422).json({
          error: 'No se encontró ninguna columna con expresiones algebraicas evaluables en el archivo. Verifica que el archivo contenga fórmulas del algoritmo evolutivo.'
        })
      }

      res.json({
        message: 'Archivo procesado correctamente',
        columnasExpresion: resultado.columnasExpresion,
        columnasMetadata: resultado.columnasMetadata,
        totalFilas: resultado.filas.length,
        filas: resultado.filas
      })
    } catch (err) {
      res.status(500).json({ error: 'Error al procesar el archivo: ' + err.message })
    }
  }
}
