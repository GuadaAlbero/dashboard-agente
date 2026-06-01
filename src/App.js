import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Metricas from './pages/Metricas';
import Tickets from './pages/Tickets';

function RutaProtegida({ children }) {
  const token = localStorage.getItem('accessToken');
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
        <Route
          path="/tickets"
          element={
            <RutaProtegida>
              <Tickets />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;