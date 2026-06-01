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

  const totalFallas = fallasPorModulo.reduce((acc, m) => acc + m.fallas, 0);

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
              <div style={styles.chartTitle}>Módulos con fallas recurrentes</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={[...fallasPorModulo].sort((a, b) => b.fallas - a.fallas)}
                  layout="vertical"
                  margin={{ top: 0, right: isMobile ? 10 : 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" label={{ value: 'Fallas', position: 'insideBottom', offset: -15 }} tick={{ fill: '#64748b' }} />
                  <YAxis type="category" dataKey="modulo" width={isMobile ? 60 : 160} tick={{ fontSize: isMobile ? 9 : 11, fill: '#64748b' }} />
                  <Tooltip formatter={(value) => [`${value} fallas`, 'Cantidad']} />
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
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={[...errorPorAgente].sort((a, b) => b.tasa - a.tasa)}
                  layout="vertical"
                  margin={{ top: 0, right: isMobile ? 10 : 30, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" label={{ value: '%', position: 'insideBottom', offset: -15 }} tick={{ fill: '#64748b' }} />
                  <YAxis type="category" dataKey="agente" width={isMobile ? 60 : 160} tick={{ fontSize: isMobile ? 9 : 11, fill: '#64748b' }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Tasa de error']} />
                  <Bar dataKey="tasa" radius={[0, 6, 6, 0]}>
                    {[...errorPorAgente].sort((a, b) => b.tasa - a.tasa).map((entry, index) => (
                      <Cell key={index} fill={entry.tasa > 10 ? '#E24B4A' : entry.tasa > 5 ? '#BA7517' : '#1D9E75'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>Casos que requieren análisis de causa raíz</div>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Módulo</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Fallas</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Representación</th>
                    <th style={{ ...styles.th, textAlign: 'center' }}>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {[...fallasPorModulo].sort((a, b) => b.fallas - a.fallas).map((item, index) => (
                    <tr key={index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                      <td style={{ ...styles.td, color: item.fallas < 3 ? '#94a3b8' : '#1A3A5C' }}>{item.modulo}</td>
                      <td style={{ ...styles.td, textAlign: 'center', color: item.fallas < 3 ? '#94a3b8' : '#1A3A5C' }}>{item.fallas}</td>
                      <td style={{ ...styles.td, textAlign: 'center', color: item.fallas < 3 ? '#94a3b8' : '#1A3A5C' }}>
                        {totalFallas > 0 ? ((item.fallas / totalFallas) * 100).toFixed(1) : 0}%
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={{
                          ...styles.badge,
                          background: item.fallas >= 10 ? '#fef2f2' : item.fallas >= 6 ? '#fff7ed' : item.fallas >= 3 ? '#f0fdf4' : '#f8fafc',
                          color: item.fallas >= 10 ? '#E24B4A' : item.fallas >= 6 ? '#BA7517' : item.fallas >= 3 ? '#1D9E75' : '#94a3b8',
                        }}>
                          {item.fallas >= 10 ? 'Alta' : item.fallas >= 6 ? 'Media' : item.fallas >= 3 ? 'Baja' : 'Sin prioridad'}
                        </span>
                      </td>
                    </tr>
                  ))}
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
    minWidth: '500px',
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