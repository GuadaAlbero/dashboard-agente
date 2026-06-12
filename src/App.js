import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Metricas from './pages/Metricas';
import Tickets from './pages/Tickets';

function InterceptorAxios() {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userEmail');
          navigate('/login');
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  return null;
}

function RutaProtegida({ children }) {
  const token = localStorage.getItem('accessToken');
  const estaAutenticado = !!token;
  return estaAutenticado ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <InterceptorAxios />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/metricas" element={<RutaProtegida><Metricas /></RutaProtegida>} />
        <Route path="/tickets" element={<RutaProtegida><Tickets /></RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;