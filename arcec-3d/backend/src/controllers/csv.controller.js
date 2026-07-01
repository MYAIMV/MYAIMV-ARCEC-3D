import { detectarFormato } from '../utils/parser.detector.js'
import { parsearEddie }    from '../utils/parser.eddie.js'
import { parsearDummy }    from '../utils/parser.dummy.js'

export const CsvController = {
  async subir(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo' })
      }

      const contenido = req.file.buffer.toString('utf-8')
      const formato = detectarFormato(contenido)

      let resultados = []

      switch (formato) {
        case 'eddie':
          resultados = parsearEddie(contenido)
          break
        case 'dummy':
          resultados = parsearDummy(contenido)
          break
        default:
          return res.status(422).json({
            error: 'No se pudo identificar el formato del archivo. Verifica que sea un CSV de Eddie (con train_error) o Dummy (separado por ;).'
          })
      }

      if (resultados.length === 0) {
        return res.status(422).json({ error: 'El archivo no contiene filas válidas para procesar' })
      }

      res.json({
        message: 'Archivo procesado correctamente',
        formato,
        total_filas: resultados.length,
        datos: resultados
      })
    } catch (err) {
      res.status(500).json({ error: 'Error al procesar el archivo: ' + err.message })
    }
  }
}
