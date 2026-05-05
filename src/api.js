// ============================================
//  API SERVICE
//  Single file that handles all backend calls
//  Change BASE_URL here if port changes
// ============================================

const BASE_URL = 'http://localhost:5001/api';

// ── Token helpers ─────────────────────────────

export function saveToken(token) {
  localStorage.setItem('edu_token', token);
}

export function getToken() {
  return localStorage.getItem('edu_token');
}

export function saveUser(user) {
  localStorage.setItem('edu_user', JSON.stringify(user));
}

export function getUser() {
  const u = localStorage.getItem('edu_user');
  return u ? JSON.parse(u) : null;
}

export function clearSession() {
  localStorage.removeItem('edu_token');
  localStorage.removeItem('edu_user');
}

export function isLoggedIn() {
  return !!getToken();
}

// ── Core fetch wrapper ────────────────────────

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token   = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res  = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}

const get    = (path)        => request('GET',   path);
const post   = (path, body)  => request('POST',  path, body);
const patch  = (path, body)  => request('PATCH', path, body);

// ── Auth ──────────────────────────────────────

export const auth = {
  login: (identifier, password, role) =>
    post('/auth/login', { identifier, password, role }),
  me: () => get('/auth/me'),
};

// ── Leaves ────────────────────────────────────

export const leaves = {
  getMine:      ()           => get('/leaves'),
  apply:        (data)       => post('/leaves', data),
  getPending:   ()           => get('/leaves/pending'),
  review:       (id, data)   => patch(`/leaves/${id}`, data),
};

// ── Hostel leaves ─────────────────────────────

export const hostelLeaves = {
  getMine:      ()           => get('/hostel'),
  apply:        (data)       => post('/hostel', data),
  getPending:   ()           => get('/hostel/pending'),
  review:       (id, data)   => patch(`/hostel/${id}`, data),
};

// ── Attendance ────────────────────────────────

export const attendance = {
  getMine:   ()      => get('/attendance/me'),
  mark:      (data)  => post('/attendance', data),
  summary:   ()      => get('/attendance/summary'),
};

// ── Marks ─────────────────────────────────────

export const marks = {
  getMine:        ()           => get('/marks/me'),
  upsert:         (data)       => post('/marks', data),
  getForSubject:  (subjectId)  => get(`/marks/subject/${subjectId}`),
};

// ── Students ──────────────────────────────────

export const students = {
  getAll: () => get('/students'),
  getBySubject: (subjectCode) => get(`/students/subject/${subjectCode}`),
  add: (data) => post('/students', data),
};

// ── Notices ───────────────────────────────────

export const notices = {
  getAll: ()      => get('/notices'),
  post:   (data)  => post('/notices', data),
};