import Layout from '../components/layout/Layout'

const AcercaDePage = () => (
  <Layout subtitulo="Acerca de ARCEC-3D">
    <div className="border border-gray-300 rounded-xl p-8 bg-white max-w-3xl">
      <h2 className="text-2xl font-black text-gray-900 mb-4">ARCEC-3D</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Aplicación web para la consulta de resultados de algoritmos de programación genética
        en un servidor, desarrollada como proyecto de estadía para el Centro Nacional de
        Investigación y Desarrollo Tecnológico (CENIDET), Departamento de Ciencias Computacionales.
      </p>
      <p className="text-gray-700 leading-relaxed mb-6">
        La plataforma centraliza la interpretación visual de resultados de experimentos de
        cómputo evolutivo, transformando expresiones algebraicas provenientes de archivos CSV
        en superficies tridimensionales interactivas, sin necesidad de herramientas de escritorio
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
  </Layout>
)

export default AcercaDePage
