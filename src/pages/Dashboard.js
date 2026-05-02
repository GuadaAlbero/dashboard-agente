import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
// import axios from 'axios'; // descomentar cuando el back esté listo

export default function Dashboard() {
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const navigate = useNavigate();

  // ── DATOS HARDCODEADOS — reemplazar cuando el back esté listo ────
  const [metricasBack, setMetricasBack] = useState({
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.screen}>
      <div style={{ ...styles.sidebar, width: sidebarAbierto ? '200px' : '52px' }}>
        <div style={styles.logoWrap}>
          <button style={styles.hamburger} onClick={() => setSidebarAbierto(!sidebarAbierto)}>☰</button>
          {sidebarAbierto && (
            <div>
              <div style={styles.logoName}>Agente IA Soporte</div>
              <div style={styles.logoSub}>Turnera de Pilates</div>
            </div>
          )}
        </div>
        <nav style={styles.nav}>
          <div style={styles.navItemActive}>{sidebarAbierto ? 'Dashboard' : '📊'}</div>
          <div style={styles.navItem}>{sidebarAbierto ? 'Métricas' : '📈'}</div>
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={styles.avatar}>OP</div>
          {sidebarAbierto && (
            <div>
              <div style={styles.userName}>Operador</div>
              <div style={styles.logout} onClick={handleLogout}>Cerrar sesión</div>
            </div>
          )}
        </div>
      </div>

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
  screen: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', background: '#f1f5f9' },
  sidebar: { background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'width 0.2s ease', overflow: 'hidden' },
  logoWrap: { padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' },
  hamburger: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#1A3A5C', flexShrink: 0 },
  logoName: { fontSize: '13px', fontWeight: '600', color: '#1A3A5C', whiteSpace: 'nowrap' },
  logoSub: { fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' },
  nav: { padding: '8px 0', flex: 1 },
  navItem: { padding: '8px 16px', fontSize: '13px', color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap' },
  navItemActive: { padding: '8px 16px', fontSize: '13px', color: '#2563A8', fontWeight: '600', background: '#EEF4FB', cursor: 'pointer', whiteSpace: 'nowrap' },
  sidebarFooter: { padding: '12px 16px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: { width: '28px', height: '28px', borderRadius: '50%', background: '#EEF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: '#2563A8', flexShrink: 0 },
  userName: { fontSize: '12px', fontWeight: '500', color: '#1A3A5C', whiteSpace: 'nowrap' },
  logout: { fontSize: '11px', color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar: { padding: '14px 24px', background: 'white', borderBottom: '1px solid #e2e8f0' },
  pageTitle: { fontSize: '16px', fontWeight: '600', color: '#1A3A5C' },
  content: { flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' },
  metricCard: { background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  metricLabel: { fontSize: '12px', color: '#64748b', marginBottom: '6px' },
  metricValue: { fontSize: '28px', fontWeight: '700' },
  chartCard: { background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  chartTitle: { fontSize: '14px', fontWeight: '600', color: '#1A3A5C', marginBottom: '16px' },
};