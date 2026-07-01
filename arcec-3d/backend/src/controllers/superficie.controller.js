import { generarSuperficie, listarVariables } from '../utils/math.evaluator.js'

export const SuperficieController = {
  async variables(req, res) {
    try {
      const { expresion } = req.body
      if (!expresion) return res.status(400).json({ error: 'Falta el campo "expresion"' })
      const vars = listarVariables(expresion)
      res.json({ expresion, variables: vars })
    } catch (err) {
      res.status(400).json({ error: 'Expresión inválida: ' + err.message })
    }
  },

  async superficie(req, res) {
    try {
      const {
        expresion, varX, varY,
        variablesFijas = {}, rango = [-1.5, 1.5], resolucion = 30
      } = req.body

      if (!expresion || !varX || !varY) {
        return res.status(400).json({ error: 'Se requieren "expresion", "varX" y "varY"' })
      }

      const malla = generarSuperficie(expresion, varX, varY, variablesFijas, rango, resolucion)
      res.json(malla)
    } catch (err) {
      res.status(400).json({ error: 'No se pudo generar la superficie: ' + err.message })
    }
  }
}
