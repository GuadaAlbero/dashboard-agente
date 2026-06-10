import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getMetricas, getTickets } from '../services/api';

export default function Dashboard() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [metricasBack, setMetricasBack] = useState({
    ingresados: 0, resueltos: 0, noResueltos: 0, escalados: 0
  });
  const [ultimosTickets, setUltimosTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      getMetricas()
        .then(data => setMetricasBack(data))
        .catch(err => console.error(err));
      getTickets()
        .then(data => setUltimosTickets(
          [...data].sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt)).slice(0, 5)
        ))
        .catch(err => console.error(err));
    };
    fetchData();
    const intervalo = setInterval(fetchData, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const total = metricasBack.ingresados || 1;
  const esEscalado = (ticket) => ticket.assignmentGroup === 'Soporte Nivel 2';
  const estadoVisible = (ticket) => esEscalado(ticket) ? 'Escalado' : ticket.stateLabel;

  const metricas = [
    { nombre: 'Ingresados',            incidentes: metricasBack.ingresados,  fill: '#2563A8', filtro: null },
    { nombre: 'Resueltos',             incidentes: metricasBack.resueltos,   fill: '#1D9E75', filtro: 'resueltos' },
    { nombre: 'No resueltos',          incidentes: metricasBack.noResueltos, fill: '#BA7517', filtro: 'noResueltos' },
    { nombre: 'Escalados a 2do nivel', incidentes: metricasBack.escalados,   fill: '#E24B4A', filtro: 'escalado' },
  ];

  const distribucion = [
    { nombre: 'Resueltos',             incidentes: metricasBack.resueltos,   fill: '#1D9E75' },
    { nombre: 'No resueltos',          incidentes: metricasBack.noResueltos, fill: '#BA7517' },
    { nombre: 'Escalados a 2do nivel', incidentes: metricasBack.escalados,   fill: '#E24B4A' },
  ];

  const colorEstado = {
    'New':         { bg: '#eff6ff', color: '#2563A8' },
    'In Progress': { bg: '#fff7ed', color: '#BA7517' },
    'On Hold':     { bg: '#f5f3ff', color: '#7c3aed' },
    'Resolved':    { bg: '#f0fdf4', color: '#1D9E75' },
    'Closed':      { bg: '#f8fafc', color: '#64748b' },
    'Canceled':    { bg: '#f8fafc', color: '#94a3b8' },
    'Escalado':    { bg: '#fef2f2', color: '#E24B4A' },
  };

  const estadoES = {
    'New': 'Nuevo', 'In Progress': 'En progreso', 'On Hold': 'En espera',
    'Resolved': 'Resuelto', 'Closed': 'Cerrado', 'Canceled': 'Cancelado', 'Escalado': 'Escalado',
  };

  const handleCardClick = (item) => {
    if (item.filtro) {
      navigate(`/tickets?estado=${item.filtro}`);
    } else {
      navigate('/tickets');
    }
  };

  return (
    <div style={styles.screen}>
      <Sidebar
        paginaActiva="dashboard"
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
      />

      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.pageTitle}>Dashboard</div>
        </div>

        <div style={{ ...styles.content, padding: isMobile ? '12px' : '20px 24px' }}>

          {/* Cards */}
          <div style={{ ...styles.metricsGrid, gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)' }}>
            {metricas.map((item) => (
              <div
                key={item.nombre}
                onClick={() => handleCardClick(item)}
                style={{ ...styles.metricCard, borderTop: `4px solid ${item.fill}`, cursor: 'pointer' }}
              >
                <div style={styles.metricLabel}>{item.nombre}</div>
                <div style={{ ...styles.metricValue, color: item.fill, fontSize: isMobile ? '28px' : '40px' }}>
                  {item.incidentes}
                </div>
                <div style={styles.metricSub}>
                  {item.filtro ? `${Math.round((item.incidentes / total) * 100)}% del total` : 'Total ingresados'}
                </div>
              </div>
            ))}
          </div>

          {/* Gráfico + Últimos tickets */}
          <div style={{ ...styles.bottomRow, flexDirection: isMobile ? 'column' : 'row' }}>

            <div style={{ ...styles.chartCard, width: isMobile ? '100%' : '42%', flexShrink: 0, padding: isMobile ? '16px' : '20px', boxSizing: 'border-box', minHeight: isMobile ? 'auto' : '380px' }}>
              <div style={styles.chartTitle}>Distribución de tickets</div>
              <ResponsiveContainer width="100%" height={isMobile ? 160 : 300}>
                <PieChart>
                  <Pie
                    data={distribucion}
                    dataKey="incidentes"
                    nameKey="nombre"
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 45 : 110}
                    animationBegin={300}
                    animationDuration={1500}
                    label={({ percent }) => `${Math.round(percent * 100)}%`}
                    labelLine={false}
                  >
                    {distribucion.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tickets`, 'Cantidad']} />
                  {!isMobile && <Legend />}
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ ...styles.chartCard, flex: 1, padding: isMobile ? '16px' : '20px', boxSizing: 'border-box' }}>
              <div style={styles.chartTitle}>Últimos incidentes</div>
              <div style={styles.ticketList}>
                {ultimosTickets.length === 0 ? (
                  <div style={styles.emptyMsg}>Sin incidentes recientes</div>
                ) : (
                  ultimosTickets.map(t => (
                    <div
                      key={t.id}
                      style={styles.ticketRow}
                      onClick={() => navigate(`/tickets?busqueda=${t.number}`)}
                    >
                      <span style={styles.ticketNum}>#{t.number.slice(-5)}</span>
                      <span style={styles.ticketTitle}>{t.title}</span>
                      <span style={{
                        ...styles.badge,
                        background: colorEstado[estadoVisible(t)]?.bg || '#f8fafc',
                        color: colorEstado[estadoVisible(t)]?.color || '#64748b',
                      }}>
                        {esEscalado(t) ? 'Escalado a 2do nivel' : (estadoES[t.stateLabel] ?? t.stateLabel)}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div style={styles.verTodos} onClick={() => navigate('/tickets')}>
                Ver todos los incidentes →
              </div>
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
  },
  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '20px',
    fontWeight: '800',
    color: '#1A3A5C',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  metricsGrid: {
    display: 'grid',
    gap: '12px',
  },
  metricCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s',
  },
  metricLabel: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '8px',
    fontWeight: '600',
  },
  metricValue: {
    fontWeight: '700',
    lineHeight: 1,
  },
  metricSub: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '8px',
  },
  bottomRow: {
    display: 'flex',
    gap: '16px',
  },
  chartCard: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  chartTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '14px',
    fontWeight: '700',
    color: '#1A3A5C',
    marginBottom: '16px',
  },
  ticketList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  ticketRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    background: '#f8fafc',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid #f1f5f9',
  },
  ticketNum: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '600',
    flexShrink: 0,
  },
  ticketTitle: {
    fontSize: '12px',
    color: '#1A3A5C',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  badge: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '20px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  emptyMsg: {
    fontSize: '13px',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '24px',
  },
  verTodos: {
    fontSize: '12px',
    color: '#2563A8',
    cursor: 'pointer',
    marginTop: '12px',
    textAlign: 'right',
    fontWeight: '600',
  },
};