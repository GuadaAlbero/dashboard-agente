import { useState } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Sidebar from '../components/Sidebar';
// import axios from 'axios'; // descomentar cuando el back esté listo

export default function Dashboard() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  // ── DATOS HARDCODEADOS — reemplazar cuando el back esté listo ────
  const [metricasBack] = useState({
    ingresados: 64,
    resueltos: 55,
    noResueltos: 7,
    escalados: 2,
  });
  // ── CUANDO EL BACK ESTÉ LISTO, reemplazar el useState de arriba por esto:
  //
  // const [metricasBack, setMetricasBack] = useState({});
  //
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   axios.get('URL_DEL_BACK/metricas', {
  //     headers: { Authorization: `Bearer ${token}` }
  //   })
  //   .then(res => setMetricasBack(res.data))
  //   .catch(err => console.error(err));
  // }, []);
  // ────────────────────────────────────────────────────────────────

  const metricas = [
    { nombre: 'Ingresados', incidentes: metricasBack.ingresados, fill: '#2563A8' },
    { nombre: 'Resueltos', incidentes: metricasBack.resueltos, fill: '#1D9E75' },
    { nombre: 'No resueltos', incidentes: metricasBack.noResueltos, fill: '#BA7517' },
    { nombre: 'Escalados a 2do nivel', incidentes: metricasBack.escalados, fill: '#E24B4A' },
  ];

  const distribucion = [
    { nombre: 'Resueltos', incidentes: metricasBack.resueltos, fill: '#1D9E75' },
    { nombre: 'No resueltos', incidentes: metricasBack.noResueltos, fill: '#BA7517' },
    { nombre: 'Escalados a 2do nivel', incidentes: metricasBack.escalados, fill: '#E24B4A' },
  ];

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

        <div style={styles.content}>
          <div style={styles.metricsGrid}>
            {metricas.map((item) => (
              <div key={item.nombre} style={{ ...styles.metricCard, borderTop: `4px solid ${item.fill}` }}>
                <div style={styles.metricLabel}>{item.nombre}</div>
                <div style={{ ...styles.metricValue, color: item.fill }}>{item.incidentes}</div>
              </div>
            ))}
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>Distribución de tickets ingresados</div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
                <Pie
                  data={distribucion}
                  dataKey="incidentes"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  animationBegin={300}
                  animationDuration={1500}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {distribucion.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tickets`, 'Cantidad']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  screen: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
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
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  metricCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  metricLabel: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '6px',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: '700',
  },
  chartCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  chartTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1A3A5C',
    marginBottom: '16px',
  },
};