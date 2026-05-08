import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const metricasBack = {
    ingresados: 64,
    resueltos: 55,
    noResueltos: 7,
    escalados: 2,
  };

  const metricas = [
    {
      nombre: 'Ingresados',
      incidentes: metricasBack.ingresados,
      fill: '#2563A8',
    },
    {
      nombre: 'Resueltos',
      incidentes: metricasBack.resueltos,
      fill: '#1D9E75',
    },
    {
      nombre: 'No resueltos',
      incidentes: metricasBack.noResueltos,
      fill: '#BA7517',
    },
    {
      nombre: 'Escalados a 2do nivel',
      incidentes: metricasBack.escalados,
      fill: '#E24B4A',
    },
  ];

  const distribucion = [
    {
      nombre: 'Resueltos',
      incidentes: metricasBack.resueltos,
      fill: '#1D9E75',
    },
    {
      nombre: 'No resueltos',
      incidentes: metricasBack.noResueltos,
      fill: '#BA7517',
    },
    {
      nombre: 'Escalados a 2do nivel',
      incidentes: metricasBack.escalados,
      fill: '#E24B4A',
    },
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

        <div
          style={{
            ...styles.content,
            padding: isMobile ? '12px' : '20px 24px',
          }}
        >
          <div
            style={{
              ...styles.metricsGrid,
              gridTemplateColumns: isMobile
                ? '1fr'
                : 'repeat(4, 1fr)',
            }}
          >
            {metricas.map((item) => (
              <div
                key={item.nombre}
                style={{
                  ...styles.metricCard,
                  borderTop: `4px solid ${item.fill}`,
                  padding: isMobile ? '2px' : '20px 24px',
                  textAlign: 'center',
                }}
              >
                <div style={styles.metricLabel}>
                  {item.nombre}
                </div>

                <div
                  style={{
                    ...styles.metricValue,
                    color: item.fill,
                    fontSize: isMobile ? '22px' : '28px',
                  }}
                >
                  {item.incidentes}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>
              Distribución de tickets ingresados
            </div>

            <ResponsiveContainer width="100%" height={isMobile ? 160 : 320}>
              <PieChart>
                <Pie

                  data={distribucion}
                  dataKey="incidentes"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 50 : 110}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  label={({ percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
                  {distribucion.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.fill}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    `${value} tickets`,
                    'Cantidad',
                  ]}
                />

                {!isMobile && <Legend />}
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
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    background: '#000',
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
    borderBottom: '1px solid #000',
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

  metricsGrid: {
    display: 'grid',
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