import { parsearExpresion, esExpresionNoTrivial } from './math.evaluator.js'

// Parsea una línea de CSV respetando comillas (los valores pueden traer comas internas).
const parsearLineaCSV = (linea, separador) => {
  const campos = []
  let actual = ''
  let dentroComillas = false

  for (let i = 0; i < linea.length; i++) {
    const c = linea[i]
    if (c === '"') {
      dentroComillas = !dentroComillas
    } else if (c === separador && !dentroComillas) {
      campos.push(actual.trim())
      actual = ''
    } else {
      actual += c
    }
  }
  campos.push(actual.trim())
  return campos
}

// Analiza el archivo asumiendo un separador específico, y regresa tanto el
// resultado como un puntaje (cuántas celdas de expresión válida se encontraron),
// para poder comparar qué separador es el correcto.
const analizarConSeparador = (lineas, separador) => {
  const primeraFila = parsearLineaCSV(lineas[0], separador)
  if (primeraFila.length < 2) return { puntaje: -1 }

  const tieneEncabezado = pareceEncabezado(primeraFila)
  const nombresColumnas = tieneEncabezado
    ? primeraFila.map(c => c.trim())
    : primeraFila.map((_, i) => `col${i}`)
  const lineasDatos = tieneEncabezado ? lineas.slice(1) : lineas
  if (lineasDatos.length === 0) return { puntaje: -1 }

  const filasCrudas = lineasDatos.map(linea => {
    const campos = parsearLineaCSV(linea, separador)
    const fila = {}
    nombresColumnas.forEach((nombre, i) => {
      fila[nombre] = campos[i] !== undefined ? campos[i].replace(/^"|"$/g, '').trim() : ''
    })
    return fila
  })

  const MUESTRA = Math.min(20, filasCrudas.length)
  const columnasExpresion = []
  const columnasMetadata = []
  let puntaje = 0

  for (const nombre of nombresColumnas) {
    let validas = 0
    let evaluadas = 0
    for (let i = 0; i < MUESTRA; i++) {
      const valor = filasCrudas[i][nombre]
      if (!valor) continue
      evaluadas++
      if (esValorExpresion(valor)) { validas++; puntaje++ }
    }
    const esColumnaExpresion = evaluadas > 0 && (validas / evaluadas) >= 0.9
    if (esColumnaExpresion) columnasExpresion.push(nombre)
    else columnasMetadata.push(nombre)
  }

  const filas = filasCrudas.map((fila, indice) => ({
    indice,
    expresiones: Object.fromEntries(columnasExpresion.map(c => [c, fila[c]])),
    metadata: Object.fromEntries(columnasMetadata.map(c => [c, fila[c]]))
  }))

  return { puntaje, columnasExpresion, columnasMetadata, filas }
}

// Un encabezado "parece" un nombre de columna si son solo letras/números/guion bajo,
// sin operadores matemáticos ni paréntesis (para distinguirlo de una fila de datos).
const pareceEncabezado = (campos) => {
  return campos.every(c => /^[A-Za-z_][A-Za-z0-9_]*$/.test(c.trim()))
}

// Revisa si un valor de texto es una expresión algebraica genuina
// (contiene al menos una variable o una función; no es solo un número suelto).
const esValorExpresion = (texto) => {
  if (!texto || texto.trim() === '') return false
  const limpio = texto.replace(/^"|"$/g, '').trim()
  try {
    const ast = parsearExpresion(limpio)
    return esExpresionNoTrivial(ast)
  } catch {
    return false
  }
}

/**
 * Analiza un archivo tabular (CSV o TXT) SIN asumir nombres de columna fijos.
 * Prueba ambos separadores posibles (coma y punto y coma) y detecta automáticamente
 * cuáles columnas contienen expresiones algebraicas evaluables y cuáles son solo
 * metadatos (números, texto, arrays sin soporte como weights_W).
 *
 * @param {string} contenido - texto completo del archivo
 * @returns {{ columnasExpresion: string[], columnasMetadata: string[], filas: object[] }}
 */
export const parsearArchivoGenerico = (contenido) => {
  const lineas = contenido.trim().split('\n').filter(l => l.trim())
  if (lineas.length === 0) return { columnasExpresion: [], columnasMetadata: [], filas: [] }

  const intentoComa    = analizarConSeparador(lineas, ',')
  const intentoPuntoYComa = analizarConSeparador(lineas, ';')

  const mejor = (intentoPuntoYComa.puntaje > intentoComa.puntaje) ? intentoPuntoYComa : intentoComa

  if (mejor.puntaje <= 0) {
    return { columnasExpresion: [], columnasMetadata: [], filas: [] }
  }

  return {
    columnasExpresion: mejor.columnasExpresion,
    columnasMetadata: mejor.columnasMetadata,
    filas: mejor.filas
  }
}
