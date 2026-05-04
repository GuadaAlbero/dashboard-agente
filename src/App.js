import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Metricas from './pages/Metricas';

function RutaProtegida({ children }) {
  // const token = localStorage.getItem('token'); // descomentar cuando el back esté listo
  // ── CUANDO EL BACK ESTÉ LISTO ────────────────────────────────
  // Esta línea ya funciona sola — cuando el login guarde el token
  // en localStorage, esta ruta lo va a detectar automáticamente.
  // No hace falta cambiar nada acá.
  // ─────────────────────────────────────────────────────────────

  // Por ahora dejamos pasar siempre para poder desarrollar
  // Cuando el back esté listo, cambiar true por: !!token
  const estaAutenticado = true;

  return estaAutenticado ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RutaProtegida>
              <Dashboard />
            </RutaProtegida>
          }
        />
        <Route
          path="/metricas"
          element={
            <RutaProtegida>
              <Metricas />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;