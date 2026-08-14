import { useState } from 'react'
import Layout from '../components/layout/Layout'

// Los dos manuales disponibles. El archivo debe existir en frontend/public/
const MANUALES = [
  {
    id: 'usuario',
    titulo: 'Manual de Usuario',
    descripcion: 'Formatos aceptados, funciones matemáticas soportadas y cómo generar una gráfica paso a paso.',
    archivo: '/ARCEC-3D_Manual_de_Usuario.pdf',
    nombreDescarga: 'ARCEC-3D_Manual_de_Usuario.pdf'
  },
  {
    id: 'tecnico',
    titulo: 'Manual Técnico',
    descripcion: 'Cómo agregar nuevas funciones matemáticas al sistema, reglas a seguir y verificación.',
    archivo: '/manual-tecnico.pdf',
    nombreDescarga: 'ARCEC-3D_Manual_Tecnico.pdf'
  }
]

const AcercaDePage = () => {
  const [manualActivo, setManualActivo] = useState('usuario')
  const manual = MANUALES.find(m => m.id === manualActivo)

  return (
    <Layout subtitulo="Acerca de ARCEC-3D">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Columna izquierda: información del proyecto ── */}
        <div className="border border-gray-300 rounded-xl p-8 bg-white">
          <h2 className="text-2xl font-black text-gray-900 mb-4">ARCEC-3D</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Aplicación web para la consulta de resultados de algoritmos de programación genética
            en un servidor, desarrollada como proyecto de estadía para el Centro Nacional de
            Investigación y Desarrollo Tecnológico (CENIDET), Departamento de Ciencias Computacionales.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            La plataforma centraliza la interpretación visual de resultados de experimentos de
            cómputo evolutivo, transformando expresiones algebraicas provenientes de archivos CSV,
            TXT o XLSX en gráficas 2D y 3D interactivas, sin necesidad de herramientas de escritorio
            como MATLAB o Python.
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#eef4e8' }}>
              <p className="font-bold text-gray-800 mb-1">Institución</p>
              <p className="text-gray-600">CENIDET · TecNM</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#eef4e8' }}>
              <p className="font-bold text-gray-800 mb-1">Departamento</p>
              <p className="text-gray-600">Ciencias Computacionales</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#eef4e8' }}>
              <p className="font-bold text-gray-800 mb-1">Stack tecnológico</p>
              <p className="text-gray-600">React · Node.js · MySQL · Three.js</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#eef4e8' }}>
              <p className="font-bold text-gray-800 mb-1">Presentado por</p>
              <p className="text-gray-600">Mitzi Yessenia Arrieta Ignacio</p>
            </div>
          </div>
        </div>

        {/* ── Columna derecha: manuales en pestañas ── */}
        <div className="border border-gray-300 rounded-xl p-6 bg-white flex flex-col">

          {/* Pestañas */}
          <div className="flex gap-2 mb-4">
            {MANUALES.map(m => {
              const activo = m.id === manualActivo
              return (
                <button
                  key={m.id}
                  onClick={() => setManualActivo(m.id)}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  style={{
                    backgroundColor: activo ? '#4a6741' : '#f1f1ec',
                    color: activo ? 'white' : '#555'
                  }}
                >
                  {m.titulo}
                </button>
              )
            })}
          </div>

          <div className="flex items-start justify-between gap-4 mb-3">
            <p className="text-sm text-gray-500 flex-1">{manual.descripcion}</p>
            <a
              href={manual.archivo}
              download={manual.nombreDescarga}
              className="px-4 py-2 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: '#7a9bbf' }}
            >
              Descargar
            </a>
          </div>

          {/* Visor embebido: el navegador muestra el PDF sin necesidad de descargarlo.
              La key fuerza a recargar el iframe al cambiar de pestaña. */}
          <div className="flex-1 rounded-lg overflow-hidden border border-gray-200" style={{ minHeight: '600px' }}>
            <iframe
              key={manual.id}
              src={manual.archivo}
              title={manual.titulo}
              className="w-full h-full"
              style={{ minHeight: '600px', border: 'none' }}
            />
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default AcercaDePage