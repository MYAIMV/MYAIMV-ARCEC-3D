import { useState, useEffect } from 'react'

// Modal fiel al prototipo (página 5): nombre experimento + expresión + fecha
const ModalDestacar = ({ abierto, onCerrar, onConfirmar, previewImg, expresionSugerida, cargando }) => {
  const [nombreExperimento, setNombreExperimento] = useState('')
  const [expresion, setExpresion]                 = useState('')
  const [fecha, setFecha]                         = useState('')

  useEffect(() => {
    if (abierto) {
      setExpresion(expresionSugerida || '')
      setFecha(new Date().toISOString().slice(0, 10))
      setNombreExperimento('')
    }
  }, [abierto, expresionSugerida])

  if (!abierto) return null

  const handleConfirmar = () => {
    if (!nombreExperimento.trim() || !expresion.trim()) return
    onConfirmar({ nombre_experimento: nombreExperimento, expresion_algebraica: expresion })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <h2 className="text-3xl font-black text-gray-900 mb-6">Destacar grafica</h2>

        <div className="flex gap-6">
          <div className="w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
            {previewImg
              ? <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
              : <span className="text-gray-300 text-xs">Sin vista previa</span>}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Nombre del experimento</label>
              <input
                type="text"
                value={nombreExperimento}
                onChange={(e) => setNombreExperimento(e.target.value)}
                placeholder="Nombre"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-rose-50/40
                           focus:outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Expresion algebraica</label>
              <input
                type="text"
                value={expresion}
                onChange={(e) => setExpresion(e.target.value)}
                placeholder="Expresión"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-rose-50/40
                           focus:outline-none focus:border-gray-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Fecha</label>
              <input
                type="date"
                value={fecha}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-rose-50/40 text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleConfirmar}
            disabled={cargando || !nombreExperimento.trim()}
            className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-opacity disabled:opacity-40 hover:opacity-90"
            style={{ backgroundColor: '#7a9bbf' }}
          >
            {cargando ? 'Guardando...' : 'Confirmar'}
          </button>
          <button
            onClick={onCerrar}
            className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#e08a8a' }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalDestacar
