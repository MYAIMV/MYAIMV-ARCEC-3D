import { useNavigate } from 'react-router-dom'

const SuperficiePreview = () => (
  <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg"
       className="h-full w-auto max-w-full" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="surfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#5bc8c0" />
        <stop offset="40%"  stopColor="#a8d8a8" />
        <stop offset="70%"  stopColor="#e8e840" />
        <stop offset="100%" stopColor="#f0c040" />
      </linearGradient>
    </defs>
    <line x1="80" y1="300" x2="560" y2="300" stroke="#555" strokeWidth="1.5"/>
    <line x1="80" y1="300" x2="80"  y2="40"  stroke="#555" strokeWidth="1.5"/>
    <line x1="80" y1="300" x2="20"  y2="340" stroke="#555" strokeWidth="1.5"/>
    <text x="565" y="304" fontSize="13" fill="#555">X</text>
    <text x="75"  y="35"  fontSize="13" fill="#555">Z</text>
    <text x="8"   y="348" fontSize="13" fill="#555">Y</text>
    <text x="58" y="80"  fontSize="11" fill="#666">5</text>
    <text x="58" y="175" fontSize="11" fill="#666">0</text>
    <text x="52" y="245" fontSize="11" fill="#666">-5</text>
    <text x="46" y="295" fontSize="11" fill="#666">-10</text>
    {[0,1,2,3,4,5,6,7,8].map(i => {
      const y = 50 + i * 28
      const amp = Math.sin(i * 0.7) * 60 + Math.cos(i * 0.4) * 30
      return (
        <path key={`h${i}`}
          d={`M 100 ${y + amp * 0.3} Q 200 ${y - amp * 0.8} 300 ${y + amp * 0.5} Q 420 ${y - amp * 0.6} 520 ${y + amp * 0.2}`}
          fill="none" stroke="url(#surfGrad)" strokeWidth="1.2" opacity="0.8"/>
      )
    })}
    {[0,1,2,3,4,5,6,7,8,9].map(i => {
      const x = 100 + i * 46
      return (
        <path key={`v${i}`}
          d={`M ${x} ${50 + Math.sin(i*0.5)*40} Q ${x + 10} ${150 + Math.cos(i*0.8)*50} ${x} ${250 + Math.sin(i*0.6)*30} Q ${x - 5} ${280} ${x} 300`}
          fill="none" stroke="url(#surfGrad)" strokeWidth="1" opacity="0.7"/>
      )
    })}
  </svg>
)

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    // h-screen + overflow-hidden en vez de min-h-screen: la pantalla nunca
    // crece más que el alto visible, todo lo de adentro se ajusta para caber.
    <div className="flex h-screen overflow-hidden bg-white font-sans">
      <aside className="w-36 flex-shrink-0 h-screen flex flex-col items-center justify-center pt-4 gap-3"
             style={{ backgroundColor: '#c8d8b0' }}>
        <div className="flex flex-col items-center">
        {/* Logo + nombre CENIDET */}
          <img src="/logo-cenidet.png" alt="Logo CENIDET" className="w-18 h-18 object-contain mb-1" />
        {/* Logo + nombre UTEZ */}
          <img src="/logo-utez.png" alt="Logo UTEZ" className="w-18 h-18 object-contain mb-1" />
        </div>
      </aside>

      {/* main: flex-col con overflow-hidden, así el contenido nunca se sale de la pantalla */}
      <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#faf8f5' }}>
        <header className="flex-shrink-0 flex items-center justify-between px-8 py-3.5 bg-white border border-gray-200 rounded-xl mx-5 mt-4 shadow-sm">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">ARCEC-3D</h1>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#7a9bbf' }}
          >
            Iniciar sesion
          </button>
        </header>

        {/* flex-1 min-h-0: toma el espacio restante SIN desbordar; el SVG de adentro
            se encoge automáticamente para caber (h-full en el svg + este contenedor) */}
        <section className="flex-1 min-h-0 flex flex-col px-8 py-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex-1 min-h-0 flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 leading-snug mb-1.5">
              Visualización interactiva de superficies algebraicas tridimensionales
            </h2>
            <p className="text-gray-500 text-sm mb-3">
              Tus datos algorítmicos, transformados en geometría interactiva al instante
            </p>
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <SuperficiePreview />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage