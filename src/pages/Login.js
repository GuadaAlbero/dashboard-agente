import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL_BACK = process.env.REACT_APP_API_URL || '/api';
const SKIP_LOGIN = process.env.REACT_APP_SKIP_LOGIN === 'true';

function Login() {
  const [isRegistro, setIsRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [esperandoConfirmacion, setEsperandoConfirmacion] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (SKIP_LOGIN) {
      localStorage.setItem('accessToken', 'local-dev-token');
      localStorage.setItem('userEmail', 'operador@mail.com');
      navigate('/dashboard');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (token) navigate('/dashboard');
  }, [navigate]);

  const validarRegistro = () => {
    if (!email || !password) return 'Completá todos los campos.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresá un email válido.';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[0-9]/.test(password)) return 'La contraseña debe tener al menos un número.';
    if (!/[a-zA-Z]/.test(password)) return 'La contraseña debe tener al menos una letra.';
    if (!/[A-Z]/.test(password)) return 'La contraseña debe tener al menos una mayúscula.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'La contraseña debe tener al menos un carácter especial.';
    return null;
  };

  const validarLogin = () => {
    if (!email || !password) return 'Completá todos los campos.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresá un email válido.';
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    const mensajeError = isRegistro ? validarRegistro() : validarLogin();
    if (mensajeError) { setError(mensajeError); return; }

    try {
      if (isRegistro) {
        await axios.post(`${URL_BACK}/auth/sign-up`, { email, password });
        setEsperandoConfirmacion(true);
        return;
      }
      const response = await axios.post(`${URL_BACK}/auth/sign-in`, { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    } catch (err) {
      setError('Email o contraseña incorrectos.');
    }
  };

  const confirmarCodigo = async () => {
    try {
      await axios.post(`${URL_BACK}/auth/confirm`, { email, code: String(codigo) });
      setEsperandoConfirmacion(false);
      setError('');
      alert('Cuenta confirmada. Ya podés iniciar sesión.');
      setIsRegistro(false);
    } catch (err) {
      setError('Código incorrecto o expirado.');
    }
  };

  return (
    <div style={isMobile ? styles.screenMobile : styles.screen}>
      <div style={isMobile ? styles.cardMobile : styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoName}>Agente IA Soporte</div>
          <div style={styles.logoSub}>Panel de operadores</div>
        </div>
        <hr style={styles.divider} />

        {error && <div style={styles.error}>{error}</div>}

        {esperandoConfirmacion && (
          <div style={styles.info}>
            Te mandamos un código al mail. Ingresalo para confirmar tu cuenta.
            <input
              style={{ ...styles.input, marginTop: '8px' }}
              type="text"
              placeholder="Código de confirmación"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
            />
            <button style={{ ...styles.btn, marginTop: '8px' }} onClick={confirmarCodigo}>
              Confirmar
            </button>
          </div>
        )}

        {!esperandoConfirmacion && (
          <>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="operador@estudio.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Contraseña</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <button style={styles.btn} onClick={handleSubmit}>
              {isRegistro ? 'Registrarse' : 'Ingresar'}
            </button>
            <div style={styles.toggle}>
              {isRegistro ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}
              <span style={styles.link} onClick={() => { setIsRegistro(!isRegistro); setError(''); }}>
                {isRegistro ? ' Iniciá sesión' : ' Registrate'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  screen: {
    minHeight: '100vh',
    background: '#f1f5f9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
screenMobile: {
    minHeight: '100vh',
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    width: '100%',
    maxWidth: '360px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
cardMobile: {
  background: 'white',
  padding: '0 28px',
  width: '100%',
  minHeight: '100vh',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingBottom: '80px',
},
  logo: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logoName: {
    fontFamily: "'Syne', sans-serif",
    fontSize: '22px',
    fontWeight: '800',
    color: '#1A3A5C',
  },
  logoSub: {
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  },
divider: {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  marginBottom: '28px',
  marginTop: '4px',
},
  error: {
    background: '#fef2f2',
    color: '#dc2626',
    fontSize: '13px',
    padding: '10px 12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  info: {
    background: '#eff6ff',
    color: '#2563A8',
    fontSize: '13px',
    padding: '10px 12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    fontSize: '13px',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#1A3A5C',
  },
  btn: {
    width: '100%',
    padding: '11px',
    background: '#1A3A5C',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  toggle: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#64748b',
    marginTop: '16px',
  },
  link: {
    color: '#2563A8',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default Login;
