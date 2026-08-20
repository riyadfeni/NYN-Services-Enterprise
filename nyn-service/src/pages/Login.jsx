import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, resetPassword } from '../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setError('Enter your email above first, then click "Forgot password?"');
      return;
    }
    try {
      await resetPassword(email);
      setInfo('Password reset email sent.');
      setError('');
    } catch (err) {
      setError('Could not send reset email. Check the address and try again.');
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src="/logo.jpg" alt="NYN Services" />
        <h2 style={{ marginTop: 0 }}>Login</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {info && <div className="alert alert-success">{info}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
          </div>
          <div className="field" style={{ marginBottom: 16 }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn" type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
        <p style={{ marginTop: 14, fontSize: 13 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); handleReset(); }}>Forgot password?</a>
        </p>
      </div>
    </div>
  );
}
