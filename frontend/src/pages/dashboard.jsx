import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getVotes } from '../services/api';
import '../css/dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [username] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user'))?.username; } catch { return null; }
  });
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const apiBase = localStorage.getItem('API_BASE') || 'http://localhost:5000/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const res = await getVotes(token);
        const rows = Array.isArray(res.data) ? res.data : res.data?.rows || [];
        setVotes(rows.slice(0, 6)); // show latest few
      } catch (e) {
        setErr('Could not load recent votes.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dash-wrap">
      <header className="dash-header">
        <div className="brand">
          <div className="logo" aria-hidden="true">🗳️</div>
          <div>
            <h1 className="title">EduVote Dashboard</h1>
            <p className="subtitle">Manage your voting actions and view your activity</p>
          </div>
        </div>
        <div className="session">
          <span className="badge">{username || 'Signed in'}</span>
          <button className="ghost-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="dash-grid">
        <div className="card highlight">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button className="primary-btn" onClick={() => navigate('/vote')}>Cast a Vote</button>
            <Link to="/register" className="link-btn">Create another account</Link>
          </div>
          <div className="muted">API: <span className="code">{apiBase}</span></div>
        </div>

        <div className="card stat">
          <div className="stat-value">{votes.length}</div>
          <div className="stat-label">Recent Votes</div>
          <div className="muted small">Showing latest records</div>
        </div>

        <div className="card info">
          <h3>Tips</h3>
          <ul className="tips">
            <li>Use the <span className="code">API_BASE</span> switch (from the header section we built earlier) to point to dev or prod.</li>
            <li>Ensure you have valid <span className="code">CandidateId</span> & <span className="code">ElectionId</span> before voting.</li>
            <li>Admin users can be used to manage data (if you add admin screens later).</li>
          </ul>
        </div>
      </section>

      <section className="card table-card">
        <div className="table-head">
          <h3>Recent Votes</h3>
          <button className="ghost-btn" onClick={() => window.location.reload()}>Refresh</button>
        </div>
        {loading ? (
          <div className="muted">Loading…</div>
        ) : err ? (
          <div className="alert">{err}</div>
        ) : votes.length === 0 ? (
          <div className="muted">No votes yet. Cast your first vote!</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>UserId</th>
                  <th>CandidateId</th>
                  <th>ElectionId</th>
                </tr>
              </thead>
              <tbody>
                {votes.map(v => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.UserId}</td>
                    <td>{v.CandidateId}</td>
                    <td>{v.ElectionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
