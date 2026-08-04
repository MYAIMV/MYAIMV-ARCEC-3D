import Layout from '../components/layout/Layout'

const AcercaDePage = () => (
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

      {/* ── Columna derecha: manual de usuario, visible para leer ── */}
      <div className="border border-gray-300 rounded-xl p-6 bg-white flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">Manual de Usuario</h2>
          <a
            href="/ARCEC-3D_Manual_de_Usuario.pdf"
            download="ARCEC-3D_Manual_de_Usuario.pdf"
            className="px-4 py-2 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#7a9bbf' }}
          >
            Descargar
          </a>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Formatos aceptados, funciones matemáticas soportadas y cómo generar una gráfica paso a paso.
        </p>

        {/* Visor embebido: el navegador muestra el PDF directamente, sin descargarlo */}
        <div className="flex-1 rounded-lg overflow-hidden border border-gray-200" style={{ minHeight: '600px' }}>
          <iframe
            src="/ARCEC-3D_Manual_de_Usuario.pdf"
            title="Manual de Usuario ARCEC-3D"
            className="w-full h-full"
            style={{ minHeight: '600px', border: 'none' }}
          />
        </div>
      </div>

    </div>
  </Layout>
)

export default AcercaDePage