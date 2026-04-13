import { useState, useEffect } from 'react';
import { getEnrollmentsByUser } from '../services/api';
import './MyEvents.css';

export default function MyEvents() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMyEvents(); }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const res = await getEnrollmentsByUser(user.id);
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusCounts = {
    PENDING: enrollments.filter(e => e.enrollment.status === 'PENDING').length,
    ACCEPTED: enrollments.filter(e => e.enrollment.status === 'ACCEPTED').length,
    REJECTED: enrollments.filter(e => e.enrollment.status === 'REJECTED').length,
  };

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <h1>My Events</h1>
        <p>Track your enrollments and application statuses</p>
      </div>

      <div className="stats-row" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--yellow)' }}>{statusCounts.PENDING}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--green)' }}>{statusCounts.ACCEPTED}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--red)' }}>{statusCounts.REJECTED}</div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{enrollments.length}</div>
          <div className="stat-label">Total Applied</div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><div className="spinner" style={{ width: 36, height: 36 }} /></div>
      ) : enrollments.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🙋</div>
          <h3>No enrollments yet</h3>
          <p>Browse events and enroll to see them here</p>
        </div>
      ) : (
        <div className="my-events-list">
          {enrollments.map(({ enrollment, event }) => (
            <div key={enrollment.id} className={`my-event-card card status-${enrollment.status.toLowerCase()}`}>
              <div className="my-event-left">
                <div className={`status-indicator status-${enrollment.status.toLowerCase()}`} />
              </div>
              <div className="my-event-content">
                <div className="my-event-header">
                  <h3>{event?.title || 'Event'}</h3>
                  <span className={`badge badge-${enrollment.status.toLowerCase()}`}>
                    {enrollment.status}
                  </span>
                </div>
                {event && (
                  <>
                    <p className="event-browse-desc">{event.description}</p>
                    <div className="event-meta-row">
                      <span className="meta-chip">📅 {event.date}</span>
                      <span className="meta-chip">⏰ {event.time}</span>
                      <span className="meta-chip">⌛ {event.duration}</span>
                      <span className="meta-chip">📍 {event.location}</span>
                    </div>
                    {event.skills && (
                      <div className="skills-row" style={{ marginTop: 8 }}>
                        {event.skills.split(',').map(s => (
                          <span key={s} className="skill-tag">{s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="my-event-status-msg">
                {enrollment.status === 'PENDING' && (
                  <div className="status-msg pending">
                    <span>⏳</span>
                    <span>Awaiting<br/>review</span>
                  </div>
                )}
                {enrollment.status === 'ACCEPTED' && (
                  <div className="status-msg accepted">
                    <span>✓</span>
                    <span>You're<br/>in!</span>
                  </div>
                )}
                {enrollment.status === 'REJECTED' && (
                  <div className="status-msg rejected">
                    <span>✗</span>
                    <span>Not<br/>selected</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
