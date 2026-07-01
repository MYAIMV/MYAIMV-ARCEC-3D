import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import api from '../services/api'

const formatearFecha = (isoString) => {
  const d = new Date(isoString)
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const FuncionDestacadaPage = () => {
  const navigate = useNavigate()
  const [funciones, setFunciones] = useState([])
  const [cargando, setCargando]   = useState(true)
  const [error, setError]         = useState(null)
  const [busqueda, setBusqueda]   = useState('')

  const cargar = async () => {
    setCargando(true)
    setError(null)
    try {
      const { data } = await api.get('/funciones')
      setFunciones(data.funciones)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar las funciones destacadas')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const handleEliminar = async (id_funcion) => {
    if (!window.confirm('¿Eliminar este plano guardado?')) return
    try {
      await api.delete(`/funciones/${id_funcion}`)
      setFunciones(prev => prev.filter(f => f.id_funcion !== id_funcion))
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo eliminar')
    }
  }

  // "Cargar plano": lleva al dashboard con la expresión en el state de navegación
  const handleCargarPlano = (funcion) => {
    navigate('/dashboard', { state: { expresionCargada: funcion.expresion_algebraica } })
  }

  const filtradas = useMemo(() => {
    if (!busqueda.trim()) return funciones
    const q = busqueda.toLowerCase()
    return funciones.filter(f => f.nombre_experimento.toLowerCase().includes(q))
  }, [funciones, busqueda])

  return (
    <Layout subtitulo="Funciones destacadas y relieves guardados">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 rounded-xl px-4 py-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="border border-gray-300 rounded-xl p-4 bg-white mb-6">
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

      {cargando ? (
        <p className="text-gray-400 text-center py-12">Cargando funciones destacadas...</p>
      ) : filtradas.length === 0 ? (
        <p className="text-gray-400 text-center py-12">
          {busqueda ? 'Sin resultados para tu búsqueda' : 'Aún no has destacado ninguna gráfica. Ve a "Graficar" y usa el botón "Destacar grafica".'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtradas.map((f) => (
            <div key={f.id_funcion} className="border border-gray-300 rounded-xl p-5 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{f.nombre_experimento}</h3>
              <p className="text-sm text-gray-500 mb-4">Guardado el: {formatearFecha(f.fecha_guardado)}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCargarPlano(f)}
                  className="px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#7a9bbf' }}
                >
                  Cargar plano
                </button>
                <button
                  onClick={() => handleEliminar(f.id_funcion)}
                  className="px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#e08a8a' }}
                >
                  Eliminar plano
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

export default FuncionDestacadaPage
