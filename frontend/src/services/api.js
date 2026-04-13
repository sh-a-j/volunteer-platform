import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
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
