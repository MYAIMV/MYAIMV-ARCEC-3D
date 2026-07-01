import { useState, useEffect, useMemo } from 'react'
import Layout from '../components/layout/Layout'
import api from '../services/api'

const formatearFecha = (isoString) => {
  const d = new Date(isoString)
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const HistorialPage = () => {
  const [funciones, setFunciones] = useState([])
  const [cargando, setCargando]   = useState(true)
  const [error, setError]         = useState(null)
  const [busqueda, setBusqueda]   = useState('')
  const [detalle, setDetalle]     = useState(null) // función seleccionada para vista rápida

  const cargarHistorial = async () => {
    setCargando(true)
    setError(null)
    try {
      const { data } = await api.get('/funciones')
      setFunciones(data.funciones)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar el historial')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargarHistorial() }, [])

  const handleVer = async (id_funcion) => {
    try {
      const { data } = await api.get(`/funciones/${id_funcion}`)
      setDetalle(data.funcion)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cargar el detalle')
    }
  }

  const handleEliminar = async (id_funcion) => {
    if (!window.confirm('¿Eliminar esta función del historial? Esta acción no se puede deshacer.')) return
    try {
      await api.delete(`/funciones/${id_funcion}`)
      setFunciones(prev => prev.filter(f => f.id_funcion !== id_funcion))
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo eliminar')
    }
  }

  const filtradas = useMemo(() => {
    if (!busqueda.trim()) return funciones
    const q = busqueda.toLowerCase()
    return funciones.filter(f =>
      f.nombre_experimento.toLowerCase().includes(q) ||
      f.expresion_algebraica.toLowerCase().includes(q)
    )
  }, [funciones, busqueda])

  // Rellenar hasta 8 filas visuales vacías, fiel al prototipo (tabla con espacio)
  const filasVacias = Math.max(0, 8 - filtradas.length)

  return (
    <Layout subtitulo="Historial de experimentos">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 rounded-xl px-4 py-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="border border-gray-300 rounded-xl p-4 bg-white mb-4">
        <h2 className="text-base font-bold text-gray-800 mb-3">Filtro de busqueda</h2>
        <div className="rounded-xl px-4 py-3 flex items-center gap-2" style={{ backgroundColor: '#dfead0' }}>
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/>
          </svg>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre de archivo"
            className="bg-transparent flex-1 text-sm focus:outline-none placeholder-gray-500"
          />
        </div>
      </div>

      <div className="border border-gray-300 rounded-xl bg-white overflow-hidden">
        <h2 className="text-base font-bold text-gray-800 px-4 pt-4 pb-3">Historial de datos</h2>

        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#6b8f3a' }}>
              <th className="text-left text-white font-bold px-4 py-3 w-16">ID</th>
              <th className="text-left text-white font-bold px-4 py-3">Nombre del experimento</th>
              <th className="text-left text-white font-bold px-4 py-3">Expresión algebraica</th>
              <th className="text-left text-white font-bold px-4 py-3 w-32">Fecha</th>
              <th className="text-left text-white font-bold px-4 py-3 w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Cargando historial...</td></tr>
            ) : filtradas.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">
                {busqueda ? 'Sin resultados para tu búsqueda' : 'Aún no has guardado ninguna función destacada'}
              </td></tr>
            ) : (
              filtradas.map((f) => (
                <tr key={f.id_funcion} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{f.id_funcion}</td>
                  <td className="px-4 py-3">{f.nombre_experimento}</td>
                  <td className="px-4 py-3 font-mono text-xs">{f.expresion_algebraica}</td>
                  <td className="px-4 py-3">{formatearFecha(f.fecha_guardado)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => handleVer(f.id_funcion)} title="Ver"
                        className="text-gray-600 hover:text-gray-900 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button onClick={() => handleEliminar(f.id_funcion)} title="Eliminar"
                        className="text-red-500 hover:text-red-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {Array.from({ length: filasVacias }).map((_, i) => (
              <tr key={`empty-${i}`} className="border-t border-gray-100" style={{ backgroundColor: '#f3f5ee' }}>
                <td className="px-4 py-4" colSpan={5}>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de detalle rápido */}
      {detalle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
             onClick={() => setDetalle(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{detalle.nombre_experimento}</h3>
            {detalle.imagen_preview && (
              <img src={detalle.imagen_preview} alt="preview" className="w-full rounded-lg border border-gray-200 mb-4" />
            )}
            <p className="text-sm text-gray-600 mb-1">Expresión algebraica:</p>
            <p className="font-mono text-sm bg-gray-50 rounded-lg p-3 mb-4 break-all">{detalle.expresion_algebraica}</p>
            <p className="text-xs text-gray-400">Guardado el {formatearFecha(detalle.fecha_guardado)}</p>
            <button onClick={() => setDetalle(null)}
              className="mt-4 w-full py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90"
              style={{ backgroundColor: '#7a9bbf' }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default HistorialPage
