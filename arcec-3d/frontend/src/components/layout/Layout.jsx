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

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: '#faf8f5' }}>

      <aside className="w-36 flex-shrink-0 flex flex-col items-center pt-6 pb-6"
             style={{ backgroundColor: '#c8d8b0' }}>

        <div className="flex flex-col items-center mb-3">
          <span className="text-xs font-bold text-teal-700 leading-tight text-center">cenidet</span>
          <span className="text-[8px] text-gray-600 text-center leading-tight">
            Centro Nacional de Investigación<br/>y Desarrollo Tecnológico
          </span>
        </div>
        <div className="w-20 border-t border-gray-400/50 mb-3"/>
        <div className="flex flex-col items-center mb-8">
          <span className="text-xs font-bold text-teal-800 leading-tight text-center">UTEZ</span>
          <span className="text-[8px] text-gray-600 text-center leading-tight mt-0.5">
            UNIVERSIDAD TECNOLÓGICA<br/>EMILIANO ZAPATA<br/>DEL ESTADO DE MORELOS
          </span>
        </div>

        <nav className="flex flex-col items-center gap-3 w-full px-4 flex-1">
          {NAV_ITEMS.map(({ label, path }) => {
            const activo = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="w-full text-center text-sm font-semibold text-gray-800
                           rounded-lg py-2 px-2 transition-all whitespace-pre-line
                           hover:bg-white/40"
                style={{
                  border: activo ? '2px solid #4a6741' : '2px solid #a0b890',
                  backgroundColor: activo ? 'rgba(255,255,255,0.35)' : 'transparent',
                }}
              >
                {label}
              </button>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full mx-4 text-center text-sm font-semibold text-gray-800
                     rounded-lg py-2 px-2 mt-4 hover:bg-white/40 transition-all"
          style={{ border: '2px solid #a0b890' }}
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
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
