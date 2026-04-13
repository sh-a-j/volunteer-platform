import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-text">VolunteerHub</span>
        </Link>

        <div className="navbar-links">
          {user?.role === 'ORGANIZER' && (
            <>
              <Link to="/organizer" className={`nav-link ${isActive('/organizer') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/create-event" className={`nav-link ${isActive('/create-event') ? 'active' : ''}`}>
                + New Event
              </Link>
            </>
          )}
          {user?.role === 'VOLUNTEER' && (
            <>
              <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`}>
                Browse Events
              </Link>
              <Link to="/my-events" className={`nav-link ${isActive('/my-events') ? 'active' : ''}`}>
                My Events
              </Link>
            </>
          )}
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-meta">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
