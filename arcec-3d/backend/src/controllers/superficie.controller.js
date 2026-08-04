import { generarSuperficie, generarCurva2D, listarVariables } from '../utils/math.evaluator.js'

export const SuperficieController = {
  // POST /api/archivos/variables  → { expresiones: string[] }
  // Regresa la UNIÓN de variables de todas las expresiones dadas, para construir
  // un solo panel de variables que sirva para graficar todas juntas.
  async variables(req, res) {
    try {
      const { expresiones } = req.body
      if (!Array.isArray(expresiones) || expresiones.length === 0) {
        return res.status(400).json({ error: 'Se requiere un array "expresiones" con al menos un elemento' })
      }

      const porExpresion = {}
      const union = new Set()
      const errores = {}

      for (const expr of expresiones) {
        try {
          const vars = listarVariables(expr)
          porExpresion[expr] = vars
          vars.forEach(v => union.add(v))
        } catch (err) {
          errores[expr] = err.message
          porExpresion[expr] = []
        }
      }

      res.json({
        variablesUnion: [...union],
        variablesPorExpresion: porExpresion,
        errores
      })
    } catch (err) {
      res.status(400).json({ error: 'No se pudieron analizar las expresiones: ' + err.message })
    }
  },

  // POST /api/archivos/superficies → { expresiones, varX, varY, variablesFijas, rangoX, rangoY, resolucion }
  // Genera UNA malla por cada expresión, todas usando el mismo eje X/Y, rango y
  // valores fijos — así el frontend puede superponerlas todas en la misma escena 3D.
  async superficies(req, res) {
    try {
      const {
        expresiones, varX, varY,
        variablesFijas = {},
        rangoX = [-1.5, 1.5], rangoY = [-1.5, 1.5],
        resolucion = 35
      } = req.body

      if (!Array.isArray(expresiones) || expresiones.length === 0) {
        return res.status(400).json({ error: 'Se requiere un array "expresiones" con al menos un elemento' })
      }
      if (!varX || !varY) {
        return res.status(400).json({ error: 'Se requieren "varX" y "varY"' })
      }

      const resultados = expresiones.map(expr => {
        try {
          const malla = generarSuperficie(expr, varX, varY, variablesFijas, rangoX, rangoY, resolucion)
          return { expresion: expr, malla, error: null }
        } catch (err) {
          return { expresion: expr, malla: null, error: err.message }
        }
      })

      res.json({ superficies: resultados })
    } catch (err) {
      res.status(400).json({ error: 'No se pudieron generar las superficies: ' + err.message })
    }
  },

  // POST /api/archivos/curva → { expresion, varX, variablesFijas, rangoX, resolucion }
  // Genera una curva 2D (una sola variable independiente).
  async curva2D(req, res) {
    try {
      const {
        expresion, varX,
        variablesFijas = {},
        rangoX = [-1.5, 1.5],
        resolucion = 100
      } = req.body

      if (!expresion || !varX) {
        return res.status(400).json({ error: 'Se requieren "expresion" y "varX"' })
      }

      const curva = generarCurva2D(expresion, varX, variablesFijas, rangoX, resolucion)
      res.json(curva)
    } catch (err) {
      res.status(400).json({ error: 'No se pudo generar la curva: ' + err.message })
    }
  }
}
