import React, { useEffect, useState } from 'react';
import { castVote } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../css/vote.css'; // styles below

function Vote() {
  const navigate = useNavigate();
  const [candidateId, setCandidateId] = useState('');
  const [electionId, setElectionId] = useState(() => localStorage.getItem('last_election_id') || '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/'); // guard route
  }, [navigate]);

  const handleVote = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    const cand = candidateId.trim();
    const elect = electionId.trim();
    if (!cand || !elect) {
      setMsg({ type: 'error', text: 'Candidate ID and Election ID are required.' });
      return;
    }

    setBusy(true);
    try {
      const token = localStorage.getItem('token');
      await castVote({ candidateId: cand, electionId: elect }, token);
      setMsg({ type: 'success', text: 'Vote submitted successfully!' });
      localStorage.setItem('last_election_id', elect);
      setCandidateId('');
    } catch (err) {
      const apiErr = err?.response?.data?.error || 'Voting failed. Please verify IDs and try again.';
      setMsg({ type: 'error', text: apiErr });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="vote-wrap">
      <div className="vote-card">
        <div className="vote-head">
          <div className="logo" aria-hidden="true">🗳️</div>
          <div>
            <h1 className="title">Cast Your Vote</h1>
            <p className="subtitle">Submit a ballot for an active election</p>
          </div>
        </div>

        {msg.text && (
          <div className={`banner ${msg.type === 'success' ? 'ok' : 'err'}`}>
            {msg.text}
          </div>
        )}

        <form className="form" onSubmit={handleVote} noValidate>
          <label className="label" htmlFor="candidateId">Candidate ID</label>
          <input
            id="candidateId"
            className="input"
            placeholder="Enter Candidate ID (e.g., 3)"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            required
            inputMode="numeric"
            pattern="[0-9]*"
          />

          <label className="label" htmlFor="electionId">Election ID</label>
          <div className="row">
            <input
              id="electionId"
              className="input"
              placeholder="Enter Election ID (e.g., 1)"
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
              required
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <button
              type="button"
              className="ghost-btn"
              onClick={() => setElectionId(localStorage.getItem('last_election_id') || '')}
              title="Use last election"
            >
              Use last
            </button>
          </div>

          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? 'Submitting…' : 'Cast Vote'}
          </button>

          <p className="hint">
            Need candidates or elections? Ask an admin to provide valid IDs.
          </p>
        </form>

        <div className="tips">
          <div className="tip">
            ✅ You can change the API base via your app header if you added that control.
          </div>
          <div className="tip">
            🔒 Make sure you’re logged in; this endpoint requires a valid token.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vote;
