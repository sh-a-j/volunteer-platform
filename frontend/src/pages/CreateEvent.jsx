import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getEventById } from '../services/api';
import './CreateEvent.css';

const initialForm = {
  title: '', description: '', date: '', time: '',
  duration: '', location: '', skills: '', maxVolunteers: '',
};

export default function CreateEvent({ editMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode && id) {
      getEventById(id).then(res => {
        const e = res.data;
        setForm({
          title: e.title, description: e.description, date: e.date,
          time: e.time, duration: e.duration, location: e.location,
          skills: e.skills, maxVolunteers: e.maxVolunteers,
        });
      });
    }
  }, [editMode, id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, maxVolunteers: parseInt(form.maxVolunteers), organizerId: user.id };
      if (editMode) await updateEvent(id, payload);
      else await createEvent(payload);
      navigate('/organizer');
    } catch (err) {
      setError('Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <h1>{editMode ? '✏️ Edit Event' : '✨ Create New Event'}</h1>
        <p>{editMode ? 'Update the event details below' : 'Fill in the details to post a new volunteering opportunity'}</p>
      </div>

      <div className="create-event-layout">
        <form className="create-event-form card" onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-section">
            <div className="form-section-title">Basic Info</div>
            <div className="form-group">
              <label>Event Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Beach Cleanup Drive" required />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe what volunteers will be doing, what to bring, etc."
                rows={4} required />
            </div>
            <div className="form-group">
              <label>Required Skills</label>
              <input name="skills" value={form.skills} onChange={handleChange}
                placeholder="e.g. Communication, Physical Fitness, Teaching (comma-separated)" />
            </div>
          </div>

          <div className="divider" />

          <div className="form-section">
            <div className="form-section-title">Schedule & Location</div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Date *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input type="time" name="time" value={form.time} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Duration</label>
                <input name="duration" value={form.duration} onChange={handleChange}
                  placeholder="e.g. 2 hours, Half day" />
              </div>
              <div className="form-group">
                <label>Max Volunteers *</label>
                <input type="number" name="maxVolunteers" value={form.maxVolunteers}
                  onChange={handleChange} placeholder="e.g. 20" min="1" required />
              </div>
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. Marine Drive, Mumbai or Online (Zoom)" required />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/organizer')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : (editMode ? '💾 Save Changes' : '🚀 Publish Event')}
            </button>
          </div>
        </form>

        <div className="create-event-tips">
          <div className="card tips-card">
            <h3>💡 Tips for a great event</h3>
            <ul>
              <li>Be specific about what volunteers will do</li>
              <li>List required skills clearly so suitable volunteers apply</li>
              <li>Mention what volunteers should bring or wear</li>
              <li>Include exact meeting point / online link in description</li>
              <li>Set a realistic volunteer count</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
