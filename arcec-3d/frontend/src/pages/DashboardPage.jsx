import { useState, useRef, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import ModalDescargar from '../components/visualizer/ModalDescargar'
import ModalDestacar from '../components/visualizer/ModalDestacar'
import { useThreeJS } from '../hooks/useThreeJS'
import api from '../services/api'

const COLORES = ['#a8d8d8','#f4a0a0','#d8b4e2','#a0c4e8','#b8d4a0','#d4c48c','#f0d0a0','#c8b4d8']

const ModuloPlano = ({ canvasRef }) => (
  <div className="border border-gray-300 rounded-xl p-4 bg-white mb-4">
    <h2 className="text-base font-bold text-gray-800 mb-3">Modulo de Plano y Coordenadas</h2>
    <div ref={canvasRef} className="w-full rounded-lg" style={{ height: '400px' }} />
  </div>
)

const ModuloAjustes = ({ colorActivo, onColor, onReset, onFullscreen }) => (
  <div className="border border-gray-300 rounded-xl p-4 bg-white mb-4 flex items-center gap-4 flex-wrap">
    <h2 className="text-base font-bold text-gray-800 whitespace-nowrap">Modulo de ajustes</h2>
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600 whitespace-nowrap">Colometria de la grafica</span>
      <div className="flex gap-1.5 flex-wrap">
        {COLORES.map(c => (
          <button key={c} onClick={() => onColor(c)}
            className="w-8 h-8 rounded transition-transform hover:scale-110"
            style={{ backgroundColor: c, border: colorActivo === c ? '2px solid #4a6741' : '2px solid transparent' }}
          />
        ))}
      </div>
    </div>
    <div className="flex items-center gap-3 ml-auto">
      <button onClick={onReset} title="Resetear camara"
        className="text-gray-600 hover:text-gray-900 text-xl font-bold transition-colors">↺</button>
      <button onClick={onFullscreen} title="Pantalla completa"
        className="text-gray-600 hover:text-gray-900 transition-colors">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M3 3h5v2H5v3H3V3zm9 0h5v5h-2V5h-3V3zM3 12h2v3h3v2H3v-5zm12 3h-3v2h5v-5h-2v3z"/>
        </svg>
      </button>
    </div>
  </div>
)

const SelectorEddie = ({ arboles, variables, arbolIdx, varX, varY, onArbol, onVarX, onVarY, onGraficar, cargando }) => (
  <div className="mt-4 p-4 rounded-xl border border-gray-200" style={{ backgroundColor: '#eef4e8' }}>
    <p className="text-sm font-bold text-gray-700 mb-3">Selecciona que graficar</p>
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 font-medium">Arbol (expresion)</label>
        <select value={arbolIdx} onChange={e => onArbol(Number(e.target.value))}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          {arboles.map((a, i) => (
            <option key={i} value={i}>T{i+1}: {a.length > 40 ? a.slice(0,40)+'...' : a}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 font-medium">Variable eje X</label>
        <select value={varX} onChange={e => onVarX(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          {variables.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 font-medium">Variable eje Y</label>
        <select value={varY} onChange={e => onVarY(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          {variables.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <button onClick={onGraficar} disabled={cargando}
        className="px-5 py-2 rounded-lg text-white font-bold text-sm transition-opacity disabled:opacity-50 hover:opacity-90"
        style={{ backgroundColor: '#4a6741' }}>
        {cargando ? 'Graficando...' : 'Graficar'}
      </button>
    </div>
    <p className="text-xs text-gray-500 mt-2 font-mono break-all">{arboles[arbolIdx]}</p>
  </div>
)

const ModuloCarga = ({ onArchivo, onDescargar, onDestacar, haySuperficie, cargando,
  datosEddie, arbolIdx, varX, varY, onArbol, onVarX, onVarY, onGraficar }) => {
  const inputRef = useRef()
  const [arrastrando, setArrastrando] = useState(false)
  const [nombreArchivo, setNombreArchivo] = useState(null)
  const procesarArchivo = (file) => { if (!file) return; setNombreArchivo(file.name); onArchivo(file) }
  return (
    <div className="border border-gray-300 rounded-xl p-4 bg-white">
      <h2 className="text-base font-bold text-gray-800 mb-3">Modulo de carga</h2>
      <div className="flex gap-4 items-stretch">
        <div onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => { e.preventDefault(); setArrastrando(false); procesarArchivo(e.dataTransfer.files[0]) }}
          className="flex-1 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all text-center px-4 py-8 select-none min-h-24"
          style={{ backgroundColor: arrastrando ? '#b8ccb0' : '#c8d8b0', border: arrastrando ? '2px dashed #4a6741' : '2px dashed transparent' }}>
          <input ref={inputRef} type="file" accept=".csv,.txt,.xlsx" className="hidden"
            onChange={(e) => procesarArchivo(e.target.files[0])} />
          {cargando && !datosEddie
            ? <p className="text-gray-700 font-medium text-sm">Procesando...</p>
            : nombreArchivo
              ? <p className="text-gray-700 font-medium text-sm">📄 {nombreArchivo}</p>
              : <><p className="text-gray-700 font-medium">Arrastra tu archivo</p>
                  <p className="text-gray-700 font-medium">csv aqui o buscar</p></>}
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <button onClick={onDescargar} disabled={!haySuperficie}
            className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-opacity disabled:opacity-40 hover:opacity-90"
            style={{ backgroundColor: '#6b8f3a' }}>Descargar grafica</button>
          <button onClick={onDestacar} disabled={!haySuperficie}
            className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-opacity disabled:opacity-40 hover:opacity-90"
            style={{ backgroundColor: '#7a9bbf' }}>Destacar grafica</button>
        </div>
      </div>
      {datosEddie && (
        <SelectorEddie
          arboles={datosEddie.arboles}
          variables={datosEddie.variablesPorArbol[arbolIdx] || []}
          arbolIdx={arbolIdx} varX={varX} varY={varY}
          onArbol={onArbol} onVarX={onVarX} onVarY={onVarY}
          onGraficar={onGraficar} cargando={cargando}
        />
      )}
    </div>
  )
}

const DashboardPage = () => {
  const canvasRef = useRef()
  const { renderizarSuperficie, resetCamara, capturarImagen } = useThreeJS(canvasRef)
  const location = useLocation()

  const [color, setColor]                     = useState('#a8d8d8')
  const [haySuperficie, setHaySuperficie]     = useState(false)
  const [cargando, setCargando]               = useState(false)
  const [mallaActual, setMallaActual]         = useState(null)
  const [expresionActual, setExpresionActual] = useState('')
  const [error, setError]                     = useState(null)
  const [datosEddie, setDatosEddie]           = useState(null)
  const [arbolIdx, setArbolIdx]               = useState(0)
  const [varX, setVarX]                       = useState('')
  const [varY, setVarY]                       = useState('')

  // Modales
  const [modalDescargar, setModalDescargar] = useState(false)
  const [modalDestacar, setModalDestacar]   = useState(false)
  const [guardando, setGuardando]           = useState(false)
  const [mensajeExito, setMensajeExito]     = useState(null)

  const graficarExpresion = useCallback(async (expresion, vX, vY, colorOverride) => {
    setCargando(true)
    setError(null)
    try {
      const { data: malla } = await api.post('/csv/superficie', {
        expresion, varX: vX, varY: vY, rango: [-1.5, 1.5], resolucion: 40
      })
      setMallaActual(malla)
      setExpresionActual(expresion)
      renderizarSuperficie(malla, colorOverride || color)
      setHaySuperficie(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al generar la superficie')
    } finally {
      setCargando(false)
    }
  }, [color, renderizarSuperficie])

  const handleArchivo = useCallback(async (file) => {
    setCargando(true)
    setError(null)
    setDatosEddie(null)
    setHaySuperficie(false)
    try {
      const formData = new FormData()
      formData.append('archivo', file)
      const { data } = await api.post('/csv/subir', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const primera = data.datos[0]
      if (data.formato === 'eddie') {
        const variablesPorArbol = primera.arboles.map(arbol => {
          const matches = [...arbol.matchAll(/x\d+/g)]
          return [...new Set(matches.map(m => m[0]))]
        })
        setDatosEddie({ arboles: primera.arboles, variables: primera.variables, variablesPorArbol })
        setArbolIdx(0)
        const vars0 = variablesPorArbol[0] || []
        setVarX(vars0[0] || '')
        setVarY(vars0[1] || vars0[0] || '')
        setCargando(false)
      } else {
        const expresion = primera.expresion_algebraica
        const { data: vars } = await api.post('/csv/variables', { expresion })
        const vX = vars.variables[0]
        const vY = vars.variables[1] || vars.variables[0]
        await graficarExpresion(expresion, vX, vY)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar el archivo')
      setCargando(false)
    }
  }, [graficarExpresion])

  const handleArbol = useCallback((idx) => {
    setArbolIdx(idx)
    if (datosEddie) {
      const vars = datosEddie.variablesPorArbol[idx] || []
      setVarX(vars[0] || '')
      setVarY(vars[1] || vars[0] || '')
    }
  }, [datosEddie])

  const handleGraficarEddie = useCallback(() => {
    if (!datosEddie) return
    graficarExpresion(datosEddie.arboles[arbolIdx], varX, varY)
  }, [datosEddie, arbolIdx, varX, varY, graficarExpresion])

  const handleColor = useCallback((c) => {
    setColor(c)
    if (mallaActual) renderizarSuperficie(mallaActual, c)
  }, [mallaActual, renderizarSuperficie])

  // ── Descargar: abre modal ──
  const handleAbrirDescargar = useCallback(() => setModalDescargar(true), [])

  const handleConfirmarDescargar = useCallback(({ nombre, formato }) => {
    const img = capturarImagen()
    if (!img) return

    if (formato === 'JPEG') {
      const a = document.createElement('a')
      a.href = img
      a.download = `${nombre}.png` // el canvas exporta PNG; se guarda con ese formato
      a.click()
    } else {
      // Para PDF: se abre la imagen en una pestaña nueva como alternativa simple
      // (una implementación con jsPDF podría añadirse después si se requiere)
      const win = window.open()
      win.document.write(`<img src="${img}" style="width:100%" />`)
    }
    setModalDescargar(false)
  }, [capturarImagen])

  // ── Destacar: abre modal ──
  const handleAbrirDestacar = useCallback(() => setModalDestacar(true), [])

  const handleConfirmarDestacar = useCallback(async ({ nombre_experimento, expresion_algebraica }) => {
    setGuardando(true)
    try {
      const imagen_preview = capturarImagen()
      await api.post('/funciones', {
        nombre_experimento,
        expresion_algebraica,
        imagen_preview
      })
      setModalDestacar(false)
      setMensajeExito('Función guardada correctamente en tu historial')
      setTimeout(() => setMensajeExito(null), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la función destacada')
    } finally {
      setGuardando(false)
    }
  }, [capturarImagen])

  // Si venimos de "Función destacada" con una expresión para cargar, graficarla
  useEffect(() => {
    const expresionCargada = location.state?.expresionCargada
    if (expresionCargada) {
      api.post('/csv/variables', { expresion: expresionCargada })
        .then(({ data: vars }) => {
          const vX = vars.variables[0]
          const vY = vars.variables[1] || vars.variables[0]
          graficarExpresion(expresionCargada, vX, vY)
        })
        .catch(() => setError('No se pudo cargar la función guardada'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout subtitulo="Plano de graficas">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 rounded-xl px-4 py-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      {mensajeExito && (
        <div className="mb-4 bg-green-100 border border-green-300 rounded-xl px-4 py-3">
          <p className="text-green-700 text-sm">{mensajeExito}</p>
        </div>
      )}

      <ModuloPlano canvasRef={canvasRef} />
      <ModuloAjustes colorActivo={color} onColor={handleColor} onReset={resetCamara}
        onFullscreen={() => canvasRef.current?.requestFullscreen?.()} />
      <ModuloCarga
        onArchivo={handleArchivo}
        onDescargar={handleAbrirDescargar}
        onDestacar={handleAbrirDestacar}
        haySuperficie={haySuperficie} cargando={cargando}
        datosEddie={datosEddie} arbolIdx={arbolIdx} varX={varX} varY={varY}
        onArbol={handleArbol} onVarX={setVarX} onVarY={setVarY} onGraficar={handleGraficarEddie}
      />

      <ModalDescargar
        abierto={modalDescargar}
        onCerrar={() => setModalDescargar(false)}
        onConfirmar={handleConfirmarDescargar}
        previewImg={haySuperficie ? capturarImagen() : null}
      />

      <ModalDestacar
        abierto={modalDestacar}
        onCerrar={() => setModalDestacar(false)}
        onConfirmar={handleConfirmarDestacar}
        previewImg={haySuperficie ? capturarImagen() : null}
        expresionSugerida={expresionActual}
        cargando={guardando}
      />
    </Layout>
  )
}

export default DashboardPage
