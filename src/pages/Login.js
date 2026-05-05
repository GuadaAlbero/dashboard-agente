import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL_BACK = process.env.REACT_APP_API_URL || '/api';

function Login() {
  const [isRegistro, setIsRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [esperandoConfirmacion, setEsperandoConfirmacion] = useState(false);
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    if (!email || !password) {
      setError('Completá todos los campos.');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      setError('Ingresá un email válido.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    const tieneNumero = /[0-9]/.test(password);
    if (!tieneNumero) {
      setError('La contraseña debe tener al menos un número.');
      return;
    }

    const tieneLetra = /[a-zA-Z]/.test(password);
    if (!tieneLetra) {
      setError('La contraseña debe tener al menos una letra.');
      return;
    }

    const tieneMayuscula = /[A-Z]/.test(password);
    if (!tieneMayuscula) {
      setError('La contraseña debe tener al menos una mayúscula.');
      return;
    }

    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!tieneEspecial) {
      setError('La contraseña debe tener al menos un carácter especial (!@#$%...).');
      return;
    }

    try {
      if (isRegistro) {
        await axios.post(`${URL_BACK}/auth/sign-up`, { email, password });
        setEsperandoConfirmacion(true);
        return;
      }
      const response = await axios.post(`${URL_BACK}/auth/sign-in`, { email, password });
      localStorage.setItem('token', response.data.token);
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
    <div style={styles.screen}>
      <div style={styles.card}>
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
              />
            </div>

            <button style={styles.btn} onClick={handleSubmit}>
              {isRegistro ? 'Registrarse' : 'Ingresar'}
            </button>

            <div style={styles.toggle}>
              {isRegistro ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}
              <span
                style={styles.link}
                onClick={() => { setIsRegistro(!isRegistro); setError(''); }}
              >
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
  screen: { minHeight: '100vh', background: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  card: { background: 'white', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  logo: { textAlign: 'center', marginBottom: '20px' },
  logoName: { fontSize: '20px', fontWeight: '600', color: '#1A3A5C' },
  logoSub: { fontSize: '13px', color: '#64748b', marginTop: '4px' },
  divider: { border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '20px' },
  error: { background: '#fef2f2', color: '#dc2626', fontSize: '13px', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px' },
  info: { background: '#eff6ff', color: '#2563A8', fontSize: '13px', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '6px' },
  input: { width: '100%', fontSize: '13px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '11px', background: '#1A3A5C', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' },
  toggle: { textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '16px' },
  link: { color: '#2563A8', cursor: 'pointer', fontWeight: '500' },
};

export default Login;