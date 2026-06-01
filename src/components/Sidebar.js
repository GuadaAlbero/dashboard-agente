import { useNavigate } from 'react-router-dom';

export default function Sidebar({ paginaActiva, sidebarAbierto, setSidebarAbierto }) {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'operador@mail.com';
  const iniciales = userEmail.substring(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard',  icon: 'dashboard-icon.png', ruta: '/dashboard' },
    { key: 'metricas',  label: 'Métricas',   icon: 'analytics.png',  ruta: '/metricas'  },
    { key: 'tickets',   label: 'Incidentes', icon: 'files.png',         ruta: '/tickets'   },
  ];

  return (
    <div style={{ ...styles.sidebar, width: sidebarAbierto ? '220px' : '52px' }}>
      <div style={styles.logoWrap}>
        <button style={styles.hamburger} onClick={() => setSidebarAbierto(!sidebarAbierto)}>☰</button>
        {sidebarAbierto && (
          <div>
            <div style={styles.logoName}>AgentAI Soporte</div>
            <div style={styles.logoSub}>Turnera de Pilates</div>
          </div>
        )}
      </div>
      <nav style={styles.nav}>
        {navItems.map(item => (
          <div
            key={item.key}
            style={paginaActiva === item.key ? styles.navItemActive : styles.navItem}
            onClick={() => navigate(item.ruta)}
          >
            {sidebarAbierto
              ? item.label
              : <img src={item.icon} width={20} height={20} alt="" />
            }
          </div>
        ))}
      </nav>
      <div style={styles.sidebarFooter}>
        <div style={styles.avatar}>{iniciales}</div>
        {sidebarAbierto && (
          <div style={{ overflow: 'hidden' }}>
            <div style={styles.userName}>{userEmail}</div>
            <div style={styles.logout} onClick={handleLogout}>Cerrar sesión</div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    background: 'white',
    borderRight: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    transition: 'width 0.2s ease',
    overflow: 'hidden',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  logoWrap: {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minHeight: '56px',
  },
  hamburger: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#1A3A5C',
    flexShrink: 0,
  },
  logoName: {
  fontFamily: "'Syne', sans-serif",
  fontSize: '11px',
  fontWeight: '800',
  color: '#1A3A5C',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '155px',
},
  logoSub: {
    fontSize: '11px',
    color: '#64748b',
    whiteSpace: 'nowrap',
  },
  nav: {
    padding: '8px 0',
    flex: 1,
  },
  navItem: {
    padding: '10px 16px',
    fontSize: '15px',
    color: '#64748b',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  navItemActive: {
    padding: '10px 16px',
    fontSize: '15px',
    color: '#2563A8',
    fontWeight: '600',
    background: '#EEF4FB',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  sidebarFooter: {
    padding: '12px 16px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#EEF4FB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: '#2563A8',
    flexShrink: 0,
  },
  userName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#1A3A5C',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '160px',
  },
  logout: {
    fontSize: '12px',
    color: '#64748b',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};