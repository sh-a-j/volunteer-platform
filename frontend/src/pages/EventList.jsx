import { useState, useEffect } from 'react';
import { getAllEvents, enrollInEvent, updateAvailability } from '../services/api';
import './EventList.css';

export default function EventList() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});
  const [enrolled, setEnrolled] = useState({});
  const [msg, setMsg] = useState({});
  const [filters, setFilters] = useState({ date: '', duration: '', skills: '' });
  const [showAvail, setShowAvail] = useState(false);
  const [avail, setAvail] = useState({
    availabilityDays: user.availabilityDays || '',
    availabilityTime: user.availabilityTime || '',
  });
  const [availMsg, setAvailMsg] = useState('');

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    let result = [...events];
    if (filters.date) result = result.filter(e => e.date === filters.date);
    if (filters.duration) result = result.filter(e =>
      e.duration?.toLowerCase().includes(filters.duration.toLowerCase()));
    if (filters.skills) result = result.filter(e =>
      e.skills?.toLowerCase().includes(filters.skills.toLowerCase()));
    setFiltered(result);
  }, [filters, events]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getAllEvents();
      setEvents(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (eventId) => {
    setEnrolling(prev => ({ ...prev, [eventId]: true }));
    try {
      const res = await enrollInEvent({ userId: user.id, eventId });
      if (res.data.success) {
        setEnrolled(prev => ({ ...prev, [eventId]: true }));
        setMsg(prev => ({ ...prev, [eventId]: { type: 'success', text: 'Enrolled! Pending organizer approval.' } }));
      } else {
        setMsg(prev => ({ ...prev, [eventId]: { type: 'error', text: res.data.message } }));
      }
    } catch {
      setMsg(prev => ({ ...prev, [eventId]: { type: 'error', text: 'Enrollment failed.' } }));
    } finally {
      setEnrolling(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleSaveAvail = async () => {
    try {
      const res = await updateAvailability(user.id, avail);
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAvailMsg('Availability saved!');
        setTimeout(() => setAvailMsg(''), 3000);
      }
    } catch { setAvailMsg('Failed to save.'); }
  };

  const clearFilters = () => setFilters({ date: '', duration: '', skills: '' });

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <h1>Browse Events</h1>
        <p>Find micro-volunteering opportunities that match your availability</p>
      </div>

      {/* Availability Panel */}
      <div className="avail-banner card" onClick={() => setShowAvail(!showAvail)}>
        <span>🗓 Set your availability</span>
        <span className="avail-toggle">{showAvail ? '▲' : '▼'}</span>
      </div>
      {showAvail && (
        <div className="card avail-panel fade-in">
          <div className="form-row-2">
            <div className="form-group">
              <label>Available Days</label>
              <input
                value={avail.availabilityDays}
                onChange={e => setAvail({ ...avail, availabilityDays: e.target.value })}
                placeholder="e.g. Mon, Wed, Sat"
              />
            </div>
            <div className="form-group">
              <label>Available Time Slot</label>
              <input
                value={avail.availabilityTime}
                onChange={e => setAvail({ ...avail, availabilityTime: e.target.value })}
                placeholder="e.g. Morning (9AM-1PM)"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="btn btn-primary btn-sm" onClick={handleSaveAvail}>Save Availability</button>
            {availMsg && <span style={{ fontSize: '13px', color: 'var(--green)' }}>{availMsg}</span>}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar card">
        <div className="filter-item">
          <label>Filter by Date</label>
          <input type="date" value={filters.date}
            onChange={e => setFilters({ ...filters, date: e.target.value })} />
        </div>
        <div className="filter-item">
          <label>Duration</label>
          <input value={filters.duration} placeholder="e.g. 2 hours"
            onChange={e => setFilters({ ...filters, duration: e.target.value })} />
        </div>
        <div className="filter-item">
          <label>Skills</label>
          <input value={filters.skills} placeholder="e.g. Teaching"
            onChange={e => setFilters({ ...filters, skills: e.target.value })} />
        </div>
        <button className="btn btn-secondary btn-sm" onClick={clearFilters}>Clear</button>
      </div>

      <div className="results-count">
        {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
      </div>

      {loading ? (
        <div className="empty-state"><div className="spinner" style={{ width: 36, height: 36 }} /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No events found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid-2">
          {filtered.map(event => (
            <div key={event.id} className="event-browse-card card">
              <div className="event-browse-header">
                <h3>{event.title}</h3>
                <span className="meta-chip">👥 {event.maxVolunteers} spots</span>
              </div>
              <p className="event-browse-desc">{event.description}</p>
              <div className="event-meta-row" style={{ marginBottom: 12 }}>
                <span className="meta-chip">📅 {event.date}</span>
                <span className="meta-chip">⏰ {event.time}</span>
                <span className="meta-chip">⌛ {event.duration}</span>
                <span className="meta-chip">📍 {event.location}</span>
              </div>
              {event.skills && (
                <div className="skills-row" style={{ marginBottom: 16 }}>
                  {event.skills.split(',').map(s => (
                    <span key={s} className="skill-tag">{s.trim()}</span>
                  ))}
                </div>
              )}
              {msg[event.id] && (
                <div className={`alert alert-${msg[event.id].type === 'success' ? 'success' : 'error'}`}
                  style={{ marginBottom: 12 }}>
                  {msg[event.id].text}
                </div>
              )}
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => handleEnroll(event.id)}
                disabled={enrolling[event.id] || enrolled[event.id]}
              >
                {enrolling[event.id] ? <span className="spinner" /> :
                  enrolled[event.id] ? '✓ Enrolled' : '🙋 Enroll Now'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
