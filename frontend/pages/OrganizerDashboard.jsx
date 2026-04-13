import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEventsByOrganizer, deleteEvent, getEnrollmentsByEvent, updateEnrollmentStatus } from '../services/api';
import './OrganizerDashboard.css';

export default function OrganizerDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [volunteers, setVolunteers] = useState({});
  const [loadingVols, setLoadingVols] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEventsByOrganizer(user.id);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    await deleteEvent(id);
    setEvents(events.filter(e => e.id !== id));
  };

  const toggleVolunteers = async (eventId) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
      return;
    }
    setExpandedEvent(eventId);
    if (!volunteers[eventId]) {
      setLoadingVols(prev => ({ ...prev, [eventId]: true }));
      try {
        const res = await getEnrollmentsByEvent(eventId);
        setVolunteers(prev => ({ ...prev, [eventId]: res.data }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingVols(prev => ({ ...prev, [eventId]: false }));
      }
    }
  };

  const handleStatusChange = async (enrollmentId, status, eventId) => {
    try {
      await updateEnrollmentStatus(enrollmentId, status);
      const res = await getEnrollmentsByEvent(eventId);
      setVolunteers(prev => ({ ...prev, [eventId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    total: events.length,
    totalVolunteers: Object.values(volunteers).reduce((a, v) => a + v.length, 0),
  };

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <h1>Organizer Dashboard</h1>
        <p>Manage your events and volunteers, {user.name}</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.values(volunteers).flat().length}</div>
          <div className="stat-label">Enrollments Loaded</div>
        </div>
        <div className="stat-card accent">
          <Link to="/create-event" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            + Create New Event
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="empty-state"><div className="spinner" style={{ width: 36, height: 36 }} /></div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No events yet</h3>
          <p>Create your first event to get started</p>
          <br />
          <Link to="/create-event" className="btn btn-primary">+ Create Event</Link>
        </div>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} className="event-card card">
              <div className="event-card-header">
                <div className="event-card-info">
                  <h3>{event.title}</h3>
                  <div className="event-meta-row">
                    <span className="meta-chip">📅 {event.date}</span>
                    <span className="meta-chip">⏰ {event.time}</span>
                    <span className="meta-chip">⌛ {event.duration}</span>
                    <span className="meta-chip">📍 {event.location}</span>
                    <span className="meta-chip">👥 Max {event.maxVolunteers}</span>
                  </div>
                  {event.skills && (
                    <div className="skills-row">
                      {event.skills.split(',').map(s => (
                        <span key={s} className="skill-tag">{s.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="event-card-actions">
                  <Link to={`/edit-event/${event.id}`} className="btn btn-secondary btn-sm">
                    ✏️ Edit
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event.id)}>
                    🗑 Delete
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleVolunteers(event.id)}
                  >
                    {expandedEvent === event.id ? '▲ Hide' : '👥 Volunteers'}
                  </button>
                </div>
              </div>

              {expandedEvent === event.id && (
                <div className="volunteers-panel">
                  <div className="divider" />
                  <h4>Enrolled Volunteers</h4>
                  {loadingVols[event.id] ? (
                    <div style={{ padding: '16px 0' }}><span className="spinner" /></div>
                  ) : !volunteers[event.id] || volunteers[event.id].length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No volunteers enrolled yet.</p>
                  ) : (
                    <table className="vol-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Availability</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {volunteers[event.id].map(({ enrollment, user: vol }) => (
                          <tr key={enrollment.id}>
                            <td>{vol?.name || '—'}</td>
                            <td>{vol?.email || '—'}</td>
                            <td>
                              {vol?.availabilityDays
                                ? `${vol.availabilityDays} · ${vol.availabilityTime || 'Any'}`
                                : '—'}
                            </td>
                            <td>
                              <span className={`badge badge-${enrollment.status.toLowerCase()}`}>
                                {enrollment.status}
                              </span>
                            </td>
                            <td>
                              {enrollment.status === 'PENDING' && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleStatusChange(enrollment.id, 'ACCEPTED', event.id)}
                                  >
                                    ✓ Accept
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleStatusChange(enrollment.id, 'REJECTED', event.id)}
                                  >
                                    ✗ Reject
                                  </button>
                                </div>
                              )}
                              {enrollment.status !== 'PENDING' && (
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                  Decision made
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
