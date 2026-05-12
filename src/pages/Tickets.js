import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
// import axios from 'axios'; // descomentar cuando el back esté listo

// ── DATOS HARDCODEADOS — BORRAR cuando el back esté listo ────────
const ticketsHardcodeados = [
  { id: 1, number: 'INC0000064', title: 'No puede reservar turno del martes', description: 'El usuario reporta que no puede reservar su turno habitual.', stateLabel: 'Resolved', priorityLabel: 'High', openedAt: '2026-05-01T10:00:00', updatedAt: '2026-05-01T12:00:00', resolvedAt: '2026-05-01T12:00:00' },
  { id: 2, number: 'INC0000063', title: 'No puede cancelar su clase de hoy', description: 'El usuario quiere cancelar pero el sistema no lo permite.', stateLabel: 'In Progress', priorityLabel: 'Critical', openedAt: '2026-05-02T09:00:00', updatedAt: '2026-05-02T11:00:00', resolvedAt: null },
  { id: 3, number: 'INC0000062', title: 'Su turno no aparece en el sistema', description: 'El turno reservado no figura en el calendario.', stateLabel: 'New', priorityLabel: 'Moderate', openedAt: '2026-05-03T08:00:00', updatedAt: '2026-05-03T08:30:00', resolvedAt: null },
  { id: 4, number: 'INC0000061', title: 'No recibió confirmación del turno', description: 'El usuario reservó pero no recibió mail de confirmación.', stateLabel: 'Resolved', priorityLabel: 'Low', openedAt: '2026-05-03T14:00:00', updatedAt: '2026-05-03T15:00:00', resolvedAt: '2026-05-03T15:00:00' },
  { id: 5, number: 'INC0000060', title: 'Quiere cambiar de profesora', description: 'El usuario solicita cambio de instructor para sus clases.', stateLabel: 'On Hold', priorityLabel: 'Moderate', openedAt: '2026-05-04T10:00:00', updatedAt: '2026-05-04T11:00:00', resolvedAt: null },
  { id: 6, number: 'INC0000059', title: 'Error al iniciar sesión', description: 'El usuario no puede acceder a su cuenta.', stateLabel: 'Closed', priorityLabel: 'High', openedAt: '2026-04-28T09:00:00', updatedAt: '2026-04-29T10:00:00', resolvedAt: '2026-04-29T10:00:00' },
  { id: 7, number: 'INC0000058', title: 'Pago rechazado', description: 'El cobro mensual fue rechazado por la pasarela.', stateLabel: 'In Progress', priorityLabel: 'Critical', openedAt: '2026-04-30T16:00:00', updatedAt: '2026-05-01T09:00:00', resolvedAt: null },
  { id: 8, number: 'INC0000057', title: 'No puede ver historial de clases', description: 'La sección de historial aparece vacía.', stateLabel: 'New', priorityLabel: 'Low', openedAt: '2026-05-05T11:00:00', updatedAt: '2026-05-05T11:00:00', resolvedAt: null },
];
// ── CUANDO EL BACK ESTÉ LISTO: ───────────────────────────────────
// 1. Borrar ticketsHardcodeados
// 2. Descomentar esto:
//
// const [tickets, setTickets] = useState([]);
//
// useEffect(() => {
//   const token = localStorage.getItem('accessToken');
//   axios.get(`${URL_BACK}/tickets`, {
//     headers: { Authorization: `Bearer ${token}` }
//   })
//   .then(res => setTickets(res.data))
//   .catch(err => console.error(err));
// }, []);
// ────────────────────────────────────────────────────────────────

const ESTADOS = ['Todos', 'New', 'In Progress', 'On Hold', 'Resolved', 'Closed', 'Canceled'];
const PRIORIDADES = ['Todas', 'Critical', 'High', 'Moderate', 'Low'];

const colorEstado = {
  'New': { bg: '#eff6ff', color: '#2563A8' },
  'In Progress': { bg: '#fff7ed', color: '#BA7517' },
  'On Hold': { bg: '#f5f3ff', color: '#7c3aed' },
  'Resolved': { bg: '#f0fdf4', color: '#1D9E75' },
  'Closed': { bg: '#f8fafc', color: '#64748b' },
  'Canceled': { bg: '#fef2f2', color: '#E24B4A' },
};

const colorPrioridad = {
  'Critical': { bg: '#fef2f2', color: '#E24B4A' },
  'High': { bg: '#fff7ed', color: '#BA7517' },
  'Moderate': { bg: '#eff6ff', color: '#2563A8' },
  'Low': { bg: '#f0fdf4', color: '#1D9E75' },
};

export default function Tickets() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [tickets] = useState(ticketsHardcodeados);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todas');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const limpiarFiltros = () => {
    setFiltroEstado('Todos');
    setFiltroPrioridad('Todas');
    setFiltroFechaDesde('');
    setFiltroFechaHasta('');
  };

  const ticketsFiltrados = tickets.filter(t => {
    if (filtroEstado !== 'Todos' && t.stateLabel !== filtroEstado) return false;
    if (filtroPrioridad !== 'Todas' && t.priorityLabel !== filtroPrioridad) return false;
    if (filtroFechaDesde && new Date(t.openedAt) < new Date(filtroFechaDesde)) return false;
    if (filtroFechaHasta && new Date(t.openedAt) > new Date(filtroFechaHasta + 'T23:59:59')) return false;
    return true;
  });

  const hayFiltrosActivos = filtroEstado !== 'Todos' || filtroPrioridad !== 'Todas' || filtroFechaDesde || filtroFechaHasta;

  return (
    <div style={styles.screen}>
      <Sidebar
        paginaActiva="tickets"
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
      />

      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.pageTitle}>Tickets</div>
        </div>

        <div style={{ ...styles.content, padding: isMobile ? '12px' : '20px 24px' }}>
          <div style={styles.filtrosCard}>
            <div style={{ ...styles.filtrosRow, flexDirection: isMobile ? 'column' : 'row' }}>

              <div style={styles.filtroGrupo}>
                <label style={styles.filtroLabel}>Estado</label>
                <select
                  style={styles.select}
                  value={filtroEstado}
                  onChange={e => setFiltroEstado(e.target.value)}
                >
                  {ESTADOS.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>

              <div style={styles.filtroGrupo}>
                <label style={styles.filtroLabel}>Prioridad</label>
                <select
                  style={styles.select}
                  value={filtroPrioridad}
                  onChange={e => setFiltroPrioridad(e.target.value)}
                >
                  {PRIORIDADES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div style={styles.filtroGrupo}>
                <label style={styles.filtroLabel}>Desde</label>
                <input
                  style={styles.inputFecha}
                  type="date"
                  value={filtroFechaDesde}
                  onChange={e => setFiltroFechaDesde(e.target.value)}
                />
              </div>

              <div style={styles.filtroGrupo}>
                <label style={styles.filtroLabel}>Hasta</label>
                <input
                  style={styles.inputFecha}
                  type="date"
                  value={filtroFechaHasta}
                  onChange={e => setFiltroFechaHasta(e.target.value)}
                />
              </div>

              {hayFiltrosActivos && (
                <button style={styles.btnLimpiar} onClick={limpiarFiltros}>
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          <div style={styles.tableCard}>
            <div style={styles.tableInfo}>
              Mostrando {ticketsFiltrados.length} de {tickets.length} tickets
            </div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Número</th>
                    <th style={styles.th}>Título</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Estado</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Prioridad</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Abierto</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Actualizado</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8', padding: '32px' }}>
                        No hay tickets que coincidan con los filtros.
                      </td>
                    </tr>
                  ) : (
                    ticketsFiltrados.map((ticket, index) => (
                      <tr key={ticket.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                        <td style={{ ...styles.td, fontWeight: '600', color: '#1A3A5C' }}>{ticket.number}</td>
                        <td style={styles.td}>{ticket.title}</td>
                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <span style={{
                            ...styles.badge,
                            background: colorEstado[ticket.stateLabel]?.bg || '#f8fafc',
                            color: colorEstado[ticket.stateLabel]?.color || '#64748b',
                          }}>
                            {ticket.stateLabel}
                          </span>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <span style={{
                            ...styles.badge,
                            background: colorPrioridad[ticket.priorityLabel]?.bg || '#f8fafc',
                            color: colorPrioridad[ticket.priorityLabel]?.color || '#64748b',
                          }}>
                            {ticket.priorityLabel}
                          </span>
                        </td>
                        <td style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                          {new Date(ticket.openedAt).toLocaleDateString('es-AR')}
                        </td>
                        <td style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                          {new Date(ticket.updatedAt).toLocaleDateString('es-AR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
    background: '#f1f5f9',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topbar: {
    padding: '14px 24px',
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
  },
  pageTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A3A5C',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  filtrosCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '16px 20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  filtrosRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  filtroGrupo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  filtroLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
  },
  select: {
    fontSize: '13px',
    padding: '7px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    color: '#1A3A5C',
    background: 'white',
    cursor: 'pointer',
  },
  inputFecha: {
    fontSize: '13px',
    padding: '7px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    color: '#1A3A5C',
  },
  btnLimpiar: {
    fontSize: '12px',
    padding: '7px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: 'white',
    color: '#E24B4A',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    alignSelf: 'flex-end',
  },
  tableCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  tableInfo: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '12px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    minWidth: '600px',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    padding: '10px 12px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748b',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #f1f5f9',
    color: '#1A3A5C',
  },
  trEven: {
    background: 'white',
  },
  trOdd: {
    background: '#f8fafc',
  },
  badge: {
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
};