import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import Sidebar from '../components/Sidebar';
import { getMetricasCalidad } from '../services/api';

const KEY_ESCALADOS = 'escalados a nivel 2';

const COLOR_TOP = '#C2410C';

const capitalizar = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

export default function Metricas() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [fallasPorModulo, setFallasPorModulo] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let activo = true;
    const cargarMetricas = () => {
      setCargando(true);
      setErrorCarga('');
      getMetricasCalidad()
        .then(data => {
          if (!activo) return;
          setFallasPorModulo(Array.isArray(data?.fallasPorModulo) ? data.fallasPorModulo : []);
        })
        .catch(err => {
          if (!activo) return;
          console.error(err);
          setErrorCarga('No se pudieron cargar las métricas de calidad.');
        })
        .finally(() => { if (activo) setCargando(false); });
    };
    cargarMetricas();
    const recargarSiVuelveElFoco = () => { if (!document.hidden) cargarMetricas(); };
    document.addEventListener('visibilitychange', recargarSiVuelveElFoco);
    window.addEventListener('focus', cargarMetricas);
    return () => {
      activo = false;
      document.removeEventListener('visibilitychange', recargarSiVuelveElFoco);
      window.removeEventListener('focus', cargarMetricas);
    };
  }, []);

  const escalados = fallasPorModulo.find(m => m.modulo?.toLowerCase() === KEY_ESCALADOS) || null;
  const modulosReales = fallasPorModulo.filter(m => m.modulo?.toLowerCase() !== KEY_ESCALADOS);


  const totalTickets = fallasPorModulo.reduce((acc, m) => acc + m.fallas, 0);
  const pctEscalados = totalTickets > 0 && escalados
    ? Math.round((escalados.fallas / totalTickets) * 100)
    : 0;

  const getPrioridad = (porcentaje) => {
    if (porcentaje >= 30) return { label: 'Alta',          bg: '#fef2f2', color: '#F87171' };
    if (porcentaje >= 15) return { label: 'Media',         bg: '#fff7ed', color: '#F59E0B' };
    if (porcentaje >=  5) return { label: 'Baja',          bg: '#f0fdf4', color: '#34D399' };
    return                       { label: 'Sin prioridad', bg: '#f8fafc', color: '#94a3b8' };
  };


  const datosGrafico = [...modulosReales].sort((a, b) => b.fallas - a.fallas);
  const moduloTopNombre = datosGrafico[0]?.modulo?.toLowerCase() || null;

  const moduloTop = datosGrafico[0]
    ? { nombre: capitalizar(datosGrafico[0].modulo), porcentaje: totalTickets > 0 ? Math.round((datosGrafico[0].fallas / totalTickets) * 100) : 0 }
    : null;

  return (
    <div style={styles.screen}>
      <Sidebar paginaActiva="metricas" sidebarAbierto={sidebarAbierto} setSidebarAbierto={setSidebarAbierto} />

      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.pageTitle}>Métricas de calidad</div>
        </div>

        <div style={{ ...styles.content, padding: isMobile ? '12px' : '20px 24px' }}>
          {errorCarga && <div style={styles.errorMsg}>{errorCarga}</div>}
          {cargando  && <div style={styles.loadingMsg}>Cargando métricas...</div>}


          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: '12px',
          }}>

            <div style={{ ...styles.summaryCard, borderTop: '4px solid #2563A8' }}>
              <div style={styles.summaryLabel}>Total de tickets</div>
              <div style={{ ...styles.summaryValue, color: '#2563A8' }}>{totalTickets}</div>
              <div style={styles.summarySub}>analizados</div>
            </div>


            <div style={{ ...styles.summaryCard, borderTop: `4px solid ${moduloTop ? COLOR_TOP : '#94a3b8'}` }}>
              <div style={styles.summaryLabel}>Módulo más problemático</div>
              <div style={{ ...styles.summaryValueMod, color: moduloTop ? COLOR_TOP : '#94a3b8' }}>
                {moduloTop ? moduloTop.nombre : '—'}
              </div>
              <div style={styles.summarySub}>{moduloTop ? `${moduloTop.porcentaje}% del total` : 'Sin datos'}</div>
            </div>


            <div style={{ ...styles.summaryCard, borderTop: '4px solid #E24B4A', gridColumn: isMobile ? '1 / -1' : 'auto' }}>
              <div style={styles.summaryLabel}>Escalados a nivel 2</div>
              <div style={{ ...styles.summaryValue, color: '#E24B4A' }}>
                {escalados ? escalados.fallas : 0}
              </div>
              <div style={styles.summarySub}>
                {escalados ? `${pctEscalados}% del total` : 'Sin datos'}
              </div>
            </div>

            <div style={{ ...styles.summaryCard, borderTop: '4px solid #64748b' }}>
              <div style={styles.summaryLabel}>Módulos analizados</div>
              <div style={{ ...styles.summaryValue, color: '#64748b' }}>{modulosReales.length}</div>
              <div style={styles.summarySub}>módulos del sistema</div>
            </div>
          </div>


          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '16px',
            alignItems: 'start',
          }}>


            <div style={styles.card}>
              <div style={styles.cardTitle}>Módulos con fallas recurrentes</div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={datosGrafico}
                  layout="vertical"
                  margin={{ top: 4, right: 20, left: isMobile ? 0 : 8, bottom: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    label={{ value: 'Tickets', position: 'insideBottom', offset: -14, fill: '#94a3b8', fontSize: 11 }}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="modulo"
                    width={isMobile ? 90 : 120}
                    tickFormatter={capitalizar}
                    tick={{ fontSize: isMobile ? 10 : 11, fill: '#64748b', width: isMobile ? 85 : 115 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} tickets`, 'Cantidad']}
                    labelFormatter={(label) => capitalizar(label)}
                    contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="fallas" radius={[0, 6, 6, 0]}>
                    {datosGrafico.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.modulo?.toLowerCase() === moduloTopNombre
                            ? COLOR_TOP
                            : getPrioridad(totalTickets > 0 ? (entry.fallas / totalTickets) * 100 : 0).color
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>Análisis de causa raíz por módulo</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Módulo</th>
                      <th style={{ ...styles.th, textAlign: 'center' }}>Tickets</th>
                      <th style={{ ...styles.th, textAlign: 'center' }}>%</th>
                      <th style={{ ...styles.th, textAlign: 'center' }}>Prioridad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modulosReales.length === 0 && !cargando ? (
                      <tr>
                        <td colSpan={4} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8', padding: '32px' }}>
                          Sin datos disponibles.
                        </td>
                      </tr>
                    ) : (
                      <>
                        {datosGrafico.map((item, index) => {
                          const porcentaje = totalTickets > 0 ? (item.fallas / totalTickets) * 100 : 0;
                          const esTop = item.modulo?.toLowerCase() === moduloTopNombre;
                          const prioridad = esTop ? { label: "Alta", bg: "#fff3e0", color: "#C2410C" } : getPrioridad(porcentaje);
                          const esSecundario = porcentaje < 5;
                          return (
                            <tr key={index} style={{ background: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                              <td style={{ ...styles.td, color: esSecundario ? '#94a3b8' : '#1A3A5C', fontWeight: esTop ? '600' : 'normal' }}>
                                {capitalizar(item.modulo)}
                              </td>
                              <td style={{ ...styles.td, textAlign: 'center', color: esSecundario ? '#94a3b8' : '#1A3A5C' }}>{item.fallas}</td>
                              <td style={{ ...styles.td, textAlign: 'center', color: esSecundario ? '#94a3b8' : '#1A3A5C' }}>{Math.round(porcentaje)}%</td>
                              <td style={{ ...styles.td, textAlign: 'center' }}>
                                <span style={{ ...styles.badge, background: prioridad.bg, color: prioridad.color }}>
                                  {prioridad.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}

                        {/* Fila de escalados al pie, separada visualmente */}
                        {escalados && (
                          <tr style={{ background: '#fef2f2', borderTop: '2px solid #e2e8f0' }}>
                            <td style={{ ...styles.td, color: '#E24B4A', fontWeight: '600' }}>
                              Escalados a nivel 2
                            </td>
                            <td style={{ ...styles.td, textAlign: 'center', color: '#E24B4A', fontWeight: '600' }}>
                              {escalados.fallas}
                            </td>
                            <td style={{ ...styles.td, textAlign: 'center', color: '#E24B4A', fontWeight: '600' }}>
                              {pctEscalados}%
                            </td>
                            <td style={{ ...styles.td, textAlign: 'center' }}>
                              <span style={{ ...styles.badge, background: '#fef2f2', color: '#E24B4A' }}>
                                Escalado
                              </span>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
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
  summaryCard: {
    background: 'white',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    marginBottom: '8px',
  },
  summaryValue: {
    fontSize: '36px',
    fontWeight: '700',
    lineHeight: 1,
  },
  summaryValueMod: {
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: 1.2,
    marginTop: '4px',
  },
  summarySub: {
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '6px',
  },
  card: {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '14px',
    fontWeight: '700',
    color: '#1A3A5C',
    marginBottom: '16px',
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
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #f1f5f9',
    color: '#1A3A5C',
  },
  badge: {
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  loadingMsg: {
    fontSize: '12px',
    color: '#64748b',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '10px 12px',
  },
  errorMsg: {
    fontSize: '12px',
    color: '#991b1b',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '10px 12px',
  },
};