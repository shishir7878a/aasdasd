import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'voter',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pwdScore = getPasswordScore(form.password);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required.');
      return;
    }
    setBusy(true);
    try {

      await registerUser({ username: form.username.trim(), password: form.password, role: form.role });
      console.log(registerUser)
      alert('Registered successfully');
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed. Try a different username.');
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
            <h1 className="title">Create your account</h1>
            <p className="subtitle">Join the voting platform</p>
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="label" htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            className="input"
            placeholder="e.g. johndoe"
            value={form.username}
            onChange={onChange}
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
              value={form.password}
              onChange={onChange}
              required
              autoComplete="new-password"
              minLength={6}
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

          <PasswordMeter score={pwdScore} />

          <label className="label" htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            className="input"
            value={form.role}
            onChange={onChange}
          >
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
          </select>

          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Register'}
          </button>

          <p className="hint">
            Already have an account? <a href="/">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}

function PasswordMeter({ score }) {
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div className="meter">
      <div className={`bar ${score >= 1 ? 'on' : ''}`} />
      <div className={`bar ${score >= 2 ? 'on' : ''}`} />
      <div className={`bar ${score >= 3 ? 'on' : ''}`} />
      <span className={`meter-label s${score}`}>{labels[Math.max(0, score - 1)]}</span>
    </div>
  );
}

function getPasswordScore(pwd) {
  // Simple heuristic: 1..4
  let score = 0;
  if (pwd.length >= 6) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
  if (pwd.length >= 10) score++;
  return Math.min(score, 4);
}

export default Register;
