const ANCHO = 640
const ALTO = 380
const MARGEN = { top: 30, right: 30, bottom: 45, left: 55 }

const formatearNumero = (v) => {
  if (Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0)) return v.toExponential(1)
  return Number(v.toFixed(2)).toString()
}

const Grafica2D = ({ curva, nombreFuncion, color = '#4a6741' }) => {
  // colorPorIndice() regresa el hex SIN el símbolo #, hay que normalizarlo aquí
  // porque un color sin # no es válido ni en SVG ni en CSS (por eso no se dibujaba la línea).
  const colorFinal = color.startsWith('#') ? color : `#${color}`

  if (!curva || !curva.ejeX || curva.ejeX.length === 0) return null

  const { ejeX, valores, varX } = curva

  // Filtrar picos de penalización (igual que en 3D) para que la escala no se distorsione
  const valoresValidos = valores.filter(v => Math.abs(v) < 100 && isFinite(v))
  const yMin = valoresValidos.length ? Math.min(...valoresValidos) : 0
  const yMax = valoresValidos.length ? Math.max(...valoresValidos) : 1
  const yRango = (yMax - yMin) || 1
  const xMin = ejeX[0]
  const xMax = ejeX[ejeX.length - 1]
  const xRango = (xMax - xMin) || 1

  const anchoUtil = ANCHO - MARGEN.left - MARGEN.right
  const altoUtil = ALTO - MARGEN.top - MARGEN.bottom

  const escalarX = (x) => MARGEN.left + ((x - xMin) / xRango) * anchoUtil
  const escalarY = (y) => {
    const yClamp = Math.abs(y) > 100 || !isFinite(y) ? yMin : y
    return MARGEN.top + altoUtil - ((yClamp - yMin) / yRango) * altoUtil
  }

  const puntos = ejeX.map((x, i) => `${escalarX(x)},${escalarY(valores[i])}`).join(' ')

  const NUM_MARCAS = 5
  const marcasX = Array.from({ length: NUM_MARCAS }, (_, i) => xMin + (i / (NUM_MARCAS - 1)) * xRango)
  const marcasY = Array.from({ length: NUM_MARCAS }, (_, i) => yMin + (i / (NUM_MARCAS - 1)) * yRango)

  return (
    <div className="w-full flex flex-col items-center">
      {nombreFuncion && (
        <p className="text-sm font-mono text-gray-600 mb-2 text-center break-all px-4">
          Graficando: <span className="font-bold" style={{ color: colorFinal }}>{nombreFuncion}</span>
        </p>
      )}
      <svg id="grafica-2d-svg" viewBox={`0 0 ${ANCHO} ${ALTO}`} className="w-full max-w-2xl">
        {/* Cuadrícula */}
        {marcasY.map((y, i) => (
          <line key={`gy${i}`} x1={MARGEN.left} x2={ANCHO - MARGEN.right} y1={escalarY(y)} y2={escalarY(y)}
            stroke="#eee" strokeWidth="1" />
        ))}
        {marcasX.map((x, i) => (
          <line key={`gx${i}`} x1={escalarX(x)} x2={escalarX(x)} y1={MARGEN.top} y2={ALTO - MARGEN.bottom}
            stroke="#eee" strokeWidth="1" />
        ))}

        {/* Ejes */}
        <line x1={MARGEN.left} x2={ANCHO - MARGEN.right} y1={ALTO - MARGEN.bottom} y2={ALTO - MARGEN.bottom} stroke="#999" strokeWidth="1.5" />
        <line x1={MARGEN.left} x2={MARGEN.left} y1={MARGEN.top} y2={ALTO - MARGEN.bottom} stroke="#999" strokeWidth="1.5" />

        {/* Marcas numéricas eje X */}
        {marcasX.map((x, i) => (
          <text key={`tx${i}`} x={escalarX(x)} y={ALTO - MARGEN.bottom + 18} fontSize="11" fill="#666" textAnchor="middle">
            {formatearNumero(x)}
          </text>
        ))}
        {/* Marcas numéricas eje Y */}
        {marcasY.map((y, i) => (
          <text key={`ty${i}`} x={MARGEN.left - 8} y={escalarY(y) + 4} fontSize="11" fill="#666" textAnchor="end">
            {formatearNumero(y)}
          </text>
        ))}

        {/* Nombre de la variable (eje X) y "Salida" (eje Y) */}
        <text x={ANCHO / 2} y={ALTO - 6} fontSize="13" fill="#2c4a63" fontWeight="bold" textAnchor="middle">{varX}</text>
        <text x={14} y={ALTO / 2} fontSize="13" fill="#4a6741" fontWeight="bold" textAnchor="middle"
          transform={`rotate(-90, 14, ${ALTO / 2})`}>Salida</text>

        {/* Curva */}
        <polyline points={puntos} fill="none" stroke={colorFinal} strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default Grafica2D