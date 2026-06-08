import axios from 'axios';
import { mockTickets, mockMetricas, mockMetricasCalidad } from './mockData';

const USE_MOCK = false;
const URL_BACK = process.env.REACT_APP_API_URL || '/api';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  'ngrok-skip-browser-warning': 'true'
});

// ── TICKETS ──────────────────────────────────────────────────────
// Cuando USE_MOCK = false, los filtros se mandan al back como parámetros
// y él devuelve los tickets ya filtrados (el front no filtra nada)
export const getTickets = (filtros = {}) => {
  if (USE_MOCK) return Promise.resolve(mockTickets);

  const params = new URLSearchParams();
  if (filtros.estado && filtros.estado !== 'Todos')   params.append('estado', filtros.estado);
  if (filtros.prioridad && filtros.prioridad !== 'Todas') params.append('prioridad', filtros.prioridad);
  if (filtros.sistema && filtros.sistema !== 'Todos') params.append('sistema', filtros.sistema);
  if (filtros.desde)  params.append('desde', filtros.desde);
  if (filtros.hasta)  params.append('hasta', filtros.hasta);

  return axios.get(`${URL_BACK}/tickets?${params.toString()}`, { headers: getAuthHeaders() })
    .then(res => res.data);
};

// ── MÉTRICAS DASHBOARD ───────────────────────────────────────────
// Requiere endpoint GET /metricas en el back
// que devuelva: { ingresados, resueltos, noResueltos, escalados }
export const getMetricas = () => {
  if (USE_MOCK) return Promise.resolve(mockMetricas);
  return axios.get(`${URL_BACK}/metricas`, { headers: getAuthHeaders() })
    .then(res => res.data);
};

// ── MÉTRICAS DE CALIDAD ──────────────────────────────────────────
// Requiere endpoint GET /metricas/calidad en el back
// que devuelva: { fallasPorModulo, errorPorAgente }
export const getMetricasCalidad = () => {
  if (USE_MOCK) return Promise.resolve(mockMetricasCalidad);
  return axios.get(`${URL_BACK}/metricas/calidad`, { headers: getAuthHeaders() })
    .then(res => res.data);
};
