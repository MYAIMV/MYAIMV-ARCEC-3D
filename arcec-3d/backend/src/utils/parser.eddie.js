// Parsea CSV respetando campos entre comillas (pueden contener comas)
const parsearCSVLinea = (linea) => {
  const campos = []
  let actual = ''
  let dentroComillas = false

  for (let i = 0; i < linea.length; i++) {
    const c = linea[i]
    if (c === '"') {
      dentroComillas = !dentroComillas
    } else if (c === ',' && !dentroComillas) {
      campos.push(actual.trim())
      actual = ''
    } else {
      actual += c
    }
  }
  campos.push(actual.trim())
  return campos
}

export const parsearEddie = (contenido) => {
  const lineas = contenido.trim().split('\n').filter(l => l.trim())
  if (lineas.length < 2) return []

  const headers = parsearCSVLinea(lineas[0]).map(h => h.trim().toLowerCase())
  const resultados = []

  for (let i = 1; i < lineas.length; i++) {
    const campos = parsearCSVLinea(lineas[i])
    if (campos.length < 2) continue

    const fila = {}
    headers.forEach((h, idx) => {
      fila[h] = campos[idx]?.trim() ?? null
    })

    const arboles = []
    for (let t = 1; t <= 9; t++) {
      const val = fila[`t${t}`]
      if (val && val !== 'null' && val !== '') {
        arboles.push(val.replace(/^"|"$/g, '').trim())
      }
    }

    const textoArboles = arboles.join(' ')
    const varsMatch = [...textoArboles.matchAll(/x\d+/g)]
    const variables = [...new Set(varsMatch.map(m => m[0]))]

    resultados.push({
      run_id:              fila['run_id']     || null,
      train_error:         parseFloat(fila['train_error']) || null,
      test_error:          parseFloat(fila['test_error'])  || null,
      nevals:              parseInt(fila['nevals'])         || null,
      arboles,
      variables,
      expresion_algebraica: arboles[0] || '',
      formato: 'eddie'
    })
  }

  return resultados
}
