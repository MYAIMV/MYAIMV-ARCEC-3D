import { useState } from 'react'

// Modal fiel al prototipo (página 4): nombre del archivo + formato
const ModalDescargar = ({ abierto, onCerrar, onConfirmar, previewImg }) => {
  const [nombre, setNombre]   = useState('grafica_arcec3d')
  const [formato, setFormato] = useState('')

  if (!abierto) return null

  const handleConfirmar = () => {
    if (!formato) return
    onConfirmar({ nombre, formato })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <h2 className="text-3xl font-black text-gray-900 mb-6">Descargar grafica</h2>

        <div className="flex gap-6">
          {/* Preview */}
          <div className="w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
            {previewImg
              ? <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
              : <span className="text-gray-300 text-xs">Sin vista previa</span>}
          </div>

          {/* Formulario */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Nombre del Archivo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-rose-50/40
                           focus:outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Formato</label>
              <select
                value={formato}
                onChange={(e) => setFormato(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white
                           focus:outline-none focus:border-gray-500"
              >
                <option value="">Selecciona la opcion</option>
                <option value="PNG">PNG</option>
                <option value="SVG">SVG</option>
                <option value="PDF">PDF</option>
                <option value="JPEG">JPEG</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleConfirmar}
            disabled={!formato}
            className="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-opacity disabled:opacity-40 hover:opacity-90"
            style={{ backgroundColor: '#7a9bbf' }}
          >
            Confirmar
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

export default ModalDescargar