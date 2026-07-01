import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute        from './components/ProtectedRoute'
import LandingPage           from './pages/LandingPage'
import LoginPage             from './pages/LoginPage'
import RegistroPage          from './pages/RegistroPage'
import DashboardPage         from './pages/DashboardPage'
import HistorialPage         from './pages/HistorialPage'
import FuncionDestacadaPage  from './pages/FuncionDestacadaPage'
import AcercaDePage          from './pages/AcercaDePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/registro"  element={<RegistroPage />} />

        <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/historial"   element={<ProtectedRoute><HistorialPage /></ProtectedRoute>} />
        <Route path="/destacadas"  element={<ProtectedRoute><FuncionDestacadaPage /></ProtectedRoute>} />
        <Route path="/acerca"      element={<ProtectedRoute><AcercaDePage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
