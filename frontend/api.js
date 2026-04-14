import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// BASE URL LOGIC:
//   Development (npm run dev):  calls http://localhost:8080 directly
//   Docker (nginx):             calls /api/... which nginx proxies to backend:8080
//
// The VITE_API_URL env variable controls this:
//   - Not set (local dev) → falls back to 'http://localhost:8080'
//   - Set to '/api' in Docker build → uses nginx proxy
// ─────────────────────────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth ────────────────────────────────────────────
export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);
export const updateAvailability = (userId, data) => API.put(`/users/${userId}/availability`, data);

// ─── Events ──────────────────────────────────────────
export const createEvent = (data) => API.post('/events', data);
export const getAllEvents = () => API.get('/events');
export const getEventsByOrganizer = (id) => API.get(`/events/organizer/${id}`);
export const getEventById = (id) => API.get(`/events/${id}`);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// ─── Enrollments ─────────────────────────────────────
export const enrollInEvent = (data) => API.post('/enroll', data);
export const getEnrollmentsByUser = (userId) => API.get(`/enroll/user/${userId}`);
export const getEnrollmentsByEvent = (eventId) => API.get(`/enroll/event/${eventId}`);
export const updateEnrollmentStatus = (id, status) => API.put(`/enroll/${id}`, { status });

export default API;
