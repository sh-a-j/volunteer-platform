import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'VOLUNTEER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await registerUser(form);
      if (res.data.success) {
        setSuccess('Registration successful! Redirecting to login…');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(res.data.message);
      }
    } catch {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="auth-logo">◈</div>
          <h1>Join VolunteerHub</h1>
          <p>Create your account and start making a difference</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Choose a strong password"
              required
            />
          </div>
          <div className="form-group">
            <label>I am joining as</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="VOLUNTEER">Volunteer</option>
              <option value="ORGANIZER">Event Organizer (NGO/Host)</option>
            </select>
          </div>

          <div className="role-pills">
            <div
              className={`role-pill ${form.role === 'VOLUNTEER' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'VOLUNTEER' })}
            >
              <span className="role-pill-icon">🙋</span>
              <span className="role-pill-label">Volunteer</span>
              <span className="role-pill-desc">Browse & join events</span>
            </div>
            <div
              className={`role-pill ${form.role === 'ORGANIZER' ? 'active' : ''}`}
              onClick={() => setForm({ ...form, role: 'ORGANIZER' })}
            >
              <span className="role-pill-icon">🏢</span>
              <span className="role-pill-label">Organizer</span>
              <span className="role-pill-desc">Post & manage events</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in →</Link>
        </div>
      </div>
    </div>
  );
}
