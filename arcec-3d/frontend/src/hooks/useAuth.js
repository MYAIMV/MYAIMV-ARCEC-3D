import { useState } from 'react'
import api from '../services/api'

export const useAuth = () => {
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('usuario')
    return stored ? JSON.parse(stored) : null
  })
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState(null)

  const login = async (correo_institucional, contrasena) => {
    setCargando(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { correo_institucional, contrasena })
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      setUsuario(data.usuario)
      return true
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
      return false
    } finally {
      setCargando(false)
    }
  }

  const registro = async (nombre_completo, correo_institucional, contrasena) => {
    setCargando(true)
    setError(null)
    try {
      await api.post('/auth/registro', { nombre_completo, correo_institucional, contrasena })
      return true
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario')
      return false
    } finally {
      setCargando(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  return { usuario, cargando, error, login, registro, logout }
}
