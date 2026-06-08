import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getTickets } from '../services/api';

const ESTADO_LABEL_ES = {
  'New': 'Nuevo', 'In Progress': 'En progreso', 'On Hold': 'En espera',
  'Resolved': 'Resuelto', 'Closed': 'Cerrado', 'Canceled': 'Cancelado',
};

const PRIORIDAD_LABEL_ES = {
  'Critical': 'Crítico', 'High': 'Alto', 'Moderate': 'Moderado', 'Low': 'Bajo',
};

const SISTEMA_LABEL_ES = {
  acceso: 'Acceso',
  socios: 'Socios',
  turnos: 'Turnos',
  profesores: 'Profesores',
  pagos: 'Pagos',
  disponibilidad: 'Disponibilidad',
  clases: 'Clases',
  turnera: 'Turnos',
  usuarios: 'Acceso',
  'sin clasificar': 'Sin clasificar',
};

const inferirSistemaPorTexto = (ticket) => {
  const texto = normalizarTexto(`${ticket?.title ?? ''} ${ticket?.description ?? ''}`);
  if (/(credencial|login|logue|sesion|contrasena|password|acceso)/.test(texto)) return 'acceso';
  if (/(pago|pague|abone|credito|creditos|me dieron|me cargaron|menos clases|tarjeta|debito|cobro|cargo)/.test(texto)) return 'pagos';
  if (/(profesor|instructor)/.test(texto)) return 'profesores';
  if (/(cupo|cupos|completo|disponibilidad|lugares)/.test(texto)) return 'disponibilidad';
  if (/(turno|turnos|reserva|reservas|turnera)/.test(texto)) return 'turnos';
  if (/(clase|clases|horario|agenda|calendario)/.test(texto)) return 'clases';
  if (/(socio|perfil|registrado)/.test(texto)) return 'socios';
  return '';
};

const normalizarSistema = (valor, ticket = null) => {
  const sistema = normalizarTexto(valor);
  if (sistema === 'turnera' || sistema === 'usuarios' || sistema === 'usuario') {
    return inferirSistemaPorTexto(ticket) || (sistema === 'turnera' ? 'turnos' : 'acceso');
  }
  return sistema;
};

const esResuelto   = (t) => ['Resolved', 'Closed'].includes(t.stateLabel);
const esEscalado   = (t) => t.assignmentGroup === 'Soporte Nivel 2';
const esNoResuelto = (t) => !esEscalado(t) && ['New', 'In Progress', 'On Hold'].includes(t.stateLabel);

const pesoPrioridad = { 'Critical': 1, 'High': 2, 'Moderate': 3, 'Low': 4 };
const pesoEstado    = { 'New': 1, 'In Progress': 2, 'On Hold': 3, 'Resolved': 4, 'Closed': 5, 'Canceled': 6, 'Escalado': 7 };

const colorEstado = {
  'New':         { bg: '#eff6ff', color: '#2563A8' },
  'In Progress': { bg: '#fff7ed', color: '#BA7517' },
  'On Hold':     { bg: '#f5f3ff', color: '#7c3aed' },
  'Resolved':    { bg: '#f0fdf4', color: '#1D9E75' },
  'Closed':      { bg: '#f8fafc', color: '#64748b' },
  'Canceled':    { bg: '#f8fafc', color: '#94a3b8' },
  'Escalado':    { bg: '#fef2f2', color: '#E24B4A' },
};

const colorPrioridad = {
  'Critical': { bg: '#fef2f2', color: '#E24B4A' },
  'High':     { bg: '#fff7ed', color: '#BA7517' },
  'Moderate': { bg: '#eff6ff', color: '#2563A8' },
  'Low':      { bg: '#f0fdf4', color: '#1D9E75' },
};

const normalizarTexto = (valor) =>
  String(valor ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function Tickets() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [tickets, setTickets] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todas');
  const [filtroSistema, setFiltroSistema] = useState('Todos');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  const [busqueda, setBusqueda] = useState('');
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
    const sistema = params.get('sistema');
    if (estado) setFiltroEstado(estado);
    if (sistema) setFiltroSistema(sistema);
  }, [location.search]);

  useEffect(() => {
    const fetchTickets = () => {
      getTickets()
        .then(data => setTickets(data))
        .catch(err => console.error(err));
    };
    fetchTickets();
    const intervalo = setInterval(fetchTickets, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const limpiarFiltros = () => {
    setFiltroEstado('Todos');
    setFiltroPrioridad('Todas');
    setFiltroSistema('Todos');
    setFiltroFechaDesde('');
    setFiltroFechaHasta('');
    setBusqueda('');
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

  const toggleFila = (id) => setFilaExpandida(prev => prev === id ? null : id);

  const estadoVisible = (ticket) => esEscalado(ticket) ? 'Escalado' : ticket.stateLabel;

  const ticketsFiltrados = tickets
    .filter(t => {
      if      (filtroEstado === 'noResueltos') { if (!esNoResuelto(t)) return false; }
      else if (filtroEstado === 'resueltos')   { if (!esResuelto(t))   return false; }
      else if (filtroEstado === 'escalado')    { if (!esEscalado(t))   return false; }
      else if (filtroEstado !== 'Todos')       { if (t.stateLabel !== filtroEstado) return false; }
      if (filtroPrioridad !== 'Todas' && t.priorityLabel !== filtroPrioridad) return false;
      if (filtroSistema !== 'Todos' && normalizarSistema(t.affectedSystem, t) !== filtroSistema) return false;
      if (filtroFechaDesde && new Date(t.openedAt) < new Date(filtroFechaDesde)) return false;
      if (filtroFechaHasta && new Date(t.openedAt) > new Date(filtroFechaHasta + 'T23:59:59')) return false;
      if (busqueda.trim()) {
        const query = normalizarTexto(busqueda);
        const textoTicket = normalizarTexto([
          t.number,
          t.title,
          t.description,
          t.stateLabel,
          ESTADO_LABEL_ES[t.stateLabel],
          t.priorityLabel,
          PRIORIDAD_LABEL_ES[t.priorityLabel],
          normalizarSistema(t.affectedSystem, t),
          SISTEMA_LABEL_ES[normalizarSistema(t.affectedSystem, t)],
          t.assignmentGroup,
          t.createdByName,
          t.createdByEmail,
          t.sysId,
        ].filter(Boolean).join(' '));

        if (!textoTicket.includes(query)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const { columna, direccion } = orden;
      let valA, valB;
      if (columna === 'priorityLabel') { valA = pesoPrioridad[a.priorityLabel] ?? 99; valB = pesoPrioridad[b.priorityLabel] ?? 99; }
      else if (columna === 'stateLabel') { valA = pesoEstado[estadoVisible(a)] ?? 99; valB = pesoEstado[estadoVisible(b)] ?? 99; }
      else if (columna === 'openedAt' || columna === 'updatedAt') { valA = new Date(a[columna]); valB = new Date(b[columna]); }
      else { valA = a[columna]?.toLowerCase?.() ?? ''; valB = b[columna]?.toLowerCase?.() ?? ''; }
      if (valA < valB) return direccion === 'asc' ? -1 : 1;
      if (valA > valB) return direccion === 'asc' ? 1 : -1;
      return 0;
    });

  const hayFiltrosActivos = filtroEstado !== 'Todos' || filtroPrioridad !== 'Todas' || filtroSistema !== 'Todos' || filtroFechaDesde || filtroFechaHasta || busqueda.trim();
  const labelFiltroEstado =
    filtroEstado === 'noResueltos' ? 'No resueltos' :
    filtroEstado === 'resueltos'   ? 'Resueltos' :
    filtroEstado === 'escalado'    ? 'Escalado a 2do nivel' :
    filtroEstado !== 'Todos'       ? (ESTADO_LABEL_ES[filtroEstado] ?? filtroEstado) : '';

  const cantFiltrosActivos = [
    filtroEstado !== 'Todos', filtroPrioridad !== 'Todas', filtroSistema !== 'Todos', !!filtroFechaDesde, !!filtroFechaHasta, !!busqueda.trim(),
  ].filter(Boolean).length;

  const filtrosJSX = (
    <>
      <div style={styles.filtroGrupo}>
        <label style={styles.filtroLabel}>Estado</label>
        <select style={styles.select} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="New">Nuevo</option>
          <option value="In Progress">En progreso</option>
          <option value="On Hold">En espera</option>
          <option value="Resolved">Resuelto</option>
          <option value="Closed">Cerrado</option>
          <option value="Canceled">Cancelado</option>
          <option value="escalado">Escalado a 2do nivel</option>
        </select>
      </div>
      <div style={styles.filtroGrupo}>
        <label style={styles.filtroLabel}>Prioridad</label>
        <select style={styles.select} value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)}>
          <option value="Todas">Todas</option>
          <option value="Critical">Crítico</option>
          <option value="High">Alto</option>
          <option value="Moderate">Moderado</option>
          <option value="Low">Bajo</option>
        </select>
      </div>
      <div style={styles.filtroGrupo}>
        <label style={styles.filtroLabel}>Sistema</label>
        <select style={styles.select} value={filtroSistema} onChange={e => setFiltroSistema(e.target.value)}>
          <option value="Todos">Todos</option>
          <option value="acceso">Acceso</option>
          <option value="socios">Socios</option>
          <option value="turnos">Turnos</option>
          <option value="profesores">Profesores</option>
          <option value="pagos">Pagos</option>
          <option value="disponibilidad">Disponibilidad</option>
          <option value="clases">Clases</option>
          <option value="sin clasificar">Sin clasificar</option>
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
      <Sidebar paginaActiva="tickets" sidebarAbierto={sidebarAbierto} setSidebarAbierto={setSidebarAbierto} />

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
          <div style={styles.searchCard}>
            <label style={styles.filtroLabel}>Buscar incidente</label>
            <div style={styles.searchRow}>
              <input
                style={styles.searchInput}
                type="search"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por numero, titulo, estado, modulo, grupo, usuario o descripcion"
              />
              {busqueda && (
                <button style={styles.btnLimpiarBusqueda} onClick={() => setBusqueda('')}>Limpiar</button>
              )}
            </div>
          </div>

          {!isMobile && (
            <div style={styles.filtrosCard}>
              <div style={{ ...styles.filtrosRow, flexDirection: 'row' }}>{filtrosJSX}</div>
            </div>
          )}

          <div style={styles.tableCard}>
            <div style={styles.tableInfo}>
              Mostrando {ticketsFiltrados.length} de {tickets.length} incidentes
              {filtroEstado !== 'Todos' && <span style={{ color: '#2563A8', marginLeft: '8px' }}>— {labelFiltroEstado}</span>}
              {filtroSistema !== 'Todos' && <span style={{ color: '#2563A8', marginLeft: '8px' }}>— {SISTEMA_LABEL_ES[filtroSistema] ?? filtroSistema}</span>}
            </div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {isMobile && <th style={{ ...styles.th, width: '20px', padding: '6px 4px' }}></th>}
                    <th style={{ ...styles.th, cursor: 'pointer', padding: tdPadding }} onClick={() => toggleOrden('number')}>Número{flechaOrden('number')}</th>
                    <th style={{ ...styles.th, cursor: 'pointer', padding: tdPadding }} onClick={() => toggleOrden('title')}>Título{flechaOrden('title')}</th>
                    <th style={{ ...styles.th, textAlign: 'center', cursor: 'pointer', padding: tdPadding }} onClick={() => toggleOrden('stateLabel')}>Estado{flechaOrden('stateLabel')}</th>
                    <th style={{ ...styles.th, textAlign: 'center', cursor: 'pointer', padding: tdPadding }} onClick={() => toggleOrden('priorityLabel')}>Prioridad{flechaOrden('priorityLabel')}</th>
                    {!isMobile && (
                      <>
                        <th style={{ ...styles.th, textAlign: 'center', cursor: 'pointer' }} onClick={() => toggleOrden('openedAt')}>Abierto{flechaOrden('openedAt')}</th>
                        <th style={{ ...styles.th, textAlign: 'center', cursor: 'pointer' }} onClick={() => toggleOrden('updatedAt')}>Actualizado{flechaOrden('updatedAt')}</th>
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
                      <React.Fragment key={ticket.id}>
                        <tr style={index % 2 === 0 ? styles.trEven : styles.trOdd} onClick={() => isMobile && toggleFila(ticket.id)}>
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
                              background: colorEstado[estadoVisible(ticket)]?.bg || '#f8fafc',
                              color: colorEstado[estadoVisible(ticket)]?.color || '#64748b',
                            }}>
                              {esEscalado(ticket) ? 'Escalado a 2do nivel' : (ESTADO_LABEL_ES[ticket.stateLabel] ?? ticket.stateLabel)}
                            </span>
                          </td>
                          <td style={{ ...styles.td, padding: tdPadding, textAlign: 'center' }}>
                            <span style={{
                              ...styles.badge,
                              fontSize: isMobile ? '10px' : '11px',
                              padding: isMobile ? '2px 6px' : '3px 10px',
                              background: colorPrioridad[ticket.priorityLabel]?.bg || '#f8fafc',
                              color: colorPrioridad[ticket.priorityLabel]?.color || '#64748b',
                            }}>
                              {PRIORIDAD_LABEL_ES[ticket.priorityLabel] ?? ticket.priorityLabel}
                            </span>
                          </td>
                          {!isMobile && (
                            <>
                              <td style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontSize: '12px' }}>{new Date(ticket.openedAt).toLocaleDateString('es-AR')}</td>
                              <td style={{ ...styles.td, textAlign: 'center', color: '#64748b', fontSize: '12px' }}>{new Date(ticket.updatedAt).toLocaleDateString('es-AR')}</td>
                            </>
                          )}
                        </tr>
                        {isMobile && filaExpandida === ticket.id && (
                          <tr style={{ background: '#f8fafc' }}>
                            <td colSpan={5} style={{ padding: '6px 12px 10px 30px' }}>
                              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span><strong>Abierto:</strong> {new Date(ticket.openedAt).toLocaleDateString('es-AR')}</span>
                                <span><strong>Actualizado:</strong> {new Date(ticket.updatedAt).toLocaleDateString('es-AR')}</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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
          {bottomSheetAbierto && <div style={styles.overlay} onClick={() => setBottomSheetAbierto(false)} />}
          <div style={{ ...styles.bottomSheet, transform: bottomSheetAbierto ? 'translateY(0)' : 'translateY(100%)' }}>
            <div style={styles.bottomSheetHandle} />
            <div style={styles.bottomSheetHeader}>
              <span style={styles.bottomSheetTitle}>Filtros</span>
              <button style={styles.btnCerrarSheet} onClick={() => setBottomSheetAbierto(false)}>✕</button>
            </div>
            <div style={styles.bottomSheetBody}>{filtrosJSX}</div>
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
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
    fontFamily: "'Syne', sans-serif",
    fontSize: '20px',
    fontWeight: '800',
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
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
  searchCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '14px 20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  searchRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: '13px',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#1A3A5C',
  },
  btnLimpiarBusqueda: {
    fontSize: '12px',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    background: 'white',
    color: '#64748b',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    whiteSpace: 'nowrap',
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
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
  trEven: { background: 'white' },
  trOdd: { background: '#f8fafc' },
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
    fontFamily: "'Syne', sans-serif",
    fontSize: '15px',
    fontWeight: '700',
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
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    marginTop: '20px',
  },
};
