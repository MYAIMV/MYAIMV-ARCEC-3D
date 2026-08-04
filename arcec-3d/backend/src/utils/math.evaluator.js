// ============================================================
// math.evaluator.js
// Parsea expresiones algebraicas y genera mallas 3D.
// ============================================================

const PENALTY = 1e9

const TOKEN_REGEX = /\s*([A-Za-z_][A-Za-z0-9_]*|-?\d+\.?\d*(?:[eE][-+]?\d+)?|\(|\)|,)\s*/g

const tokenizar = (expresion) => {
  const tokens = []
  let match
  TOKEN_REGEX.lastIndex = 0
  while ((match = TOKEN_REGEX.exec(expresion)) !== null) {
    tokens.push(match[1])
  }
  return tokens
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.pos = 0
  }
  peek() { return this.tokens[this.pos] }
  next() { return this.tokens[this.pos++] }

  parse() {
    const nodo = this.parsePrimary()
    if (this.pos < this.tokens.length) {
      throw new Error(`Token inesperado: "${this.peek()}"`)
    }
    return nodo
  }

  parsePrimary() {
    const token = this.next()
    if (token === undefined) throw new Error('Expresión incompleta')

    if (/^-?\d+\.?\d*(?:[eE][-+]?\d+)?$/.test(token)) {
      return { tipo: 'numero', valor: parseFloat(token) }
    }

    if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(token)) {
      if (this.peek() === '(') {
        this.next()
        const args = []
        if (this.peek() !== ')') {
          args.push(this.parsePrimary())
          while (this.peek() === ',') {
            this.next()
            args.push(this.parsePrimary())
          }
        }
        if (this.peek() !== ')') throw new Error(`Falta ')' en la expresión cerca de "${token}"`)
        this.next()
        return { tipo: 'llamada', nombre: token.toLowerCase(), args }
      }
      return { tipo: 'variable', nombre: token }
    }

    throw new Error(`Token no reconocido: "${token}"`)
  }
}

export const parsearExpresion = (expresion) => {
  const tokens = tokenizar(expresion)
  return new Parser(tokens).parse()
}

const protegida = (valor) => (Number.isFinite(valor) ? valor : PENALTY)

export const CATALOGO_FUNCIONES = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  sin: (a) => Math.sin(a),
  cos: (a) => Math.cos(a),
  tanh: (a) => Math.tanh(a),
  square: (a) => a * a,
  cube: (a) => a * a * a,
  p_log: (a) => { const v = Math.abs(a); return v < 1e-9 ? PENALTY : Math.log(v) },
  p_sqrt: (a) => Math.sqrt(Math.abs(a)),
  p_exp: (a) => protegida(Math.exp(Math.min(a, 50))),
  tan: (a) => Math.tan(a),
  acos: (a) => Math.acos(Math.max(-1, Math.min(1, a))),
  divide: (a, b) => (Math.abs(b) < 1e-9 ? PENALTY : a / b),
  norm: (a) => Math.abs(a),
  csc: (a) => { const s = Math.sin(a); return Math.abs(s) < 1e-9 ? PENALTY : 1 / s },
  csch: (a) => { const s = Math.sinh(a); return Math.abs(s) < 1e-9 ? PENALTY : 1 / s },
  minimum: (a, b) => Math.min(a, b),
  sqr: (a) => a * a,
  log: (a) => Math.log(a),
  exp: (a) => Math.exp(a),
  sqrt: (a) => Math.sqrt(a),
  div: (a, b) => a / b,
}

const evaluarNodo = (nodo, variables) => {
  switch (nodo.tipo) {
    case 'numero': return nodo.valor
    case 'variable': {
      const valor = variables[nodo.nombre]
      if (valor === undefined) throw new Error(`Variable "${nodo.nombre}" no tiene valor asignado`)
      return valor
    }
    case 'llamada': {
      const fn = CATALOGO_FUNCIONES[nodo.nombre]
      if (!fn) throw new Error(`Función no soportada: "${nodo.nombre}"`)
      const args = nodo.args.map(arg => evaluarNodo(arg, variables))
      return fn(...args)
    }
    default:
      throw new Error(`Tipo de nodo desconocido: ${nodo.tipo}`)
  }
}

export const evaluarExpresion = (expresion, variables, astCache = null) => {
  try {
    const ast = astCache || parsearExpresion(expresion)
    const resultado = evaluarNodo(ast, variables)
    return protegida(resultado)
  } catch (err) {
    return PENALTY
  }
}

export const listarVariables = (expresion) => {
  const ast = parsearExpresion(expresion)
  const variables = new Set()
  const recorrer = (nodo) => {
    if (nodo.tipo === 'variable') variables.add(nodo.nombre)
    if (nodo.tipo === 'llamada') nodo.args.forEach(recorrer)
  }
  recorrer(ast)
  return [...variables]
}

// Indica si un AST representa una expresión matemática genuina y graficable
// (debe contener al menos una FUNCIÓN en algún punto del árbol; una variable o
// número sueltos no cuentan, porque eso normalmente es un identificador o dato
// suelto — como "C1" en una columna de folio — no una fórmula a evaluar).
export const esExpresionNoTrivial = (ast) => {
  const contieneLlamada = (nodo) => {
    if (nodo.tipo === 'llamada') return true
    if (nodo.args) return nodo.args.some(contieneLlamada)
    return false
  }
  return contieneLlamada(ast)
}

export const generarSuperficie = (
  expresion, varX, varY, variablesFijas = {},
  rangoX = [-1.5, 1.5], rangoY = [-1.5, 1.5], resolucion = 30
) => {
  const ast = parsearExpresion(expresion)
  const [minX, maxX] = rangoX
  const [minY, maxY] = rangoY
  const pasoX = (maxX - minX) / (resolucion - 1)
  const pasoY = (maxY - minY) / (resolucion - 1)

  const ejeX = Array.from({ length: resolucion }, (_, i) => minX + i * pasoX)
  const ejeY = Array.from({ length: resolucion }, (_, i) => minY + i * pasoY)
  const Z = []

  for (let i = 0; i < resolucion; i++) {
    const fila = []
    for (let j = 0; j < resolucion; j++) {
      const variables = { ...variablesFijas, [varX]: ejeX[j], [varY]: ejeY[i] }
      fila.push(evaluarExpresion(expresion, variables, ast))
    }
    Z.push(fila)
  }

  return { ejeX, ejeY, Z, varX, varY }
}

// ------------------------------------------------------------
// 8. CURVA 2D (una sola variable independiente)
// ------------------------------------------------------------
export const generarCurva2D = (
  expresion, varX, variablesFijas = {}, rangoX = [-1.5, 1.5], resolucion = 100
) => {
  const ast = parsearExpresion(expresion)
  const [minX, maxX] = rangoX
  const paso = (maxX - minX) / (resolucion - 1)

  const ejeX = Array.from({ length: resolucion }, (_, i) => minX + i * paso)
  const valores = ejeX.map(x => {
    const variables = { ...variablesFijas, [varX]: x }
    return evaluarExpresion(expresion, variables, ast)
  })

  return { ejeX, valores, varX }
}
