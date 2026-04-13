import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateEvent from './pages/CreateEvent';
import EventList from './pages/EventList';
import MyEvents from './pages/MyEvents';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'ORGANIZER') return <Navigate to="/organizer" />;
  return <Navigate to="/events" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/organizer" element={
          <PrivateRoute role="ORGANIZER">
            <Navbar /><OrganizerDashboard />
          </PrivateRoute>
        } />
        <Route path="/create-event" element={
          <PrivateRoute role="ORGANIZER">
            <Navbar /><CreateEvent />
          </PrivateRoute>
        } />
        <Route path="/edit-event/:id" element={
          <PrivateRoute role="ORGANIZER">
            <Navbar /><CreateEvent editMode />
          </PrivateRoute>
        } />
        <Route path="/events" element={
          <PrivateRoute role="VOLUNTEER">
            <Navbar /><EventList />
          </PrivateRoute>
        } />
        <Route path="/my-events" element={
          <PrivateRoute role="VOLUNTEER">
            <Navbar /><MyEvents />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
