import { useNavigate } from 'react-router-dom';

export default function Sidebar({ paginaActiva, sidebarAbierto, setSidebarAbierto }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
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
          {sidebarAbierto ? 'Dashboard' : '📊'}
        </div>
        <div
          style={paginaActiva === 'metricas' ? styles.navItemActive : styles.navItem}
          onClick={() => navigate('/metricas')}
        >
          {sidebarAbierto ? 'Métricas' : '📈'}
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
    background: '#0f172a',
    borderRight: '1px solid #1e293b',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    transition: 'width 0.2s ease',
    overflow: 'hidden',
  },
  logoWrap: {
    padding: '12px 16px',
    borderBottom: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  hamburger: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#94a3b8',
    flexShrink: 0,
  },
  logoName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#f1f5f9',
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
    color: '#94a3b8',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  navItemActive: {
    padding: '8px 16px',
    fontSize: '13px',
    color: '#60a5fa',
    fontWeight: '600',
    background: '#1e3a5f',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  sidebarFooter: {
    padding: '12px 16px',
    borderTop: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#1e3a5f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '600',
    color: '#60a5fa',
    flexShrink: 0,
  },
  userName: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#f1f5f9',
    whiteSpace: 'nowrap',
  },
  logout: {
    fontSize: '11px',
    color: '#64748b',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};