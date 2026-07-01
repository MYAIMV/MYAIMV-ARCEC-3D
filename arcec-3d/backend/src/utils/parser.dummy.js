export const parsearDummy = (contenido) => {
  const lineas = contenido.trim().split('\n').filter(l => l.trim())
  const resultados = []

  for (const linea of lineas) {
    const sep = linea.includes(';') ? ';' : ','
    const partes = linea.split(sep).map(p => p.trim())
    if (partes.length < 3) continue

    const generacion   = parseInt(partes[0])
    const expresion    = partes[1].replace(/^"|"$/g, '')
    const fitnessBruto = partes.slice(2).join(',')

    // Extrae solo lo que está DENTRO de np.float32(...) o np.float64(...)
    const matches = [...fitnessBruto.matchAll(/np\.float(?:32|64)\(\s*([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*\)/g)]
    const numeros = matches.map(m => Number(m[1]))

    resultados.push({
      generacion,
      expresion_algebraica: expresion,
      fitness: {
        min:    numeros[0] ?? null,
        avg:    numeros[1] ?? null,
        max:    numeros[2] ?? null,
        nevals: numeros[3] ?? null
      },
      formato: 'dummy'
    })
  }

  return resultados
}
