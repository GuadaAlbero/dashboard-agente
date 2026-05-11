import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import Sidebar from '../components/Sidebar';
// import axios from 'axios'; // descomentar cuando el back esté listo

// ── DATOS HARDCODEADOS — BORRAR cuando el back esté listo ────────
const fallasPorModulo = [
  { modulo: 'Cambio de horario', fallas: 12 },
  { modulo: 'Cancelación fuera de plazo', fallas: 8 },
  { modulo: 'Sin confirmación', fallas: 6 },
  { modulo: 'Turno no aparece', fallas: 5 },
  { modulo: 'Reserva de turno', fallas: 1 },
];

const errorPorAgente = [
  { agente: 'Subag. Cancelación', tasa: 18 },
  { agente: 'Subag. Cambio horario', tasa: 14 },
  { agente: 'Subag. Turno', tasa: 8 },
  { agente: 'Agente Enrutador', tasa: 4 },
  { agente: 'Agente Entrada', tasa: 2 },
];

// ── HARDCODEADO — reemplazar por res.data.totalIncidentes cuando el back esté listo ──
const totalIncidentes = 64;

// ── CUANDO EL BACK ESTÉ LISTO: ───────────────────────────────────
// 1. Borrar las tres constantes de arriba
// 2. Descomentar esto:
//
// const [fallasPorModulo, setFallasPorModulo] = useState([]);
// const [errorPorAgente, setErrorPorAgente] = useState([]);
// const [totalIncidentes, setTotalIncidentes] = useState(0);
//
// useEffect(() => {
//   const token = localStorage.getItem('token');
//   axios.get('URL_DEL_BACK/metricas/calidad', {
//     headers: { Authorization: `Bearer ${token}` }
//   })
//   .then(res => {
//     setFallasPorModulo(res.data.fallasPorModulo);
//     setErrorPorAgente(res.data.errorPorAgente);
//     setTotalIncidentes(res.data.totalIncidentes);
//   })
//   .catch(err => console.error(err));
// }, []);
// ────────────────────────────────────────────────────────────────

export default function Metricas() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.screen}>
      <Sidebar
        paginaActiva="metricas"
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
      />

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
                  <XAxis type="number" label={{ value: 'Fallas', position: 'insideBottom', offset: -15 }} tick={{ fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="modulo" width={isMobile ? 60 : 160} tick={{ fontSize: isMobile ? 9 : 11, fill: '#94a3b8' }} />
                  <Tooltip formatter={(value) => [`${value} fallas`, 'Cantidad']} />
                  <Bar dataKey="fallas" radius={[0, 6, 6, 0]}>
                    {[...fallasPorModulo]
                      .sort((a, b) => b.fallas - a.fallas)
                      .map((entry, index, arr) => (
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
                  <XAxis type="number" label={{ value: '%', position: 'insideBottom', offset: -15 }} tick={{ fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="agente" width={isMobile ? 60 : 160} tick={{ fontSize: isMobile ? 9 : 11, fill: '#94a3b8' }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Tasa de error']} />
                  <Bar dataKey="tasa" radius={[0, 6, 6, 0]}>
                    {[...errorPorAgente]
                      .sort((a, b) => b.tasa - a.tasa)
                      .map((entry, index) => (
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
                    <th style={styles.th}>Fallas</th>
                    <th style={styles.th}>% del total</th>
                    <th style={styles.th}>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {[...fallasPorModulo]
                    .sort((a, b) => b.fallas - a.fallas)
                    .map((item, index) => (
                      <tr key={index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                        <td style={{ ...styles.td, color: item.fallas < 3 ? '#94a3b8' : '#e2e8f0' }}>
                          {item.modulo}
                        </td>
                        <td style={{ ...styles.td, color: item.fallas < 3 ? '#94a3b8' : '#e2e8f0' }}>
                          {item.fallas}
                        </td>
                        <td style={{ ...styles.td, color: item.fallas < 3 ? '#94a3b8' : '#e2e8f0' }}>
                          {((item.fallas / totalIncidentes) * 100).toFixed(1)}%
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            background: item.fallas >= 10 ? '#fef2f2' : item.fallas >= 6 ? '#fff7ed' : item.fallas >= 3 ? '#eff6ff' : '#1e293b',
                            color: item.fallas >= 10 ? '#E24B4A' : item.fallas >= 6 ? '#BA7517' : item.fallas >= 3 ? '#2563A8' : '#94a3b8',
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
    fontFamily: "'Poppins', sans-serif",
    background: '#1e293b',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topbar: {
    padding: '14px 24px',
    background: '#0f172a',
    borderBottom: '1px solid #334155',
  },
  pageTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
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
    background: '#0f172a',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
  },
  chartTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
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
    color: '#94a3b8',
    background: '#1e293b',
    borderBottom: '1px solid #334155',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #334155',
    color: '#e2e8f0',
  },
  trEven: {
    background: '#0f172a',
  },
  trOdd: {
    background: '#162032',
  },
  badge: {
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
};