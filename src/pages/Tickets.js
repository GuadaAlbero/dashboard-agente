import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
// import axios from 'axios'; // descomentar cuando el back esté listo

// ── DATOS HARDCODEADOS — BORRAR cuando el back esté listo ────────
const ticketsHardcodeados = [
  { id: 1, number: 'INC0000064', title: 'No puede reservar turno del martes', stateLabel: 'Resuelto', priorityLabel: 'Alto', openedAt: '2026-05-01T10:00:00', updatedAt: '2026-05-01T12:00:00' },
  { id: 2, number: 'INC0000063', title: 'No puede cancelar su clase de hoy', stateLabel: 'En progreso', priorityLabel: 'Crítico', openedAt: '2026-05-02T09:00:00', updatedAt: '2026-05-02T11:00:00' },
  { id: 3, number: 'INC0000062', title: 'Su turno no aparece en el sistema', stateLabel: 'Nuevo', priorityLabel: 'Moderado', openedAt: '2026-05-03T08:00:00', updatedAt: '2026-05-03T08:30:00' },
  { id: 4, number: 'INC0000061', title: 'No recibió confirmación del turno', stateLabel: 'Resuelto', priorityLabel: 'Bajo', openedAt: '2026-05-03T14:00:00', updatedAt: '2026-05-03T15:00:00' },
  { id: 5, number: 'INC0000060', title: 'Quiere cambiar de profesora', stateLabel: 'En espera', priorityLabel: 'Moderado', openedAt: '2026-05-04T10:00:00', updatedAt: '2026-05-04T11:00:00' },
  { id: 6, number: 'INC0000059', title: 'Error al iniciar sesión', stateLabel: 'Cerrado', priorityLabel: 'Alto', openedAt: '2026-04-28T09:00:00', updatedAt: '2026-04-29T10:00:00' },
  { id: 7, number: 'INC0000058', title: 'Pago rechazado', stateLabel: 'En progreso', priorityLabel: 'Crítico', openedAt: '2026-04-30T16:00:00', updatedAt: '2026-05-01T09:00:00' },
  { id: 8, number: 'INC0000057', title: 'No puede ver historial de clases', stateLabel: 'Nuevo', priorityLabel: 'Bajo', openedAt: '2026-05-05T11:00:00', updatedAt: '2026-05-05T11:00:00' },
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

const ESTADOS = ['Todos', 'Nuevo', 'En progreso', 'En espera', 'Resuelto', 'Cerrado', 'Cancelado'];
const PRIORIDADES = ['Todas', 'Crítico', 'Alto', 'Moderado', 'Bajo'];

const pesoPrioridad = { 'Crítico': 1, 'Alto': 2, 'Moderado': 3, 'Bajo': 4 };
const pesoEstado = { 'Nuevo': 1, 'En progreso': 2, 'En espera': 3, 'Resuelto': 4, 'Cerrado': 5, 'Cancelado': 6 };

const colorEstado = {
  'Nuevo': { bg: '#eff6ff', color: '#2563A8' },
  'En progreso': { bg: '#fff7ed', color: '#BA7517' },
  'En espera': { bg: '#f5f3ff', color: '#7c3aed' },
  'Resuelto': { bg: '#f0fdf4', color: '#1D9E75' },
  'Cerrado': { bg: '#f8fafc', color: '#64748b' },
  'Cancelado': { bg: '#fef2f2', color: '#E24B4A' },
};

const colorPrioridad = {
  'Crítico': { bg: '#fef2f2', color: '#E24B4A' },
  'Alto': { bg: '#fff7ed', color: '#BA7517' },
  'Moderado': { bg: '#eff6ff', color: '#2563A8' },
  'Bajo': { bg: '#f0fdf4', color: '#1D9E75' },
};

export default function Tickets() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [tickets] = useState(ticketsHardcodeados);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todas');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  const [orden, setOrden] = useState({ columna: 'openedAt', direccion: 'desc' });
  const [filaExpandida, setFilaExpandida] = useState(null);
  const [bottomSheetAbierto, setBottomSheetAbierto] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const estado = params.get('estado');
    if (estado === 'noResueltos') {
      setFiltroEstado('noResueltos');
    } else if (estado) {
      setFiltroEstado(estado);
    }
  }, [location.search]);

  const limpiarFiltros = () => {
    setFiltroEstado('Todos');
    setFiltroPrioridad('Todas');
    setFiltroFechaDesde('');
    setFiltroFechaHasta('');
  };

  const toggleOrden = (columna) => {
    setOrden(prev =>
      prev.columna === columna
        ? { columna, direccion: prev.direccion === 'asc' ? 'desc' : 'asc' }
        : { columna, direccion: 'asc' }
    );
  };

  const flechaOrden = (columna) => {
    if (orden.columna !== columna) return ' ↕';
    return orden.direccion === 'asc' ? ' ↑' : ' ↓';
  };

  const toggleFila = (id) => {
    setFilaExpandida(prev => prev === id ? null : id);
  };

  const ticketsFiltrados = tickets
    .filter(t => {
      if (filtroEstado === 'noResueltos') {
        if (!['Nuevo', 'En progreso', 'En espera'].includes(t.stateLabel)) return false;
      } else if (filtroEstado !== 'Todos' && t.stateLabel !== filtroEstado) {
        return false;
      }
      if (filtroPrioridad !== 'Todas' && t.priorityLabel !== filtroPrioridad) return false;
      if (filtroFechaDesde && new Date(t.openedAt) < new Date(filtroFechaDesde)) return false;
      if (filtroFechaHasta && new Date(t.openedAt) > new Date(filtroFechaHasta + 'T23:59:59')) return false;
      return true;
    })
    .sort((a, b) => {
      const { columna, direccion } = orden;
      let valA, valB;
      if (columna === 'priorityLabel') {
        valA = pesoPrioridad[a.priorityLabel] ?? 99;
        valB = pesoPrioridad[b.priorityLabel] ?? 99;
      } else if (columna === 'stateLabel') {
        valA = pesoEstado[a.stateLabel] ?? 99;
        valB = pesoEstado[b.stateLabel] ?? 99;
      } else if (columna === 'openedAt' || columna === 'updatedAt') {
        valA = new Date(a[columna]);
        valB = new Date(b[columna]);
      } else {
        valA = a[columna]?.toLowerCase?.() ?? '';
        valB = b[columna]?.toLowerCase?.() ?? '';
      }
      if (valA < valB) return direccion === 'asc' ? -1 : 1;
      if (valA > valB) return direccion === 'asc' ? 1 : -1;
      return 0;
    });

  const hayFiltrosActivos = filtroEstado !== 'Todos' || filtroPrioridad !== 'Todas' || filtroFechaDesde || filtroFechaHasta;
  const labelFiltroEstado = filtroEstado === 'noResueltos' ? 'No resueltos' : filtroEstado;
  const cantFiltrosActivos = [filtroEstado !== 'Todos', filtroPrioridad !== 'Todas', !!filtroFechaDesde, !!filtroFechaHasta].filter(Boolean).length;

  const filtrosJSX = (
    <>
      <div style={styles.filtroGrupo}>
        <label style={styles.filtroLabel}>Estado</label>
        <select style={styles.select} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          {ESTADOS.map(e => <option key={e}>{e}</option>)}
          <option value="noResueltos">No resueltos</option>
        </select>
      </div>
      <div style={styles.filtroGrupo}>
        <label style={styles.filtroLabel}>Prioridad</label>
        <select style={styles.select} value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)}>
          {PRIORIDADES.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div style={styles.filtroGrupo}>
        <label style={styles.filtroLabel}>Desde</label>
        <input style={styles.inputFecha} type="date" value={filtroFechaDesde} onChange={e => setFiltroFechaDesde(e.target.value)} />
      </div>
      <div style={styles.filtroGrupo}>
        <label style={styles.filtroLabel}>Hasta</label>
        <input style={styles.inputFecha} type="date" value={filtroFechaHasta} onChange={e => setFiltroFechaHasta(e.target.value)} />
      </div>
      {hayFiltrosActivos && (
        <button style={styles.btnLimpiar} onClick={limpiarFiltros}>Limpiar filtros</button>
      )}
    </>
  );

  const tdPadding = isMobile ? '6px 6px' : '10px 12px';

  return (
    <div style={styles.screen}>
      <Sidebar
        paginaActiva="tickets"
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
      />

      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.pageTitle}>Incidentes</div>
          {isMobile && (
            <button style={styles.btnFiltrosMobile} onClick={() => setBottomSheetAbierto(true)}>
               Filtros {cantFiltrosActivos > 0 && <span style={styles.badgeFiltros}>{cantFiltrosActivos}</span>}
            </button>
          )}
        </div>

        <div style={{ ...styles.content, padding: isMobile ? '12px' : '20px 24px' }}>
          {!isMobile && (
            <div style={styles.filtrosCard}>
              <div style={{ ...styles.filtrosRow, flexDirection: 'row' }}>
                {filtrosJSX}
              </div>
            </div>
          )}

          <div style={styles.tableCard}>
            <div style={styles.tableInfo}>
              Mostrando {ticketsFiltrados.length} de {tickets.length} incidentes
              {filtroEstado !== 'Todos' && <span style={{ color: '#2563A8', marginLeft: '8px' }}>— {labelFiltroEstado}</span>}
            </div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {isMobile && <th style={{ ...styles.th, width: '20px', padding: '6px 4px' }}></th>}
                    <th style={{ ...styles.th, cursor: 'pointer', padding: tdPadding }} onClick={() => toggleOrden('number')}>
                      Número{flechaOrden('number')}
                    </th>
                    <th style={{ ...styles.th, cursor: 'pointer', padding: tdPadding }} onClick={() => toggleOrden('title')}>
                      Título{flechaOrden('title')}
                    </th>
                    <th style={{ ...styles.th, textAlign: 'center', cursor: 'pointer', padding: tdPadding }} onClick={() => toggleOrden('stateLabel')}>
                      Estado{flechaOrden('stateLabel')}
                    </th>
                    <th style={{ ...styles.th, textAlign: 'center', cursor: 'pointer', padding: tdPadding }} onClick={() => toggleOrden('priorityLabel')}>
                      Prioridad{flechaOrden('priorityLabel')}
                    </th>
                    {!isMobile && (
                      <>
                        <th style={{ ...styles.th, textAlign: 'center', cursor: 'pointer' }} onClick={() => toggleOrden('openedAt')}>
                          Abierto{flechaOrden('openedAt')}
                        </th>
                        <th style={{ ...styles.th, textAlign: 'center', cursor: 'pointer' }} onClick={() => toggleOrden('updatedAt')}>
                          Actualizado{flechaOrden('updatedAt')}
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {ticketsFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={isMobile ? 5 : 6} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8', padding: '32px' }}>
                        No hay incidentes que coincidan con los filtros.
                      </td>
                    </tr>
                  ) : (
                    ticketsFiltrados.map((ticket, index) => (
                      <>
                        <tr
                          key={ticket.id}
                          style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                          onClick={() => isMobile && toggleFila(ticket.id)}
                        >
                          {isMobile && (
                            <td style={{ ...styles.td, width: '20px', padding: '6px 4px', color: '#94a3b8', fontSize: '9px' }}>
                              {filaExpandida === ticket.id ? '▲' : '▼'}
                            </td>
                          )}
                          <td style={{ ...styles.td, padding: tdPadding, fontWeight: '600' }}>
                            {isMobile
                              ? <span style={{ fontSize: '11px', color: '#94a3b8' }}>#{ticket.number.slice(-5)}</span>
                              : <span style={{ color: '#1A3A5C' }}>{ticket.number}</span>
                            }
                          </td>
                          <td style={{ ...styles.td, padding: tdPadding, fontSize: isMobile ? '12px' : '13px' }}>{ticket.title}</td>
                          <td style={{ ...styles.td, padding: tdPadding, textAlign: 'center' }}>
                            <span style={{
                              ...styles.badge,
                              fontSize: isMobile ? '10px' : '11px',
                              padding: isMobile ? '2px 6px' : '3px 10px',
                              background: colorEstado[ticket.stateLabel]?.bg || '#f8fafc',
                              color: colorEstado[ticket.stateLabel]?.color || '#64748b'
                            }}>
                              {ticket.stateLabel}
                            </span>
                          </td>
                          <td style={{ ...styles.td, padding: tdPadding, textAlign: 'center' }}>
                            <span style={{
                              ...styles.badge,
                              fontSize: isMobile ? '10px' : '11px',
                              padding: isMobile ? '2px 6px' : '3px 10px',
                              background: colorPrioridad[ticket.priorityLabel]?.bg || '#f8fafc',
                              color: colorPrioridad[ticket.priorityLabel]?.color || '#64748b'
                            }}>
                              {ticket.priorityLabel}
                            </span>
                          </td>
                          {!isMobile && (
                            <>
                              <td style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                                {new Date(ticket.openedAt).toLocaleDateString('es-AR')}
                              </td>
                              <td style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                                {new Date(ticket.updatedAt).toLocaleDateString('es-AR')}
                              </td>
                            </>
                          )}
                        </tr>
                        {isMobile && filaExpandida === ticket.id && (
                          <tr key={`${ticket.id}-detalle`} style={{ background: '#f8fafc' }}>
                            <td colSpan={5} style={{ padding: '6px 12px 10px 30px' }}>
                              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span><strong>Abierto:</strong> {new Date(ticket.openedAt).toLocaleDateString('es-AR')}</span>
                                <span><strong>Actualizado:</strong> {new Date(ticket.updatedAt).toLocaleDateString('es-AR')}</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isMobile && (
        <>
          {bottomSheetAbierto && (
            <div style={styles.overlay} onClick={() => setBottomSheetAbierto(false)} />
          )}
          <div style={{
            ...styles.bottomSheet,
            transform: bottomSheetAbierto ? 'translateY(0)' : 'translateY(100%)',
          }}>
            <div style={styles.bottomSheetHandle} />
            <div style={styles.bottomSheetHeader}>
              <span style={styles.bottomSheetTitle}>Filtros</span>
              <button style={styles.btnCerrarSheet} onClick={() => setBottomSheetAbierto(false)}>✕</button>
            </div>
            <div style={styles.bottomSheetBody}>
              {filtrosJSX}
            </div>
            <button style={styles.btnAplicar} onClick={() => setBottomSheetAbierto(false)}>
              Ver {ticketsFiltrados.length} incidentes
            </button>
          </div>
        </>
      )}
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1A3A5C',
  },
  btnFiltrosMobile: {
    fontSize: '13px',
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: 'white',
    color: '#1A3A5C',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  badgeFiltros: {
    background: '#2563A8',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
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
    userSelect: 'none',
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
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    zIndex: 200,
  },
  bottomSheet: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    borderRadius: '16px 16px 0 0',
    padding: '0 20px 32px',
    zIndex: 201,
    transition: 'transform 0.3s ease',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.12)',
  },
  bottomSheetHandle: {
    width: '40px',
    height: '4px',
    background: '#e2e8f0',
    borderRadius: '2px',
    margin: '12px auto 0',
  },
  bottomSheetHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0 12px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '16px',
  },
  bottomSheetTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1A3A5C',
  },
  btnCerrarSheet: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#64748b',
  },
  bottomSheetBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  btnAplicar: {
    width: '100%',
    padding: '12px',
    background: '#1A3A5C',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    marginTop: '20px',
  },
};