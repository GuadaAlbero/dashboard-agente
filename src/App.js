import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Metricas from './pages/Metricas';

function RutaProtegida({ children }) {
  const token = localStorage.getItem('accessToken');
  const estaAutenticado = !!token;
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