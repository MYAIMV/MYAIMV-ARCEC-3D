import { useState, useRef, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import Layout from '../components/layout/Layout'
import ModalDescargar from '../components/visualizer/ModalDescargar'
import ModalDestacar from '../components/visualizer/ModalDestacar'
import Grafica2D from '../components/visualizer/Grafica2D'
import { useThreeJS, colorPorIndice } from '../hooks/useThreeJS'
import { useVisualizacion } from '../context/VisualizacionContext'
import api from '../services/api'

const BannerFuncion = ({ expresion, ejesActivos, constantes }) => (
  <div className="rounded-xl px-4 py-3 mb-4 border-l-4" style={{ backgroundColor: '#eef2f0', borderColor: '#4a6741' }}>
    <p className="text-sm font-mono text-gray-700 break-all">
      <span className="font-bold">Función Algebraica:</span> f = {expresion || '—'}
    </p>
    <p className="text-sm font-mono text-gray-700 mt-1">
      <span className="font-bold">Ejes Proyectados:</span> {ejesActivos.length ? ejesActivos.join(', ') : 'Ninguno'}
    </p>
    {constantes.length > 0 && (
      <p className="text-sm font-mono text-gray-700 mt-1">
        <span className="font-bold">Constantes fijadas:</span> {constantes.join(', ')}
      </p>
    )}
    {ejesActivos.length === 0 && (
      <p className="text-xs mt-1.5 font-semibold" style={{ color: '#b91c1c' }}>
        Ninguna variable está en modo gráfico. Marca al menos una para poder graficar.
      </p>
    )}
    {ejesActivos.length > 2 && (
      <p className="text-xs mt-1.5 font-semibold" style={{ color: '#b45309' }}>
        Hay {ejesActivos.length} variables en modo gráfico. Deja solo 1 (gráfica 2D) o 2 (gráfica 3D);
        cambia el resto a modo constante.
      </p>
    )}
  </div>
)

const ModuloPlano = ({ canvasRef, tipoGrafica, curva, funcionTexto, color }) => (
  <div className="border border-gray-300 rounded-xl p-4 bg-white mb-4">
    <h2 className="text-base font-bold text-gray-800 mb-3">Modulo de Plano y Coordenadas</h2>
    <div ref={canvasRef} className="w-full rounded-lg" style={{ height: '420px', display: tipoGrafica === '3d' ? 'block' : 'none' }} />
    {tipoGrafica === '2d' && curva && (
      <div className="w-full flex items-center justify-center" style={{ minHeight: '420px' }}>
        <Grafica2D curva={curva} nombreFuncion={funcionTexto} color={color} />
      </div>
    )}
    {!tipoGrafica && (
      <div className="w-full flex items-center justify-center text-gray-400 text-sm" style={{ height: '420px' }}>
        Selecciona una función y presiona Graficar
      </div>
    )}
  </div>
)

const BotonIcono = ({ onClick, title, children }) => (
  <button onClick={onClick} title={title}
    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
    {children}
  </button>
)

const ModuloAjustes = ({ onReset, onFullscreen, onGirarH, onGirarV, onZoom }) => (
  <div className="border border-gray-300 rounded-xl p-4 bg-white mb-4 flex items-center justify-center gap-4 flex-wrap">
    <div className="flex items-center gap-2.5 rounded-xl px-3 py-2" style={{ backgroundColor: '#f5f5f0' }}>
      <div className="grid grid-cols-3 gap-0.5 w-[84px]">
        <div /><BotonIcono onClick={() => onGirarV(-12)} title="Inclinar arriba">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M10 4l6 8H4l6-8z"/></svg></BotonIcono><div />
        <BotonIcono onClick={() => onGirarH(-12)} title="Girar izquierda">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M4 10l8-6v12l-8-6z"/></svg></BotonIcono>
        <BotonIcono onClick={onReset} title="Restablecer vista">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M10 3a7 7 0 106.32 4H14a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V8.7A9 9 0 1110 1v2z"/></svg></BotonIcono>
        <BotonIcono onClick={() => onGirarH(12)} title="Girar derecha">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M16 10l-8 6V4l8 6z"/></svg></BotonIcono>
        <div /><BotonIcono onClick={() => onGirarV(12)} title="Inclinar abajo">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M10 16l-6-8h12l-6 8z"/></svg></BotonIcono><div />
      </div>
      <div className="w-px h-8 bg-gray-300" />
      <div className="flex items-center gap-0.5">
        <BotonIcono onClick={() => onZoom(0.8)} title="Acercar">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 3a6 6 0 104.472 10.03l3.249 3.25a1 1 0 001.415-1.415l-3.25-3.249A6 6 0 009 3zM5 9a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd"/><path d="M9 6a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H7a1 1 0 110-2h1V7a1 1 0 011-1z"/></svg></BotonIcono>
        <BotonIcono onClick={() => onZoom(1.25)} title="Alejar">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 3a6 6 0 104.472 10.03l3.249 3.25a1 1 0 001.415-1.415l-3.25-3.249A6 6 0 009 3zM5 9a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd"/><path d="M7 8h4a1 1 0 110 2H7a1 1 0 110-2z"/></svg></BotonIcono>
      </div>
      <div className="w-px h-8 bg-gray-300" />
      <BotonIcono onClick={onFullscreen} title="Pantalla completa">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M3 3h5v2H5v3H3V3zm9 0h5v5h-2V5h-3V3zM3 12h2v3h3v2H3v-5zm12 3h-3v2h5v-5h-2v3z"/></svg>
      </BotonIcono>
    </div>
  </div>
)

const TarjetaVariable = ({ nombre, info, onToggleModo, onValor, onMin, onMax }) => (
  <div className="border border-gray-200 rounded-xl p-3 bg-white mb-3">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-600">Variable: <span className="font-mono font-bold text-gray-900">{nombre}</span></span>
      <button onClick={() => onToggleModo(nombre)}
        className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: info.modo === 'grafico' ? '#4a6741' : '#6c757d' }}>
        {info.modo === 'grafico' ? 'Valor Gráfico' : 'Valor Constante'}
      </button>
    </div>
    {info.modo === 'constante' ? (
      <div>
        <label className="text-[11px] text-gray-500 block mb-1">Asignar valor constante fijo:</label>
        <input type="number" step="0.1" value={info.valor} onChange={e => onValor(nombre, e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-500" />
      </div>
    ) : (
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-[11px] text-gray-500 block mb-1">Mínimo:</label>
          <input type="number" step="0.1" value={info.min} onChange={e => onMin(nombre, e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-500" />
        </div>
        <div className="flex-1">
          <label className="text-[11px] text-gray-500 block mb-1">Máximo:</label>
          <input type="number" step="0.1" value={info.max} onChange={e => onMax(nombre, e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:border-gray-500" />
        </div>
      </div>
    )}
  </div>
)

const ModuloCarga = ({
  onArchivo, nombreArchivo, cargando,
  datosArchivo, filaSeleccionada, onCambiarFila,
  funcionSeleccionada, onCambiarFuncion,
  variablesInfo, onToggleModo, onValor, onMin, onMax,
  onGraficar, onDescargar, onDestacar, haySuperficie
}) => {
  const inputRef = useRef()
  const [arrastrando, setArrastrando] = useState(false)
  const procesarArchivo = (file) => { if (!file) return; onArchivo(file) }

  const columnas = datosArchivo?.columnasExpresion || []
  const filaActual = datosArchivo?.filas?.[filaSeleccionada]

  return (
    <div className="border border-gray-300 rounded-xl p-4 bg-white">
      <h2 className="text-base font-bold text-gray-800 mb-3">Configuración</h2>

      <div onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => { e.preventDefault(); setArrastrando(false); procesarArchivo(e.dataTransfer.files[0]) }}
        className="rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all text-center px-4 py-6 select-none mb-4"
        style={{ backgroundColor: arrastrando ? '#b8ccb0' : '#c8d8b0', border: arrastrando ? '2px dashed #4a6741' : '2px dashed transparent' }}>
        <input ref={inputRef} type="file" accept=".csv,.txt,.xlsx" className="hidden"
          onChange={(e) => procesarArchivo(e.target.files[0])} />
        {cargando
          ? <p className="text-gray-700 font-medium text-sm">Procesando...</p>
          : nombreArchivo
            ? <p className="text-gray-700 font-medium text-sm">📄 {nombreArchivo}</p>
            : <><p className="text-gray-700 font-medium">Arrastra tu archivo</p>
                <p className="text-gray-700 font-medium">csv, txt o xlsx aquí, o busca</p></>}
      </div>

      {datosArchivo && (
        <>
          {datosArchivo.filas.length > 1 && (
            <div className="mb-3">
              <label className="text-xs text-gray-600 font-medium block mb-1">Corrida / fila del archivo</label>
              <select value={filaSeleccionada} onChange={e => onCambiarFila(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {datosArchivo.filas.map((f, i) => {
                  const metaKeys = Object.keys(f.metadata)
                  const etiquetaExtra = metaKeys.length ? ` — ${metaKeys[0]}=${f.metadata[metaKeys[0]]}` : ''
                  return <option key={i} value={i}>Fila {i + 1}{etiquetaExtra}</option>
                })}
              </select>
            </div>
          )}

          {columnas.length > 0 && (
            <div className="mb-4">
              <label className="text-xs text-gray-600 font-medium block mb-1">Función a graficar</label>
              <select value={funcionSeleccionada?.columna || ''} onChange={e => onCambiarFuncion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="" disabled>Selecciona una función...</option>
                {columnas.map(col => {
                  const expr = filaActual?.expresiones?.[col] || ''
                  const preview = expr.length > 35 ? expr.slice(0, 35) + '...' : expr
                  return <option key={col} value={col}>{col}: {preview}</option>
                })}
              </select>
            </div>
          )}

          {funcionSeleccionada && (
            <>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Mapeo Dinámico de Variables</h3>
              <div className="max-h-[340px] overflow-y-auto pr-1 -mr-1 mb-1" style={{ scrollbarWidth: 'thin' }}>
                {Object.keys(variablesInfo).length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Esta función no tiene variables.</p>
                ) : (
                  Object.entries(variablesInfo).map(([nombre, info]) => (
                    <TarjetaVariable key={nombre} nombre={nombre} info={info}
                      onToggleModo={onToggleModo} onValor={onValor} onMin={onMin} onMax={onMax} />
                  ))
                )}
              </div>
              {Object.keys(variablesInfo).length > 4 && (
                <p className="text-[11px] text-gray-400 text-center -mt-1 mb-3">↕ desplázate para ver más variables</p>
              )}

              <div className="flex gap-3 mt-2 pt-3 border-t border-gray-200">
                <button onClick={onGraficar}
                  className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#4a6741' }}>
                  Graficar
                </button>
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={onDescargar} disabled={!haySuperficie}
                  className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-opacity disabled:opacity-40 hover:opacity-90"
                  style={{ backgroundColor: '#6b8f3a' }}>Descargar</button>
                <button onClick={onDestacar} disabled={!haySuperficie}
                  className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-opacity disabled:opacity-40 hover:opacity-90"
                  style={{ backgroundColor: '#7a9bbf' }}>Destacar</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

const DashboardPage = () => {
  const canvasRef = useRef()
  const location = useLocation()
  const { renderizarSuperficies, resetCamara, capturarImagen, capturarImagenCompleta, obtenerDimensionesCanvas, girarHorizontal, girarVertical, aplicarZoom } = useThreeJS(canvasRef)

  const {
    nombreArchivo, setNombreArchivo,
    datosArchivo, setDatosArchivo,
    filaSeleccionada, setFilaSeleccionada,
    funcionSeleccionada, setFuncionSeleccionada,
    variablesInfo, setVariablesInfo,
    tipoGrafica, setTipoGrafica,
    datosGrafica, setDatosGrafica,
    haySuperficie, setHaySuperficie
  } = useVisualizacion()

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [modalDescargar, setModalDescargar] = useState(false)
  const [modalDestacar, setModalDestacar] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [mensajeExito, setMensajeExito] = useState(null)

  useEffect(() => {
    if (!location.state?.expresionCargada && tipoGrafica === '3d' && datosGrafica) {
      renderizarSuperficies([{ malla: datosGrafica, color: colorPorIndice(0, 1) }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const construirVariablesInfo = useCallback((nombresVariables, previo = {}) => {
    const nuevo = {}
    nombresVariables.forEach(nombre => {
      nuevo[nombre] = previo[nombre] || { modo: 'constante', valor: 5, min: -10, max: 10 }
    })
    const activos = Object.values(nuevo).filter(v => v.modo === 'grafico')
    if (activos.length === 0) {
      nombresVariables.slice(0, 2).forEach(n => { nuevo[n] = { ...nuevo[n], modo: 'grafico' } })
    }
    return nuevo
  }, [])

  const seleccionarFuncion = useCallback(async (columna, datos, filaIdx) => {
    const fila = datos.filas[filaIdx]
    const expresion = fila.expresiones[columna]
    setFuncionSeleccionada({ columna, expresion })
    setTipoGrafica(null)
    setDatosGrafica(null)
    setHaySuperficie(false)
    try {
      const { data } = await api.post('/archivos/variables', { expresiones: [expresion] })
      const vars = data.variablesUnion
      setVariablesInfo(construirVariablesInfo(vars))
    } catch (err) {
      setError('No se pudieron detectar las variables de esta función')
    }
  }, [construirVariablesInfo, setFuncionSeleccionada, setTipoGrafica, setDatosGrafica, setHaySuperficie, setVariablesInfo])

  const handleArchivo = useCallback(async (file) => {
    setCargando(true)
    setError(null)
    setDatosArchivo(null)
    setFuncionSeleccionada(null)
    setTipoGrafica(null)
    setDatosGrafica(null)
    setHaySuperficie(false)
    try {
      const formData = new FormData()
      formData.append('archivo', file)
      const { data } = await api.post('/archivos/subir', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setNombreArchivo(file.name)
      const datos = { columnasExpresion: data.columnasExpresion, columnasMetadata: data.columnasMetadata, filas: data.filas }
      setDatosArchivo(datos)
      setFilaSeleccionada(0)
      if (datos.columnasExpresion.length > 0) {
        await seleccionarFuncion(datos.columnasExpresion[0], datos, 0)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar el archivo')
    } finally {
      setCargando(false)
    }
  }, [seleccionarFuncion, setDatosArchivo, setFuncionSeleccionada, setTipoGrafica, setDatosGrafica, setHaySuperficie, setNombreArchivo, setFilaSeleccionada])

  const handleCambiarFila = useCallback(async (indice) => {
    setFilaSeleccionada(indice)
    if (datosArchivo && datosArchivo.columnasExpresion.length > 0) {
      await seleccionarFuncion(datosArchivo.columnasExpresion[0], datosArchivo, indice)
    }
  }, [datosArchivo, seleccionarFuncion, setFilaSeleccionada])

  const handleCambiarFuncion = useCallback(async (columna) => {
    if (datosArchivo) await seleccionarFuncion(columna, datosArchivo, filaSeleccionada)
  }, [datosArchivo, filaSeleccionada, seleccionarFuncion])

  const handleToggleModo = useCallback((nombre) => {
    setVariablesInfo(prev => ({
      ...prev,
      [nombre]: { ...prev[nombre], modo: prev[nombre].modo === 'grafico' ? 'constante' : 'grafico' }
    }))
  }, [setVariablesInfo])
  const handleValor = useCallback((nombre, valor) => {
    setVariablesInfo(prev => ({ ...prev, [nombre]: { ...prev[nombre], valor } }))
  }, [setVariablesInfo])
  const handleMin = useCallback((nombre, min) => {
    setVariablesInfo(prev => ({ ...prev, [nombre]: { ...prev[nombre], min } }))
  }, [setVariablesInfo])
  const handleMax = useCallback((nombre, max) => {
    setVariablesInfo(prev => ({ ...prev, [nombre]: { ...prev[nombre], max } }))
  }, [setVariablesInfo])

  const handleGraficar = useCallback(async () => {
    if (!funcionSeleccionada) return
    const { expresion } = funcionSeleccionada
    const nombres = Object.keys(variablesInfo)
    const ejesActivos = nombres.filter(n => variablesInfo[n].modo === 'grafico')
    const variablesFijas = {}
    nombres.forEach(n => { if (variablesInfo[n].modo === 'constante') variablesFijas[n] = Number(variablesInfo[n].valor) })

    if (ejesActivos.length === 0) {
      setError('Ninguna variable está en modo gráfico. Marca al menos una para poder graficar.')
      return
    }
    if (ejesActivos.length > 2) {
      setError(`Hay ${ejesActivos.length} variables en modo gráfico. Deja solo 1 o 2 (cambia el resto a modo constante).`)
      return
    }

    setCargando(true)
    setError(null)
    try {
      if (ejesActivos.length === 1) {
        const varX = ejesActivos[0]
        const rangoX = [Number(variablesInfo[varX].min), Number(variablesInfo[varX].max)]
        if (rangoX[0] >= rangoX[1] || Number.isNaN(rangoX[0]) || Number.isNaN(rangoX[1])) {
          setError(`El rango de ${varX} no es válido`); setCargando(false); return
        }
        const { data: curva } = await api.post('/archivos/curva', { expresion, varX, variablesFijas, rangoX, resolucion: 120 })
        setTipoGrafica('2d')
        setDatosGrafica(curva)
        setHaySuperficie(true)
      } else {
        const [varX, varY] = ejesActivos
        const rangoX = [Number(variablesInfo[varX].min), Number(variablesInfo[varX].max)]
        const rangoY = [Number(variablesInfo[varY].min), Number(variablesInfo[varY].max)]
        if (rangoX[0] >= rangoX[1] || Number.isNaN(rangoX[0]) || Number.isNaN(rangoX[1])) {
          setError(`El rango de ${varX} no es válido`); setCargando(false); return
        }
        if (rangoY[0] >= rangoY[1] || Number.isNaN(rangoY[0]) || Number.isNaN(rangoY[1])) {
          setError(`El rango de ${varY} no es válido`); setCargando(false); return
        }
        const { data } = await api.post('/archivos/superficies', {
          expresiones: [expresion], varX, varY, variablesFijas, rangoX, rangoY, resolucion: 40
        })
        const resultado = data.superficies[0]
        if (resultado.error) {
          setError('No se pudo generar la superficie: ' + resultado.error)
          setCargando(false)
          return
        }
        setTipoGrafica('3d')
        setDatosGrafica(resultado.malla)
        renderizarSuperficies([{ malla: resultado.malla, color: colorPorIndice(0, 1) }])
        setHaySuperficie(true)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al generar la gráfica')
    } finally {
      setCargando(false)
    }
  }, [funcionSeleccionada, variablesInfo, renderizarSuperficies, setTipoGrafica, setDatosGrafica, setHaySuperficie])

  useEffect(() => {
    const expresionCargada = location.state?.expresionCargada
    if (!expresionCargada) return

    (async () => {
      setCargando(true)
      setError(null)
      try {
        setNombreArchivo('Función destacada')
        setDatosArchivo({ columnasExpresion: ['f'], columnasMetadata: [], filas: [{ indice: 0, expresiones: { f: expresionCargada }, metadata: {} }] })
        setFilaSeleccionada(0)
        setFuncionSeleccionada({ columna: 'f', expresion: expresionCargada })

        const { data } = await api.post('/archivos/variables', { expresiones: [expresionCargada] })
        const vInfo = construirVariablesInfo(data.variablesUnion)
        setVariablesInfo(vInfo)

        const nombres = Object.keys(vInfo)
        const ejesActivos = nombres.filter(n => vInfo[n].modo === 'grafico')
        if (ejesActivos.length === 0 || ejesActivos.length > 2) {
          setError('Ajusta manualmente el mapeo de variables y presiona Graficar.')
          setCargando(false)
          return
        }
        const variablesFijas = {}
        nombres.forEach(n => { if (vInfo[n].modo === 'constante') variablesFijas[n] = Number(vInfo[n].valor) })

        if (ejesActivos.length === 1) {
          const varX = ejesActivos[0]
          const rangoX = [Number(vInfo[varX].min), Number(vInfo[varX].max)]
          const { data: curva } = await api.post('/archivos/curva', { expresion: expresionCargada, varX, variablesFijas, rangoX, resolucion: 120 })
          setTipoGrafica('2d')
          setDatosGrafica(curva)
          setHaySuperficie(true)
        } else {
          const [varX, varY] = ejesActivos
          const rangoX = [Number(vInfo[varX].min), Number(vInfo[varX].max)]
          const rangoY = [Number(vInfo[varY].min), Number(vInfo[varY].max)]
          const { data: sup } = await api.post('/archivos/superficies', {
            expresiones: [expresionCargada], varX, varY, variablesFijas, rangoX, rangoY, resolucion: 40
          })
          const resultado = sup.superficies[0]
          if (!resultado.error) {
            setTipoGrafica('3d')
            setDatosGrafica(resultado.malla)
            renderizarSuperficies([{ malla: resultado.malla, color: colorPorIndice(0, 1) }])
            setHaySuperficie(true)
          }
        }
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar la función guardada')
      } finally {
        setCargando(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

const handleConfirmarDescargar = useCallback(({ nombre, formato }) => {
    // Helper: dispara la descarga de un dataURL o blob URL
    const descargar = (url, nombreArchivo) => {
      const a = document.createElement('a')
      a.href = url
      a.download = nombreArchivo
      a.click()
    }

    // Helper: genera un PDF con la imagen centrada y a escala
    const generarPDF = (dataURL, ancho, alto) => {
      const pdf = new jsPDF({ orientation: ancho >= alto ? 'landscape' : 'portrait', unit: 'pt', format: 'letter' })
      const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight()
      const margen = 40, maxW = pageW - margen * 2, maxH = pageH - margen * 2
      const escala = Math.min(maxW / ancho, maxH / alto)
      const imgW = ancho * escala, imgH = alto * escala
      pdf.setFontSize(14)
      pdf.text('ARCEC-3D — Gráfica exportada', margen, margen - 15)
      pdf.addImage(dataURL, 'PNG', (pageW - imgW) / 2, (pageH - imgH) / 2, imgW, imgH)
      pdf.save(`${nombre}.pdf`)
    }

  if (tipoGrafica === '3d') {
      const { width, height } = obtenerDimensionesCanvas()

      if (formato === 'JPEG') {
        const img = capturarImagenCompleta(false)
        if (!img) return
        descargar(img, `${nombre}.jpg`)
      } else if (formato === 'PNG') {
        const img = capturarImagenCompleta(true)
        if (!img) return
        descargar(img, `${nombre}.png`)
      } else if (formato === 'SVG') {
        const img = capturarImagenCompleta(true)
        if (!img) return
        const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
                       `<image href="${img}" width="${width}" height="${height}"/></svg>`
        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        descargar(url, `${nombre}.svg`)
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } else {
        const img = capturarImagenCompleta(false)
        if (!img) return
        generarPDF(img, width, height)
      }
    } else {
      const svg = document.querySelector('#grafica-2d-svg')
      if (!svg) return
      const serializer = new XMLSerializer()
      const svgStr = serializer.serializeToString(svg)

      // En 2D la gráfica ya ES un SVG: se exporta vectorial puro, sin rasterizar.
      if (formato === 'SVG') {
        const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        descargar(url, `${nombre}.svg`)
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        setModalDescargar(false)
        return
      }

      // Para PNG / JPEG / PDF se rasteriza el SVG sobre un canvas
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      const img2 = new Image()
      img2.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img2.width * 2; canvas.height = img2.height * 2
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img2, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(url)

        if (formato === 'JPEG') {
          descargar(canvas.toDataURL('image/jpeg'), `${nombre}.jpg`)
        } else if (formato === 'PNG') {
          descargar(canvas.toDataURL('image/png'), `${nombre}.png`)
        } else {
          generarPDF(canvas.toDataURL('image/png'), canvas.width, canvas.height)
        }
      }
      img2.src = url
    }
    setModalDescargar(false)
  }, [tipoGrafica, capturarImagen, obtenerDimensionesCanvas])

  const handleConfirmarDestacar = useCallback(async ({ nombre_experimento, expresion_algebraica }) => {
    setGuardando(true)
    try {
      const imagen_preview = tipoGrafica === '3d' ? capturarImagen('png') : null
      await api.post('/funciones', { nombre_experimento, expresion_algebraica, imagen_preview })
      setModalDestacar(false)
      setMensajeExito('Función guardada correctamente en tu historial')
      setTimeout(() => setMensajeExito(null), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la función destacada')
    } finally {
      setGuardando(false)
    }
  }, [tipoGrafica, capturarImagen])

  const nombres = Object.keys(variablesInfo)
  const ejesActivosActuales = nombres.filter(n => variablesInfo[n]?.modo === 'grafico')
  const constantesActuales = nombres.filter(n => variablesInfo[n]?.modo === 'constante')
  const colorActual = colorPorIndice(0, 1)

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

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
        <ModuloCarga
          onArchivo={handleArchivo} nombreArchivo={nombreArchivo} cargando={cargando}
          datosArchivo={datosArchivo} filaSeleccionada={filaSeleccionada} onCambiarFila={handleCambiarFila}
          funcionSeleccionada={funcionSeleccionada} onCambiarFuncion={handleCambiarFuncion}
          variablesInfo={variablesInfo} onToggleModo={handleToggleModo}
          onValor={handleValor} onMin={handleMin} onMax={handleMax}
          onGraficar={handleGraficar}
          onDescargar={() => setModalDescargar(true)} onDestacar={() => setModalDestacar(true)}
          haySuperficie={haySuperficie}
        />

        <div>
          {funcionSeleccionada && (
            <BannerFuncion expresion={funcionSeleccionada.expresion} ejesActivos={ejesActivosActuales} constantes={constantesActuales} />
          )}
          <ModuloPlano canvasRef={canvasRef} tipoGrafica={tipoGrafica} curva={tipoGrafica === '2d' ? datosGrafica : null}
            funcionTexto={funcionSeleccionada?.expresion} color={colorActual} />
          {tipoGrafica === '3d' && (
            <ModuloAjustes onReset={resetCamara} onFullscreen={() => canvasRef.current?.requestFullscreen?.()}
              onGirarH={girarHorizontal} onGirarV={girarVertical} onZoom={aplicarZoom} />
          )}
        </div>
      </div>

      <ModalDescargar abierto={modalDescargar} onCerrar={() => setModalDescargar(false)}
        onConfirmar={handleConfirmarDescargar} previewImg={tipoGrafica === '3d' && haySuperficie ? capturarImagen('png') : null} />

      <ModalDestacar abierto={modalDestacar} onCerrar={() => setModalDestacar(false)}
        onConfirmar={handleConfirmarDestacar} previewImg={tipoGrafica === '3d' && haySuperficie ? capturarImagen('png') : null}
        expresionesDisponibles={funcionSeleccionada ? [funcionSeleccionada.expresion] : []} cargando={guardando} />
    </Layout>
  )
}

export default DashboardPage