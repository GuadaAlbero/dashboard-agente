import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import Sidebar from '../components/Sidebar';
import { getMetricasCalidad } from '../services/api';

export default function Metricas() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [fallasPorModulo, setFallasPorModulo] = useState([]);
  const [errorPorAgente, setErrorPorAgente] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getMetricasCalidad()
      .then(data => {
        setFallasPorModulo(data.fallasPorModulo);
        setErrorPorAgente(data.errorPorAgente);
      })
      .catch(err => console.error(err));
  }, []);

  const totalCasos = fallasPorModulo.reduce((acc, m) => acc + m.fallas, 0);
  const hayEjecucionesAgente = errorPorAgente.some(item => (item.total ?? 0) > 0);

  const getPrioridad = (porcentaje) => {
    if (porcentaje >= 30) return { label: 'Alta',          bg: '#fef2f2', color: '#E24B4A' };
    if (porcentaje >= 15) return { label: 'Media',         bg: '#fff7ed', color: '#BA7517' };
    if (porcentaje >=  5) return { label: 'Baja',          bg: '#f0fdf4', color: '#1D9E75' };
    return                       { label: 'Sin prioridad', bg: '#f8fafc', color: '#94a3b8' };
  };

  return (
    <div style={styles.screen}>
      <Sidebar paginaActiva="metricas" sidebarAbierto={sidebarAbierto} setSidebarAbierto={setSidebarAbierto} />

      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.pageTitle}>Métricas de calidad</div>
        </div>

        <div style={{ ...styles.content, padding: isMobile ? '12px' : '20px 24px' }}>
          <div style={{ ...styles.row2, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
            <div style={styles.chartCard}>
              <div style={styles.chartTitle}>Tickets por módulo afectado</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={[...fallasPorModulo].sort((a, b) => b.fallas - a.fallas)}
                  layout="vertical"
                  margin={{ top: 0, right: isMobile ? 10 : 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" label={{ value: 'Tickets', position: 'insideBottom', offset: -15 }} tick={{ fill: '#64748b' }} />
                  <YAxis type="category" dataKey="modulo" width={isMobile ? 60 : 160} tick={{ fontSize: isMobile ? 9 : 11, fill: '#64748b' }} />
                  <Tooltip formatter={(value) => [`${value} tickets`, 'Cantidad']} />
                  <Bar dataKey="fallas" radius={[0, 6, 6, 0]}>
                    {[...fallasPorModulo].sort((a, b) => b.fallas - a.fallas).map((entry, index, arr) => (
                      <Cell key={index} fill={
                        entry.fallas === Math.max(...arr.map(e => e.fallas)) ? '#E24B4A' :
                        entry.fallas >= 6 ? '#BA7517' : '#2563A8'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.chartCard}>
              <div style={styles.chartTitle}>Tasa de error por agente (%)</div>
              {hayEjecucionesAgente ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={[...errorPorAgente].sort((a, b) => b.tasa - a.tasa)}
                      layout="vertical"
                      margin={{ top: 0, right: isMobile ? 10 : 30, left: 10, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} label={{ value: '%', position: 'insideBottom', offset: -15 }} tick={{ fill: '#64748b' }} />
                      <YAxis type="category" dataKey="agente" width={isMobile ? 70 : 160} tick={{ fontSize: isMobile ? 9 : 11, fill: '#64748b' }} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Tasa de error']} />
                      <Bar dataKey="tasa" radius={[0, 6, 6, 0]}>
                        {[...errorPorAgente].sort((a, b) => b.tasa - a.tasa).map((entry, index) => (
                          <Cell key={index} fill={entry.tasa > 10 ? '#E24B4A' : entry.tasa > 5 ? '#BA7517' : '#1D9E75'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={styles.agentRows}>
                    {[...errorPorAgente].sort((a, b) => b.tasa - a.tasa || (b.total ?? 0) - (a.total ?? 0)).map((item) => (
                      <div key={item.agente} style={styles.agentRow}>
                        <span style={styles.agentName}>{item.agente}</span>
                        <span style={styles.agentStat}>{item.total ?? 0} ejec.</span>
                        <span style={styles.agentStat}>{item.fallas ?? 0} fallas</span>
                        <span style={{ ...styles.agentRate, color: item.tasa > 0 ? '#E24B4A' : '#1D9E75' }}>{item.tasa}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={styles.emptyMsg}>Todavia no hay ejecuciones de agentes registradas.</div>
              )}
            </div>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>Distribución por sistema afectado</div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Módulo</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Tickets</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Representación</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {[...fallasPorModulo].sort((a, b) => b.fallas - a.fallas).map((item, index) => {
                    const porcentaje = totalCasos > 0 ? (item.fallas / totalCasos) * 100 : 0;
                    const prioridad = getPrioridad(porcentaje);
                    const esSecundario = porcentaje < 5;
                    return (
                      <tr key={index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                        <td style={{ ...styles.td, color: esSecundario ? '#94a3b8' : '#1A3A5C', padding: isMobile ? '8px 10px' : '10px 12px' }}>{item.modulo}</td>
                        <td style={{ ...styles.td, textAlign: 'center', color: esSecundario ? '#94a3b8' : '#1A3A5C', padding: isMobile ? '8px 10px' : '10px 12px' }}>{item.fallas}</td>
                        <td style={{ ...styles.td, textAlign: 'center', color: esSecundario ? '#94a3b8' : '#1A3A5C', padding: isMobile ? '8px 10px' : '10px 12px' }}>
                          {Math.round(porcentaje)}%
                        </td>
                        <td style={{ ...styles.td, textAlign: 'center', padding: isMobile ? '8px 10px' : '10px 12px' }}>
                          <span style={{
                            ...styles.badge,
                            background: prioridad.bg,
                            color: prioridad.color,
                          }}>
                            {prioridad.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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
  row2: {
    display: 'grid',
    gap: '16px',
  },
  chartCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  chartTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '14px',
    fontWeight: '700',
    color: '#1A3A5C',
    marginBottom: '16px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    minWidth: '400px',
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
  agentRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  agentRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto auto',
    gap: '10px',
    alignItems: 'center',
    padding: '8px 10px',
    background: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #f1f5f9',
  },
  agentName: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1A3A5C',
  },
  agentStat: {
    fontSize: '11px',
    color: '#64748b',
    whiteSpace: 'nowrap',
  },
  agentRate: {
    fontSize: '12px',
    fontWeight: '800',
    whiteSpace: 'nowrap',
  },
  emptyMsg: {
    fontSize: '13px',
    color: '#94a3b8',
    textAlign: 'center',
    padding: '32px 12px',
  },
};
