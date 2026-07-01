import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  const { login, cargando, error } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ correo_institucional: '', contrasena: '' })
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(form.correo_institucional, form.contrasena)
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: '#faf8f5' }}>
      <aside className="w-36 flex-shrink-0 flex flex-col items-center pt-6 gap-4"
             style={{ backgroundColor: '#c8d8b0' }}>
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-teal-700 leading-tight text-center">cenidet</div>
          <div className="text-[9px] text-gray-600 text-center leading-tight">
            Centro Nacional de Investigación<br/>y Desarrollo Tecnológico
          </div>
        </div>
        <div className="w-20 border-t border-gray-400/50"/>
        <div className="flex flex-col items-center">
          <div className="text-xs font-bold text-teal-800 leading-tight text-center">UTEZ</div>
          <div className="text-[8px] text-gray-600 text-center leading-tight mt-0.5">
            UNIVERSIDAD TECNOLÓGICA<br/>EMILIANO ZAPATA<br/>DEL ESTADO DE MORELOS
          </div>
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-2xl border border-gray-300 rounded-2xl p-10" style={{ backgroundColor: '#faf8f5' }}>
          <div className="rounded-2xl px-12 py-10" style={{ backgroundColor: '#c8d8b0' }}>

            <h1 className="text-5xl font-black text-gray-900 text-center tracking-tight mb-2">ARCEC-3D</h1>
            <h2 className="text-2xl font-normal text-gray-800 text-center mb-8">Portal de acceso</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-800 mb-1.5">Ingresa tu correo</label>
                <input
                  type="email" name="correo_institucional" value={form.correo_institucional}
                  onChange={handleChange} placeholder="correo" required
                  className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-400
                             rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm text-gray-800">Ingresa tu contraseña</label>
                  <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  type={mostrarPassword ? 'text' : 'password'} name="contrasena" value={form.contrasena}
                  onChange={handleChange} placeholder="contraseña" required
                  className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-400
                             rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-300 rounded-xl px-4 py-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="pt-4">
                <button type="submit" disabled={cargando}
                  className="w-full text-white font-bold rounded-2xl py-4 text-base transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: '#7a9bbf' }}>
                  {cargando ? 'Verificando...' : 'Ingresar al sistema'}
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-gray-700 mt-6">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="font-semibold underline hover:text-gray-900">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
