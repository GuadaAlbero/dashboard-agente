import { useNavigate } from 'react-router-dom';

export default function Sidebar({ paginaActiva, sidebarAbierto, setSidebarAbierto }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
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
        <div
          style={paginaActiva === 'dashboard' ? styles.navItemActive : styles.navItem}
          onClick={() => navigate('/dashboard')}
        >
          {sidebarAbierto ? 'Dashboard' : <img src='dashboard-icon.png' width={20} height={20} alt="" />}
        </div>
        <div
          style={paginaActiva === 'metricas' ? styles.navItemActive : styles.navItem}
          onClick={() => navigate('/metricas')}
        >
          {sidebarAbierto ? 'Métricas' : <img src='metricas-icon.png' width={20} height={20} alt="" />}
        </div>
        <div
          style={paginaActiva === 'tickets' ? styles.navItemActive : styles.navItem}
          onClick={() => navigate('/tickets')}
        >
          {sidebarAbierto ? 'Incidentes' : <img src='ticket.png' width={20} height={20} alt="" />}
        </div>
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
    fontFamily: "'Poppins', sans-serif",
  },
  logoWrap: {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
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
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A3A5C',
    whiteSpace: 'nowrap',
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
    padding: '8px 16px',
    fontSize: '13px',
    color: '#64748b',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  navItemActive: {
    padding: '8px 16px',
    fontSize: '13px',
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
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#EEF4FB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '600',
    color: '#2563A8',
    flexShrink: 0,
  },
  userName: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#1A3A5C',
    whiteSpace: 'nowrap',
  },
  logout: {
    fontSize: '11px',
    color: '#64748b',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};