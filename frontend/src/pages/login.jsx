import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../css/login.css'; // reuse the same CSS as Register (or use Login.css from below)

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState(localStorage.getItem('remember_username') || '');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(!!localStorage.getItem('remember_username'));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }
    setBusy(true);
    try {
      const res = await loginUser({ username: username.trim(), password });
      const token = res?.data?.token;
      if (!token) throw new Error('No token returned by server.');
      localStorage.setItem('token', token);

      if (remember) {
        localStorage.setItem('remember_username', username.trim());
      } else {
        localStorage.removeItem('remember_username');
      }

      alert('Login successful');
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="reg-wrap">
      <div className="reg-card">
        <div className="reg-brand">
          <div className="logo" aria-hidden="true">🗳️</div>
          <div>
            <h1 className="title">Welcome back</h1>
            <p className="subtitle">Sign in to your account</p>
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        <form className="form" onSubmit={onSubmit} noValidate>
          <label className="label" htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            className="input"
            placeholder="e.g. johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />

          <label className="label" htmlFor="password">Password</label>
          <div className="pwd-row">
            <input
              id="password"
              name="password"
              className="input pwd"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setShowPwd((s) => !s)}
              aria-label={showPwd ? 'Hide password' : 'Show password'}
              title={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            {/* Hook up when you implement recovery */}
            <button
              type="button"
              className="link-button"
              onClick={() => alert('Forgot password not implemented.')}
            >
              Forgot password?
            </button>

          </div>

          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Login'}
          </button>

          <p className="hint" style={{ marginTop: 10 }}>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
