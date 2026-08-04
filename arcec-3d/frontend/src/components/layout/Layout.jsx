import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NAV_ITEMS = [
  { label: 'Graficar',           path: '/dashboard'  },
  { label: 'Historial',          path: '/historial'  },
  { label: 'Función\ndestacada', path: '/destacadas' },
  { label: 'Acerca de',          path: '/acerca'     },
]

const Layout = ({ children, subtitulo }) => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const claseBoton = () => `
    w-full text-center text-sm font-semibold text-gray-800
    rounded-lg py-2 px-2 transition-all whitespace-pre-line hover:bg-white/40
  `

  return (
    <div className="flex h-screen overflow-hidden font-sans" style={{ backgroundColor: '#faf8f5' }}>

      <aside className="w-36 flex-shrink-0 flex flex-col items-center pt-6 pb-6"
             style={{ backgroundColor: '#c8d8b0' }}>
        {/* Logo + nombre CENIDET */}
          <img src="/logo-cenidet.png" alt="Logo CENIDET" className="w-18 h-18 object-contain mb-1" />
        {/* Logo + nombre UTEZ */}
          <img src="/logo-utez.png" alt="Logo UTEZ" className="w-18 h-18 object-contain mb-1" />


        {/* flex-1 + justify-center: empuja los botones hacia el espacio restante y los
            centra verticalmente ahí, en vez de quedar pegados justo debajo de los logos */}
        <div className="flex-1 flex flex-col justify-center w-full">
          <nav className="flex flex-col items-center gap-3 w-full px-4">
          {NAV_ITEMS.map(({ label, path }) => {
            const activo = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={claseBoton()}
                style={{
                  border: activo ? '2px solid #4a6741' : '2px solid #a0b890',
                  backgroundColor: activo ? 'rgba(255,255,255,0.35)' : 'transparent',
                }}
              >
                {label}
              </button>
            )
          })}

          <button
            onClick={handleLogout}
            className={claseBoton()}
            style={{ border: '2px solid #a0b890' }}
          >
            Cerrar sesión
          </button>
        </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="px-8 pt-6 pb-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
            ARCEC-3D
          </h1>
          {subtitulo && (
            <p className="text-base font-bold text-gray-700 mt-1">{subtitulo}</p>
          )}
        </header>

        <div className="flex-1 px-8 py-4">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout