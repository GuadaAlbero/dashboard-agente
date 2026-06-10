import axios from 'axios';
import { mockTickets, mockMetricas, mockMetricasCalidad } from './mockData';

const USE_MOCK = true; // ← cambiar a false cuando el back esté listo
const URL_BACK = process.env.REACT_APP_API_URL || '/api';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('accessToken')}`
});

const normalizarTexto = (valor) =>
  String(valor ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const esResuelto   = (t) => ['Resolved', 'Closed'].includes(t.stateLabel);
const esEscalado   = (t) => t.stateLabel === 'Escalado';
const esNoResuelto = (t) => !esEscalado(t) && ['New', 'In Progress', 'On Hold'].includes(t.stateLabel);

// ── TICKETS ──────────────────────────────────────────────────────
export const getTickets = (filtros = {}) => {
  if (USE_MOCK) {
    let resultado = [...mockTickets];

    // Filtro estado
    if (filtros.estado && filtros.estado !== 'Todos') {
      if      (filtros.estado === 'noResueltos') resultado = resultado.filter(esNoResuelto);
      else if (filtros.estado === 'resueltos')   resultado = resultado.filter(esResuelto);
      else if (filtros.estado === 'escalado')    resultado = resultado.filter(esEscalado);
      else resultado = resultado.filter(t => t.stateLabel === filtros.estado);
    }

    // Filtro prioridad
    if (filtros.prioridad && filtros.prioridad !== 'Todas') {
      resultado = resultado.filter(t => t.priorityLabel === filtros.prioridad);
    }

    // Filtro fecha desde
    if (filtros.desde) {
      resultado = resultado.filter(t => new Date(t.openedAt) >= new Date(filtros.desde));
    }

    // Filtro fecha hasta
    if (filtros.hasta) {
      resultado = resultado.filter(t => new Date(t.openedAt) <= new Date(filtros.hasta + 'T23:59:59'));
    }

    // Búsqueda por texto
    const ESTADO_ES = { 'New': 'Nuevo', 'In Progress': 'En progreso', 'On Hold': 'En espera', 'Resolved': 'Resuelto', 'Closed': 'Cerrado', 'Canceled': 'Cancelado', 'Escalado': 'Escalado' };
    const PRIORIDAD_ES = { 'High': 'Alta', 'Moderate': 'Moderada', 'Low': 'Baja' };

    if (filtros.busqueda && filtros.busqueda.trim()) {
      const query = normalizarTexto(filtros.busqueda);
      resultado = resultado.filter(t => {
        const texto = normalizarTexto([
          t.number, t.title, t.stateLabel, ESTADO_ES[t.stateLabel],
          t.priorityLabel, PRIORIDAD_ES[t.priorityLabel],
        ].filter(Boolean).join(' '));
        return texto.includes(query);
      });
    }

    return Promise.resolve(resultado);
  }

  const params = new URLSearchParams();
  if (filtros.estado    && filtros.estado    !== 'Todos')  params.append('estado',    filtros.estado.toLowerCase());
  if (filtros.prioridad && filtros.prioridad !== 'Todas')  params.append('prioridad', filtros.prioridad);
  if (filtros.desde)   params.append('desde',    filtros.desde);
  if (filtros.hasta)   params.append('hasta',    filtros.hasta);
  if (filtros.busqueda && filtros.busqueda.trim()) params.append('busqueda', filtros.busqueda.trim());

  return axios.get(`${URL_BACK}/tickets?${params.toString()}`, { headers: getAuthHeaders() })
    .then(res => res.data);
};

// ── MÉTRICAS DASHBOARD ───────────────────────────────────────────
export const getMetricas = () => {
  if (USE_MOCK) return Promise.resolve(mockMetricas);
  return axios.get(`${URL_BACK}/metricas`, { headers: getAuthHeaders() })
    .then(res => res.data);
};

// ── MÉTRICAS DE CALIDAD ──────────────────────────────────────────
export const getMetricasCalidad = () => {
  if (USE_MOCK) return Promise.resolve(mockMetricasCalidad);
  return axios.get(`${URL_BACK}/metricas/calidad`, { headers: getAuthHeaders() })
    .then(res => res.data);
};