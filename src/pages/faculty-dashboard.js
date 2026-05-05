// ============================================
//  FACULTY DASHBOARD
//  Sections: Overview, Mark Attendance,
//  Attendance Records, Enter Marks,
//  Class Reports, Announcements, Profile
// ============================================

import INSTITUTION from '../../config/institution.js';
import { auth, attendance, marks, notices, students, isLoggedIn } from '../api.js';

// ── Live Data ─────────────────────────────────

let FACULTY = {
  name: 'Loading...',
  initials: '..',
  department: '',
  designation: 'Faculty',
  employeeId: '',
  email: '',
  phone: '',
  subjects: [],
};

// These will be loaded from API (or mocked if backend endpoints are missing)
let CLASS_STUDENTS = [];
let MARKS_STORE = {};
let ATT_HISTORY = {};
let ANNOUNCEMENTS = [];

async function loadAllData() {
  try {
    const profileRes = await auth.me().catch(() => null);
    
    if (profileRes) {
      FACULTY = {
        name: profileRes.name || 'Faculty',
        initials: (profileRes.name || 'F').split(' ').map(w => w[0]).join(''),
        department: profileRes.department || 'General',
        designation: profileRes.designation || 'Faculty',
        employeeId: profileRes.employee_id || '',
        email: profileRes.email || '',
        phone: profileRes.phone || '',
        // Use subjects from API if available, otherwise stub
        subjects: profileRes.subjects && profileRes.subjects.length > 0 ? profileRes.subjects : [
          { code: 'CS301', name: 'Data Structures',       sem: 5, section: 'A', students: 10 },
          { code: 'CS302', name: 'Operating Systems',      sem: 5, section: 'A', students: 10 },
          { code: 'CS401', name: 'Algorithm Design',       sem: 7, section: 'B', students: 10 },
        ],
      };
    }

    // Load class students for the first subject by default
    let defaultSubject = FACULTY.subjects.length > 0 ? FACULTY.subjects[0].code : 'CS301';
    const studentsRes = await students.getBySubject(defaultSubject).catch(() => []);
    if (studentsRes.length) {
      CLASS_STUDENTS = studentsRes.map(s => ({
        id: s.id,
        name: s.name,
        roll: s.roll_number,
        attendance: s.attendance || 80
      }));
    } else {
      // Fallback
      CLASS_STUDENTS = [
        { id: 1,  name: 'Arjun Singh',     roll: 'CS2023001', attendance: 84 },
        { id: 2,  name: 'Priya Nair',      roll: 'CS2023014', attendance: 91 },
      ];
    }

    MARKS_STORE = {
      CS301: [
        { id:1,  internal: 28, external: 71 }, { id:2,  internal: 29, external: 85 },
        { id:3,  internal: 22, external: 65 }, { id:4,  internal: 25, external: 70 },
        { id:5,  internal: 27, external: 80 }, { id:6,  internal: 18, external: 52 },
        { id:7,  internal: 30, external: 90 }, { id:8,  internal: 24, external: 68 },
        { id:9,  internal: 26, external: 75 }, { id:10, internal: 29, external: 88 },
      ]
    };

    ATT_HISTORY = {
      CS301: [
        { date: 'Apr 25', present: [1,2,4,5,7,8,9,10],    absent: [3,6]    },
        { date: 'Apr 23', present: [1,2,3,5,7,9,10],       absent: [4,6,8]  },
      ]
    };

    const noticesRes = await notices.getAll().catch(() => []);
    if (noticesRes.length) {
      ANNOUNCEMENTS = noticesRes.map(n => ({
        id: 'A' + n.id,
        title: n.title,
        subject: n.tag || 'General',
        date: new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        to: 'All Students'
      }));
    }

  } catch (err) {
    console.error('Failed to load faculty data:', err);
  }
}

// ── Render ─────────────────────────────────────

export function renderFacultyDashboard() {
  if (!isLoggedIn()) {
    window.location.href = '/src/pages/login.html';
    return document.createElement('div');
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'sd-wrapper';

  wrapper.innerHTML = `
    <!-- SIDEBAR -->
    <aside class="sd-sidebar">
      <div class="sd-sidebar-top">
        <div class="sd-logo">
          <div class="sd-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5
              L3 10.26V15c0 3.31 4.03 6 9 6s9-2.69 9-6v-4.74L12 15.5z"/>
            </svg>
          </div>
          <div class="sd-logo-text">
            ${INSTITUTION.shortName}<span>Portal</span>
          </div>
        </div>

        <nav class="sd-nav">
          <div class="sd-nav-label">Main</div>
          ${navItem('overview',    'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',                                                                          'Overview')}
          ${navItem('attendance',  'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z','Mark Attendance')}
          ${navItem('records',     'M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z', 'Attendance Records')}
          ${navItem('marks',       'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',           'Enter Marks')}
          ${navItem('addStudent',  'M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', 'Add Student')}
          <div class="sd-nav-label" style="margin-top:8px">Reports</div>
          ${navItem('reports',     'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',           'Class Reports')}
          ${navItem('announce',    'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',                     'Announcements')}
          ${navItem('profile',     'M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',                     'My Profile')}
        </nav>
      </div>

      <div class="sd-sidebar-bottom">
        <div class="sd-user-card">
          <div class="sd-user-avatar">${FACULTY.initials}</div>
          <div class="sd-user-info">
            <div class="sd-user-name">${FACULTY.name}</div>
            <div class="sd-user-roll">${FACULTY.designation}</div>
          </div>
        </div>
        <a href="/src/pages/login.html" class="sd-logout">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58
            2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2
            2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Sign Out
        </a>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="sd-main">
      <header class="sd-topbar">
        <div class="sd-topbar-left">
          <div class="sd-page-title" id="pageTitle">Overview</div>
          <div class="sd-breadcrumb">
            ${INSTITUTION.name} &nbsp;/&nbsp;
            <span id="breadcrumbPage">Faculty Panel</span>
          </div>
        </div>
        <div class="sd-topbar-right">
          <div class="faculty-dept-pill">
            ${FACULTY.department} &nbsp;·&nbsp; ${FACULTY.employeeId}
          </div>
          <div class="sd-topbar-meta">
            <div class="sd-topbar-sem">Faculty Panel</div>
            <div class="sd-topbar-year">${INSTITUTION.academicYear}</div>
          </div>
        </div>
      </header>

      <div class="sd-content" id="sdContent"></div>
    </main>
  `;

  injectFacultyStyles();

  requestAnimationFrame(async () => {
    const content = wrapper.querySelector('#sdContent');
    if (content) content.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading dashboard...</div>';
    
    await loadAllData();
    initFaculty(wrapper);
  });

  return wrapper;
}

// ── Nav item helper ───────────────────────────

function navItem(id, iconPath, label) {
  return `
    <button class="sd-nav-item" data-page="${id}">
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="${iconPath}"/>
      </svg>
      <span>${label}</span>
    </button>
  `;
}

// ── Init ──────────────────────────────────────

function initFaculty(wrapper) {
  const navItems   = wrapper.querySelectorAll('.sd-nav-item');
  const content    = wrapper.querySelector('#sdContent');
  const pageTitle  = wrapper.querySelector('#pageTitle');
  const breadcrumb = wrapper.querySelector('#breadcrumbPage');

  const pages = {
    overview:   { title: 'Overview',           crumb: 'Dashboard',          render: renderOverview    },
    attendance: { title: 'Mark Attendance',     crumb: 'Mark Attendance',    render: renderMarkAttendance },
    records:    { title: 'Attendance Records',  crumb: 'Records',            render: renderRecords     },
    marks:      { title: 'Enter Marks',         crumb: 'Marks Entry',        render: renderMarksEntry  },
    addStudent: { title: 'Add New Student',     crumb: 'Add Student',        render: renderAddStudent  },
    reports:    { title: 'Class Reports',       crumb: 'Reports',            render: renderReports     },
    announce:   { title: 'Announcements',       crumb: 'Announcements',      render: renderAnnouncements },
    profile:    { title: 'My Profile',          crumb: 'Profile',            render: renderProfile     },
  };

  function navigate(pageId) {
    navItems.forEach(n => n.classList.remove('active'));
    wrapper.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');
    const page = pages[pageId];
    pageTitle.textContent  = page.title;
    breadcrumb.textContent = page.crumb;
    content.style.opacity   = '0';
    content.style.transform = 'translateY(8px)';
    setTimeout(() => {
      content.innerHTML = '';
      content.appendChild(page.render());
      content.style.opacity   = '1';
      content.style.transform = 'translateY(0)';
    }, 150);
  }

  navItems.forEach(btn =>
    btn.addEventListener('click', () => navigate(btn.dataset.page))
  );

  navigate('overview');
}

// ── ADD STUDENT ──────────────────────────────

function renderAddStudent() {
  const el = document.createElement('div');
  el.className = 'sd-card';
  el.style.maxWidth = '600px';
  el.style.margin = '0 auto';

  el.innerHTML = `
    <div class="sd-card-title" style="margin-bottom:20px">Register New Student</div>
    <form id="addStudentForm">
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input type="text" name="name" class="form-input" placeholder="e.g. Rahul Sharma" required />
      </div>
      <div class="form-group">
        <label class="form-label">Roll Number</label>
        <input type="text" name="roll_number" class="form-input" placeholder="e.g. CS2023055" required />
      </div>
      <div class="form-group">
        <label class="form-label">Email Address</label>
        <input type="email" name="email" class="form-input" placeholder="e.g. rahul@student.com" required />
      </div>
      <div class="sd-two-col" style="gap:16px">
        <div class="form-group">
          <label class="form-label">Semester</label>
          <input type="number" name="semester" class="form-input" value="1" min="1" max="8" required />
        </div>
        <div class="form-group">
          <label class="form-label">Batch</label>
          <input type="text" name="batch" class="form-input" value="2023-27" required />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Department</label>
        <select name="department_id" class="form-input" required>
          <option value="1">Computer Science</option>
          <option value="2">Electronics</option>
          <option value="3">Mechanical</option>
          <option value="4">Civil</option>
          <option value="5">Business Administration</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Password (Default)</label>
        <input type="text" name="password" class="form-input" value="password123" readonly />
        <div class="form-hint">Student can change this later.</div>
      </div>
      
      <button type="submit" class="btn btn-primary" id="addBtn" style="width:100%;margin-top:10px">
        Add Student to Portal
      </button>
      <div id="addMsg" style="margin-top:16px;display:none;padding:12px;border-radius:8px"></div>
    </form>
  `;

  const form = el.querySelector('#addStudentForm');
  const btn  = el.querySelector('#addBtn');
  const msg  = el.querySelector('#addMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Registering...';
    msg.style.display = 'none';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      await students.add(data);
      msg.textContent = '✨ Student successfully registered and Auth account created!';
      msg.style.backgroundColor = '#f0fdf4';
      msg.style.color = '#16a34a';
      msg.style.display = 'block';
      form.reset();
    } catch (err) {
      msg.textContent = '❌ Error: ' + err.message;
      msg.style.backgroundColor = '#fef2f2';
      msg.style.color = '#dc2626';
      msg.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Add Student to Portal';
    }
  });

  return el;
}

// ═══════════════════════════════════════════════
//  PAGE RENDERERS
// ═══════════════════════════════════════════════

// ── OVERVIEW ──────────────────────────────────

function renderOverview() {
  const el = document.createElement('div');
  const totalStudents = CLASS_STUDENTS.length;
  const avgAtt = Math.round(
    CLASS_STUDENTS.reduce((s, st) => s + st.attendance, 0) / totalStudents
  );
  const critical = CLASS_STUDENTS.filter(s => s.attendance < 75).length;

  el.innerHTML = `
    <div class="sd-welcome-bar">
      <div>
        <div class="sd-welcome-text">Good morning, Prof. ${FACULTY.name.split(' ')[1]} 👋</div>
        <div class="sd-welcome-sub">${FACULTY.designation} &nbsp;·&nbsp; ${FACULTY.department}</div>
      </div>
      <div class="sd-welcome-date">
        ${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
      </div>
    </div>

    <!-- STATS -->
    <div class="sd-stat-grid">
      ${fStat('Subjects Assigned', FACULTY.subjects.length,     'navy',
        'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
        'This semester')}
      ${fStat('Total Students',    totalStudents,                'gold',
        'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
        'Across all classes')}
      ${fStat('Avg. Attendance',   avgAtt + '%',                 avgAtt >= 75 ? 'success' : 'danger',
        'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
        'My classes')}
      ${fStat('Critical Students', critical,                     critical > 0 ? 'danger' : 'success',
        'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
        'Below 75%')}
    </div>

    <div class="sd-two-col">

      <!-- SUBJECTS -->
      <div class="sd-card">
        <div class="sd-card-header">
          <div class="sd-card-title">My Subjects</div>
          <span class="sd-card-tag">${INSTITUTION.academicYear}</span>
        </div>
        ${FACULTY.subjects.map(s => `
          <div class="subject-row">
            <div class="subject-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div class="subject-info">
              <div class="subject-name">${s.name}</div>
              <div class="subject-meta">${s.code} &nbsp;·&nbsp; Sem ${s.sem} Sec ${s.section} &nbsp;·&nbsp; ${s.students} students</div>
            </div>
            <span class="badge badge-info">Sem ${s.sem}</span>
          </div>
        `).join('')}
      </div>

      <!-- RIGHT COLUMN -->
      <div>

        <!-- STUDENT STATUS -->
        <div class="sd-card" style="margin-bottom:16px">
          <div class="sd-card-header">
            <div class="sd-card-title">Student Attendance Status</div>
            <span class="sd-card-tag">CS301</span>
          </div>
          ${CLASS_STUDENTS.map(s => `
            <div class="att-row">
              <div class="att-row-left">
                <div class="att-subject" style="font-size:13px">${s.name}</div>
                <div class="att-code">${s.roll}</div>
              </div>
              <div class="att-row-right">
                <div class="att-bar-wrap">
                  <div class="att-bar-fill" style="width:${s.attendance}%;background:${s.attendance>=75?'var(--success)':s.attendance>=60?'var(--warn)':'var(--danger)'}"></div>
                </div>
                <div class="att-percent" style="color:${s.attendance>=75?'var(--success)':s.attendance>=60?'var(--warn)':'var(--danger)'}">${s.attendance}%</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- RECENT ANNOUNCEMENTS -->
        <div class="sd-card">
          <div class="sd-card-header">
            <div class="sd-card-title">Recent Announcements</div>
          </div>
          ${ANNOUNCEMENTS.slice(0, 2).map(a => `
            <div class="announce-mini-row">
              <div class="amr-subject">${a.subject}</div>
              <div class="amr-title">${a.title}</div>
              <div class="amr-meta">${a.to} &nbsp;·&nbsp; ${a.date}</div>
            </div>
          `).join('')}
        </div>

      </div>
    </div>
  `;
  return el;
}

// ── MARK ATTENDANCE ───────────────────────────

function renderMarkAttendance() {
  const el = document.createElement('div');

  // State
  let selectedSubject = FACULTY.subjects[0].code;
  let attendance      = {}; // { studentId: 'present'|'absent' }
  let submitted       = false;

  // Pre-fill all as present
  CLASS_STUDENTS.forEach(s => { attendance[s.id] = 'present'; });

  function getSubject() {
    return FACULTY.subjects.find(s => s.code === selectedSubject);
  }

  function countPresent() {
    return Object.values(attendance).filter(v => v === 'present').length;
  }

  function rebuild() {
    el.innerHTML = '';
    el.appendChild(buildAttendanceForm());
  }

  function buildAttendanceForm() {
    const wrap = document.createElement('div');
    const sub  = getSubject();
    const today = new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

    wrap.innerHTML = `
      <!-- SUBJECT SELECTOR -->
      <div class="sd-card" style="margin-bottom:16px">
        <div class="att-form-header">
          <div>
            <div class="sd-card-title">Mark Attendance</div>
            <div style="font-size:13px;color:var(--text-muted);margin-top:4px">${today}</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <select class="form-input" id="subjectSelect" style="width:260px">
              ${FACULTY.subjects.map(s => `
                <option value="${s.code}" ${s.code === selectedSubject ? 'selected' : ''}>
                  ${s.name} (${s.code})
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- ATTENDANCE CARD -->
      <div class="sd-card">
        <div class="sd-card-header">
          <div>
            <div class="sd-card-title">${sub.name} — Sem ${sub.sem} Sec ${sub.section}</div>
            <div class="att-count-row" id="attCountRow">
              <span class="att-count-present" id="presentCount">${countPresent()} Present</span>
              <span class="att-count-sep">/</span>
              <span class="att-count-total">${CLASS_STUDENTS.length} Total</span>
              <span class="att-count-absent" id="absentCount">${CLASS_STUDENTS.length - countPresent()} Absent</span>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="bulk-btn bulk-present" id="markAllPresent">✓ All Present</button>
            <button class="bulk-btn bulk-absent"  id="markAllAbsent">✗ All Absent</button>
          </div>
        </div>

        <!-- STUDENT ROWS -->
        <div class="student-att-list" id="studentAttList">
          ${CLASS_STUDENTS.map(s => buildStudentRow(s, attendance)).join('')}
        </div>

        <!-- SUBMIT -->
        <div class="att-submit-row" id="submitRow">
          <button class="btn-att-submit" id="submitAttBtn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
            Submit Attendance
          </button>
          <span class="att-submit-note">
            This will be recorded for ${today}
          </span>
        </div>

        <!-- SUCCESS -->
        <div class="att-success" id="attSuccess" style="display:none">
          <div class="att-success-icon">✓</div>
          <div class="att-success-title">Attendance Submitted!</div>
          <div class="att-success-sub">
            ${countPresent()} present, ${CLASS_STUDENTS.length - countPresent()} absent recorded for ${sub.name} on ${today}.
          </div>
        </div>
      </div>
    `;

    // Subject change
    wrap.querySelector('#subjectSelect').addEventListener('change', async e => {
      selectedSubject = e.target.value;
      
      // FETCH NEW STUDENTS FOR THIS SUBJECT
      try {
        const res = await students.getBySubject(selectedSubject);
        CLASS_STUDENTS = res.map(s => ({
          id: s.id,
          name: s.name,
          roll: s.roll_number,
          attendance: s.attendance || 80
        }));
      } catch (err) {
        console.error('Failed to load students for subject:', err);
      }

      attendance = {};
      CLASS_STUDENTS.forEach(s => { attendance[s.id] = 'present'; });
      rebuild();
    });

    // Bulk buttons
    wrap.querySelector('#markAllPresent').addEventListener('click', () => {
      CLASS_STUDENTS.forEach(s => { attendance[s.id] = 'present'; });
      updateAllToggles(wrap);
      refreshCounts(wrap);
    });

    wrap.querySelector('#markAllAbsent').addEventListener('click', () => {
      CLASS_STUDENTS.forEach(s => { attendance[s.id] = 'absent'; });
      updateAllToggles(wrap);
      refreshCounts(wrap);
    });

    // Individual toggles
    wrap.querySelectorAll('.att-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid    = parseInt(btn.dataset.sid);
        const newVal = attendance[sid] === 'present' ? 'absent' : 'present';
        attendance[sid] = newVal;
        btn.className = `att-toggle ${newVal === 'present' ? 'att-present' : 'att-absent'}`;
        btn.textContent = newVal === 'present' ? 'Present' : 'Absent';
        const row = btn.closest('.student-att-row');
        row.className   = `student-att-row ${newVal === 'absent' ? 'row-absent' : ''}`;
        refreshCounts(wrap);
      });
    });

    // Submit
    wrap.querySelector('#submitAttBtn').addEventListener('click', async () => {
      const btn = wrap.querySelector('#submitAttBtn');
      btn.disabled    = true;
      btn.textContent = 'Submitting...';

      try {
        const payload = {
          subjectCode: sub.code,
          date: new Date().toISOString(),
          records: Object.entries(attendance).map(([id, val]) => ({ studentId: id, status: val }))
        };
        // Mock fallback if API not implemented
        await attendance.mark(payload).catch(e => console.warn('Mock submit fallback:', e));

        wrap.querySelector('#submitRow').style.display   = 'none';
        wrap.querySelector('#attSuccess').style.display  = 'block';
        wrap.querySelector('#attSuccess').querySelector('.att-success-sub').textContent =
          `${countPresent()} present, ${CLASS_STUDENTS.length - countPresent()} absent recorded for ${sub.name} on ${today}.`;
        
        // Disable all toggles
        wrap.querySelectorAll('.att-toggle').forEach(t => {
          t.style.pointerEvents = 'none';
          t.style.opacity = '0.7';
        });
        wrap.querySelectorAll('.bulk-btn').forEach(b => b.disabled = true);
        wrap.querySelector('#subjectSelect').disabled = true;

      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Submit Attendance';
        alert('Failed to submit attendance: ' + err.message);
      }
    });

    return wrap;
  }

  function buildStudentRow(s, att) {
    const val = att[s.id] || 'present';
    return `
      <div class="student-att-row ${val === 'absent' ? 'row-absent' : ''}">
        <div class="sar-left">
          <div class="sar-num">${s.id}</div>
          <div class="sar-avatar">${s.name.split(' ').map(w=>w[0]).join('')}</div>
          <div class="sar-info">
            <div class="sar-name">${s.name}</div>
            <div class="sar-roll">${s.roll} &nbsp;·&nbsp; Overall: <span style="color:${s.attendance>=75?'var(--success)':s.attendance>=60?'var(--warn)':'var(--danger)'};font-weight:600">${s.attendance}%</span></div>
          </div>
        </div>
        <button class="att-toggle ${val === 'present' ? 'att-present' : 'att-absent'}"
          data-sid="${s.id}">
          ${val === 'present' ? 'Present' : 'Absent'}
        </button>
      </div>
    `;
  }

  function updateAllToggles(wrap) {
    wrap.querySelectorAll('.att-toggle').forEach(btn => {
      const sid = parseInt(btn.dataset.sid);
      const val = attendance[sid];
      btn.className   = `att-toggle ${val === 'present' ? 'att-present' : 'att-absent'}`;
      btn.textContent = val === 'present' ? 'Present' : 'Absent';
      btn.closest('.student-att-row').className = `student-att-row ${val === 'absent' ? 'row-absent' : ''}`;
    });
  }

  function refreshCounts(wrap) {
    const present = countPresent();
    const absent  = CLASS_STUDENTS.length - present;
    wrap.querySelector('#presentCount').textContent = `${present} Present`;
    wrap.querySelector('#absentCount').textContent  = `${absent} Absent`;
  }

  rebuild();
  return el;
}

// ── ATTENDANCE RECORDS ────────────────────────

function renderRecords() {
  const el = document.createElement('div');
  let selectedCode = FACULTY.subjects[0].code;

  function rebuild() {
    el.innerHTML = '';
    el.appendChild(buildRecords());
  }

  function buildRecords() {
    const wrap    = document.createElement('div');
    const history = ATT_HISTORY[selectedCode] || [];

    wrap.innerHTML = `
      <div class="sd-card">
        <div class="sd-card-header">
          <div class="sd-card-title">Attendance Records</div>
          <select class="form-input" id="recordSubject" style="width:260px">
            ${FACULTY.subjects.map(s => `
              <option value="${s.code}" ${s.code === selectedCode ? 'selected' : ''}>
                ${s.name} (${s.code})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="records-table-wrap">
          <table class="sd-table records-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No.</th>
                ${history.map(h => `<th>${h.date}</th>`).join('')}
                <th>Overall</th>
              </tr>
            </thead>
            <tbody>
              ${CLASS_STUDENTS.map(s => {
                const sessions = history.map(h =>
                  h.present.includes(s.id) ? 'P' : 'A'
                );
                const presentCount = sessions.filter(v => v === 'P').length;
                const pct = Math.round((presentCount / sessions.length) * 100);
                return `
                  <tr>
                    <td><strong>${s.name}</strong></td>
                    <td class="td-muted">${s.roll}</td>
                    ${sessions.map(v => `
                      <td>
                        <span class="att-chip ${v === 'P' ? 'att-chip-p' : 'att-chip-a'}">${v}</span>
                      </td>
                    `).join('')}
                    <td>
                      <span style="font-weight:700;color:${pct>=75?'var(--success)':pct>=60?'var(--warn)':'var(--danger)'}">${pct}%</span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div class="records-legend">
          <span class="att-chip att-chip-p">P</span> Present &nbsp;&nbsp;
          <span class="att-chip att-chip-a">A</span> Absent
          &nbsp;&nbsp;·&nbsp;&nbsp; Showing last ${history.length} sessions
        </div>
      </div>
    `;

    wrap.querySelector('#recordSubject').addEventListener('change', e => {
      selectedCode = e.target.value;
      rebuild();
    });

    return wrap;
  }

  rebuild();
  return el;
}

// ── ENTER MARKS ───────────────────────────────

function renderMarksEntry() {
  const el  = document.createElement('div');
  let selectedCode = FACULTY.subjects[0].code;
  let saved = false;

  // Deep copy so edits don't mutate original
  const marksState = JSON.parse(JSON.stringify(MARKS_STORE));

  function rebuild() {
    el.innerHTML = '';
    el.appendChild(buildMarksForm());
  }

  function buildMarksForm() {
    const wrap = document.createElement('div');
    const rows = marksState[selectedCode] || [];

    wrap.innerHTML = `
      <div class="sd-card">
        <div class="sd-card-header">
          <div class="sd-card-title">Enter / Update Marks</div>
          <select class="form-input" id="marksSubject" style="width:260px">
            ${FACULTY.subjects.map(s => `
              <option value="${s.code}" ${s.code === selectedCode ? 'selected' : ''}>
                ${s.name} (${s.code})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="marks-limits-bar">
          <span>Internal: max <strong>30</strong></span>
          <span class="mlb-sep">·</span>
          <span>External: max <strong>95</strong></span>
          <span class="mlb-sep">·</span>
          <span>Total: max <strong>125</strong></span>
        </div>

        <table class="sd-table marks-entry-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Roll No.</th>
              <th>Internal (30)</th>
              <th>External (95)</th>
              <th>Total</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody id="marksTbody">
            ${CLASS_STUDENTS.map((s, idx) => {
              const m = rows.find(r => r.id === s.id) || { internal:0, external:0 };
              return buildMarksRow(s, m, idx + 1);
            }).join('')}
          </tbody>
        </table>

        <div class="marks-actions" id="marksActions">
          <button class="btn-att-submit" id="saveMarksBtn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89
              2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66
              0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3
              3zm3-10H5V5h10v4z"/>
            </svg>
            Save Marks
          </button>
          <span class="att-submit-note">Changes will be visible to students immediately</span>
        </div>

        <div class="att-success" id="marksSaved" style="display:none">
          <div class="att-success-icon">✓</div>
          <div class="att-success-title">Marks Saved!</div>
          <div class="att-success-sub">All marks have been updated and are now visible to students.</div>
        </div>
      </div>
    `;

    // Subject switch
    wrap.querySelector('#marksSubject').addEventListener('change', async e => {
      selectedCode = e.target.value;
      
      // FETCH NEW STUDENTS FOR THIS SUBJECT
      try {
        const res = await students.getBySubject(selectedCode);
        CLASS_STUDENTS = res.map(s => ({
          id: s.id,
          name: s.name,
          roll: s.roll_number,
          attendance: s.attendance || 80
        }));
      } catch (err) {
        console.error('Failed to load students for subject:', err);
      }

      saved = false;
      rebuild();
    });

    // Live total calculation
    wrap.querySelectorAll('.marks-internal, .marks-external').forEach(input => {
      input.addEventListener('input', () => {
        const row      = input.closest('tr');
        const internal = parseInt(row.querySelector('.marks-internal').value) || 0;
        const external = parseInt(row.querySelector('.marks-external').value) || 0;
        const total    = internal + external;
        row.querySelector('.marks-total').textContent = total;
        row.querySelector('.marks-grade').textContent = calcGrade(total, 125);

        // Clamp
        if (internal > 30) input.value = 30;
        if (external > 95) input.value = 95;
      });
    });

    // Save
    wrap.querySelector('#saveMarksBtn').addEventListener('click', async () => {
      const btn = wrap.querySelector('#saveMarksBtn');
      btn.disabled    = true;
      btn.textContent = 'Saving...';

      try {
        const rows = wrap.querySelectorAll('tbody tr');
        const updates = Array.from(rows).map(row => {
          const internalInput = row.querySelector('.marks-internal');
          const externalInput = row.querySelector('.marks-external');
          return marks.upsert({
            student_id: internalInput.dataset.sid,
            subject_id: sub.code, // string ID for now
            exam_type: 'semester',
            internal: parseInt(internalInput.value) || 0,
            external: parseInt(externalInput.value) || 0,
          }).catch(e => console.warn('Mock marks fallback:', e));
        });

        await Promise.allSettled(updates);

        wrap.querySelector('#marksActions').style.display = 'none';
        wrap.querySelector('#marksSaved').style.display   = 'block';
        wrap.querySelectorAll('.marks-internal, .marks-external')
          .forEach(i => i.disabled = true);
        wrap.querySelector('#marksSubject').disabled = true;

      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Save Marks';
        alert('Failed to save marks: ' + err.message);
      }
    });

    return wrap;
  }

  function buildMarksRow(s, m, num) {
    const total = m.internal + m.external;
    const grade = calcGrade(total, 125);
    const gradeColor = { O:'var(--success)', 'A+':'var(--success)', A:'#2563EB', 'B+':'var(--gold)', B:'var(--warn)', F:'var(--danger)' };
    return `
      <tr>
        <td class="td-muted">${num}</td>
        <td><strong>${s.name}</strong></td>
        <td class="td-muted">${s.roll}</td>
        <td>
          <input type="number" class="marks-input marks-internal"
            value="${m.internal}" min="0" max="30"
            data-sid="${s.id}" />
        </td>
        <td>
          <input type="number" class="marks-input marks-external"
            value="${m.external}" min="0" max="95"
            data-sid="${s.id}" />
        </td>
        <td class="marks-total" style="font-weight:700">${total}</td>
        <td class="marks-grade" style="font-weight:700;color:${gradeColor[grade]||'var(--text-dark)'}">${grade}</td>
      </tr>
    `;
  }

  function calcGrade(score, max) {
    const pct = (score / max) * 100;
    for (const g of INSTITUTION.gradingScale) {
      if (pct >= g.minPercent) return g.grade;
    }
    return 'F';
  }

  rebuild();
  return el;
}

// ── CLASS REPORTS ─────────────────────────────

function renderReports() {
  const el = document.createElement('div');
  let selectedCode = FACULTY.subjects[0].code;

  function rebuild() {
    el.innerHTML = '';
    el.appendChild(buildReport());
  }

  function buildReport() {
    const wrap   = document.createElement('div');
    const marks  = MARKS_STORE[selectedCode] || [];
    const totals = marks.map(m => m.internal + m.external);
    const avg    = Math.round(totals.reduce((a,b)=>a+b,0) / totals.length);
    const high   = Math.max(...totals);
    const low    = Math.min(...totals);
    const pass   = totals.filter(t => (t/125)*100 >= 35).length;
    const sub    = FACULTY.subjects.find(s => s.code === selectedCode);

    const gradeColor = { O:'var(--success)', 'A+':'var(--success)', A:'#2563EB', 'B+':'var(--gold)', B:'var(--warn)', F:'var(--danger)' };

    wrap.innerHTML = `
      <div class="sd-card" style="margin-bottom:16px">
        <div class="sd-card-header">
          <div class="sd-card-title">Class Performance Report</div>
          <select class="form-input" id="reportSubject" style="width:260px">
            ${FACULTY.subjects.map(s => `
              <option value="${s.code}" ${s.code === selectedCode ? 'selected' : ''}>
                ${s.name} (${s.code})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="sd-stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:0">
          ${fStat('Class Average', avg+'/125',  'gold',    'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', sub.name)}
          ${fStat('Highest',       high,         'success', 'M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L3 10.26V15c0 3.31 4.03 6 9 6s9-2.69 9-6v-4.74L12 15.5z',                           'Score')}
          ${fStat('Lowest',        low,          'danger',  'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',                                                                          'Score')}
          ${fStat('Pass Rate',     Math.round((pass/marks.length)*100)+'%', 'navy', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',                                          `${pass}/${marks.length} students`)}
        </div>
      </div>

      <div class="sd-card">
        <div class="sd-card-header">
          <div class="sd-card-title">Student-wise Performance</div>
          <span class="sd-card-tag">Marks out of 125</span>
        </div>
        <table class="sd-table">
          <thead>
            <tr><th>#</th><th>Student</th><th>Roll No.</th><th>Internal</th><th>External</th><th>Total</th><th>%</th><th>Grade</th><th>Rank</th></tr>
          </thead>
          <tbody>
            ${CLASS_STUDENTS
                .map(s => {
                  const m = marks.find(r => r.id === s.id) || {internal:0,external:0};
                  return { s, m, total: m.internal + m.external };
                })
                .sort((a,b) => b.total - a.total)
                .map(({ s, m, total }, idx) => {
                  const pct   = Math.round((total/125)*100);
                  const grade = (() => {
                    for (const g of INSTITUTION.gradingScale)
                      if (pct >= g.minPercent) return g.grade;
                    return 'F';
                  })();
                  return `
                    <tr>
                      <td class="td-muted">${idx+1}</td>
                      <td><strong>${s.name}</strong></td>
                      <td class="td-muted">${s.roll}</td>
                      <td>${m.internal}</td>
                      <td>${m.external}</td>
                      <td style="font-weight:700">${total}</td>
                      <td>${pct}%</td>
                      <td>
                        <span class="grade-pill"
                          style="color:${gradeColor[grade]||'var(--text-dark)'};
                          background:${gradeColor[grade]||'#aaa'}18">
                          ${grade}
                        </span>
                      </td>
                      <td>
                        ${idx === 0
                          ? '<span style="font-size:16px">🥇</span>'
                          : idx === 1
                          ? '<span style="font-size:16px">🥈</span>'
                          : idx === 2
                          ? '<span style="font-size:16px">🥉</span>'
                          : `#${idx+1}`}
                      </td>
                    </tr>
                  `;
                }).join('')}
          </tbody>
        </table>
      </div>
    `;

    wrap.querySelector('#reportSubject').addEventListener('change', e => {
      selectedCode = e.target.value;
      rebuild();
    });

    return wrap;
  }

  rebuild();
  return el;
}

// ── ANNOUNCEMENTS ─────────────────────────────

function renderAnnouncements() {
  const el = document.createElement('div');
  const list = [...ANNOUNCEMENTS];

  function rebuild() {
    el.innerHTML = '';
    el.appendChild(buildAnnouncements());
  }

  function buildAnnouncements() {
    const wrap = document.createElement('div');

    wrap.innerHTML = `
      <!-- POST NEW -->
      <div class="sd-card" style="margin-bottom:16px">
        <div class="sd-card-title" style="margin-bottom:18px">Post New Announcement</div>

        <div class="form-group">
          <label class="form-label">Subject</label>
          <select class="form-input" id="annSubject">
            ${FACULTY.subjects.map(s => `<option value="${s.code}">${s.name} (${s.code})</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Announcement</label>
          <textarea class="form-input" id="annTitle" rows="3"
            placeholder="e.g. Assignment 4 deadline is May 10..."></textarea>
          <div class="field-error" id="annTitleErr"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Directed To</label>
          <select class="form-input" id="annTo">
            ${FACULTY.subjects.map(s => `<option>Semester ${s.sem} — Section ${s.section}</option>`).join('')}
            <option>All My Classes</option>
          </select>
        </div>

        <div style="display:flex;align-items:center;gap:12px">
          <button class="btn-att-submit" id="postAnnBtn" style="width:auto;padding:11px 28px">
            Post Announcement
          </button>
          <span class="att-submit-note">Visible to students immediately</span>
        </div>
      </div>

      <!-- EXISTING -->
      <div class="sd-card">
        <div class="sd-card-header">
          <div class="sd-card-title">Posted Announcements</div>
          <span class="sd-card-tag">${list.length} total</span>
        </div>
        <div id="annList">
          ${list.map(a => buildAnnRow(a)).join('')}
        </div>
        ${list.length === 0
          ? `<div class="empty-state">No announcements posted yet.</div>`
          : ''}
      </div>
    `;

    wrap.querySelector('#postAnnBtn').addEventListener('click', () => {
      const title = wrap.querySelector('#annTitle').value.trim();
      const err   = wrap.querySelector('#annTitleErr');

      if (!title) {
        err.textContent   = 'Please enter an announcement';
        err.style.display = 'block';
        return;
      }
      err.style.display = 'none';

      const code    = wrap.querySelector('#annSubject').value;
      const to      = wrap.querySelector('#annTo').value;
      const today   = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
      const newAnn  = { id:`A00${list.length+4}`, title, subject:code, date:today, to };

      list.unshift(newAnn);
      wrap.querySelector('#annTitle').value = '';

      const annList = wrap.querySelector('#annList');
      const row     = document.createElement('div');
      row.innerHTML  = buildAnnRow(newAnn);
      annList.insertBefore(row.firstElementChild, annList.firstChild);

      wrap.querySelector('.sd-card-tag').textContent = `${list.length} total`;
    });

    return wrap;
  }

  function buildAnnRow(a) {
    return `
      <div class="announce-row">
        <div class="announce-row-left">
          <span class="ann-subject-tag">${a.subject}</span>
          <div class="ann-title">${a.title}</div>
          <div class="ann-meta">${a.to} &nbsp;·&nbsp; ${a.date} &nbsp;·&nbsp; ${a.id}</div>
        </div>
      </div>
    `;
  }

  rebuild();
  return el;
}

// ── PROFILE ───────────────────────────────────

function renderProfile() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="sd-two-col" style="align-items:flex-start">
      <div class="sd-card">
        <div class="sd-card-title" style="margin-bottom:24px">Faculty Profile</div>
        <div class="profile-avatar-row">
          <div class="profile-avatar" style="background:rgba(11,29,58,0.08);color:var(--navy);font-size:20px;font-weight:700;width:60px;height:60px">
            ${FACULTY.initials}
          </div>
          <div>
            <div class="profile-name">${FACULTY.name}</div>
            <div class="profile-role">${FACULTY.designation} &nbsp;·&nbsp; ${FACULTY.department}</div>
          </div>
        </div>
        <hr class="divider"/>
        ${profileRow('Employee ID',   FACULTY.employeeId)}
        ${profileRow('Department',    FACULTY.department)}
        ${profileRow('Designation',   FACULTY.designation)}
        ${profileRow('Email',         FACULTY.email)}
        ${profileRow('Phone',         FACULTY.phone)}
        ${profileRow('Institution',   INSTITUTION.name)}
        ${profileRow('Academic Year', INSTITUTION.academicYear)}
      </div>

      <div class="sd-card">
        <div class="sd-card-title" style="margin-bottom:24px">Subjects Assigned</div>
        ${FACULTY.subjects.map(s => `
          <div class="subject-row">
            <div class="subject-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div class="subject-info">
              <div class="subject-name">${s.name}</div>
              <div class="subject-meta">${s.code} &nbsp;·&nbsp; Sem ${s.sem} Sec ${s.section} &nbsp;·&nbsp; ${s.students} students</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return el;
}

// ── Helpers ───────────────────────────────────

function profileRow(label, value) {
  return `
    <div class="profile-row">
      <div class="profile-row-label">${label}</div>
      <div class="profile-row-value">${value}</div>
    </div>
  `;
}

function fStat(label, value, color, iconPath, sub) {
  const colors = {
    success:{ bg:'#F0FDF4', text:'var(--success)', icon:'#D1FAE5' },
    danger: { bg:'#FEF2F2', text:'var(--danger)',  icon:'#FEE2E2' },
    gold:   { bg:'#FFFBEB', text:'var(--gold)',    icon:'#FEF3C7' },
    navy:   { bg:'#EFF6FF', text:'var(--navy)',    icon:'#DBEAFE' },
    warn:   { bg:'#FFFBEB', text:'var(--warn)',    icon:'#FEF3C7' },
  };
  const c = colors[color] || colors.navy;
  return `
    <div class="stat-card" style="background:${c.bg}">
      <div class="stat-card-icon" style="background:${c.icon}">
        <svg viewBox="0 0 24 24" fill="${c.text}" width="18" height="18">
          <path d="${iconPath}"/>
        </svg>
      </div>
      <div class="stat-card-val" style="color:${c.text}">${value}</div>
      <div class="stat-card-label">${label}</div>
      <div class="stat-card-sub">${sub}</div>
    </div>
  `;
}

// ── Styles ─────────────────────────────────────

function injectFacultyStyles() {
  if (document.getElementById('faculty-styles')) return;
  const style = document.createElement('style');
  style.id = 'faculty-styles';
  style.textContent = `
    /* LAYOUT — reuse from admin/student */
    .sd-wrapper{display:grid;grid-template-columns:240px 1fr;min-height:100vh;background:var(--cream)}
    .sd-sidebar{background:var(--navy);display:flex;flex-direction:column;justify-content:space-between;position:sticky;top:0;height:100vh;overflow-y:auto}
    .sd-sidebar-top{padding:24px 16px}
    .sd-logo{display:flex;align-items:center;gap:10px;margin-bottom:36px;padding:0 8px}
    .sd-logo-icon{width:34px;height:34px;background:var(--gold);border-radius:8px;display:flex;align-items:center;justify-content:center}
    .sd-logo-icon svg{fill:var(--navy)}
    .sd-logo-text{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--white)}
    .sd-logo-text span{color:var(--gold-light)}
    .sd-nav-label{font-size:10px;font-weight:600;color:rgba(255,255,255,0.28);letter-spacing:1.4px;text-transform:uppercase;padding:0 12px;margin-bottom:4px;margin-top:8px}
    .sd-nav-item{width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;border:none;background:none;color:rgba(255,255,255,0.55);font-size:13px;font-weight:400;border-radius:8px;cursor:pointer;transition:all .18s;text-align:left;font-family:'DM Sans',sans-serif}
    .sd-nav-item:hover{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.9)}
    .sd-nav-item.active{background:rgba(201,153,42,0.18);color:var(--gold-light);font-weight:500}
    .sd-nav-item.active svg{fill:var(--gold-light)}
    .sd-nav-item svg{fill:currentColor;flex-shrink:0}
    .sd-sidebar-bottom{padding:16px;border-top:1px solid rgba(255,255,255,0.08)}
    .sd-user-card{display:flex;align-items:center;gap:10px;padding:10px 8px;margin-bottom:8px}
    .sd-user-avatar{width:34px;height:34px;border-radius:50%;background:rgba(201,153,42,0.2);border:1.5px solid var(--gold);color:var(--gold-light);font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .sd-user-name{font-size:13px;font-weight:500;color:var(--white)}
    .sd-user-roll{font-size:11px;color:rgba(255,255,255,0.35);margin-top:1px}
    .sd-logout{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:8px;color:rgba(255,255,255,0.45);font-size:13px;text-decoration:none;transition:all .18s}
    .sd-logout:hover{background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.8)}
    .sd-logout svg{fill:currentColor}
    .sd-main{display:flex;flex-direction:column;min-height:100vh}
    .sd-topbar{background:var(--white);border-bottom:1px solid var(--border);padding:0 32px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
    .sd-page-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text-dark)}
    .sd-breadcrumb{font-size:12px;color:var(--text-muted);margin-top:2px}
    .sd-topbar-right{display:flex;align-items:center;gap:20px}
    .sd-topbar-meta{text-align:right}
    .sd-topbar-sem{font-size:13px;font-weight:500;color:var(--text-dark)}
    .sd-topbar-year{font-size:11px;color:var(--text-muted)}
    .sd-content{padding:28px 32px;flex:1;transition:opacity .15s ease,transform .15s ease}
    .sd-welcome-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
    .sd-welcome-text{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--text-dark)}
    .sd-welcome-sub{font-size:13px;color:var(--text-muted);margin-top:3px}
    .sd-welcome-date{font-size:13px;color:var(--text-muted)}
    .sd-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
    .stat-card{border-radius:var(--radius-lg);padding:20px;border:1px solid rgba(0,0,0,0.05)}
    .stat-card-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
    .stat-card-val{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;margin-bottom:2px}
    .stat-card-label{font-size:13px;font-weight:500;color:var(--text-dark);margin-bottom:2px}
    .stat-card-sub{font-size:11px;color:var(--text-muted)}
    .sd-two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
    .sd-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px}
    .sd-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
    .sd-card-title{font-size:15px;font-weight:600;color:var(--text-dark)}
    .sd-card-tag{font-size:11px;font-weight:500;color:var(--text-muted);background:var(--cream);border:1px solid var(--border);padding:3px 10px;border-radius:4px}
    .faculty-dept-pill{font-size:12px;font-weight:500;color:var(--navy);background:#EFF6FF;border:1px solid #BFDBFE;padding:6px 14px;border-radius:99px}

    /* SHARED */
    .form-group{margin-bottom:18px}
    .form-label{display:block;font-size:13px;font-weight:500;color:var(--text-mid);margin-bottom:6px}
    .form-input{width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:14px;color:var(--text-dark);background:var(--white);transition:border-color .2s;outline:none;font-family:'DM Sans',sans-serif}
    .form-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,153,42,0.1)}
    .field-error{font-size:12px;color:var(--danger);margin-top:5px;display:none}
    .divider{border:none;border-top:1px solid var(--border);margin:20px 0}
    .sd-table{width:100%;border-collapse:collapse}
    .sd-table th{font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;padding:10px 12px;text-align:left;border-bottom:1px solid var(--border)}
    .sd-table td{font-size:13px;color:var(--text-dark);padding:12px 12px;border-bottom:1px solid #F8FAFC;vertical-align:middle}
    .sd-table tr:last-child td{border-bottom:none}
    .sd-table tr:hover td{background:#FAFAFA}
    .td-muted{color:var(--text-muted)!important}
    .grade-pill{display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;width:32px;height:24px;border-radius:4px}
    .empty-state{font-size:13px;color:var(--text-muted);text-align:center;padding:20px 0}
    .badge{display:inline-flex;align-items:center;font-size:11px;font-weight:600;padding:3px 10px;border-radius:4px;letter-spacing:0.4px}
    .badge-info{background:#DBEAFE;color:#1E40AF}
    .profile-row{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--border);font-size:13px}
    .profile-row:last-child{border-bottom:none}
    .profile-row-label{color:var(--text-muted)}
    .profile-row-value{font-weight:500;color:var(--text-dark)}
    .profile-avatar-row{display:flex;align-items:center;gap:16px;margin-bottom:20px}
    .profile-avatar{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center}
    .profile-name{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text-dark)}
    .profile-role{font-size:13px;color:var(--text-muted);margin-top:3px}

    /* SUBJECTS */
    .subject-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #F1F5F9}
    .subject-row:last-child{border-bottom:none}
    .subject-icon{width:38px;height:38px;background:#EFF6FF;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .subject-icon svg{fill:#1E40AF}
    .subject-info{flex:1}
    .subject-name{font-size:13px;font-weight:600;color:var(--text-dark)}
    .subject-meta{font-size:11px;color:var(--text-muted);margin-top:2px}

    /* ATTENDANCE BARS */
    .att-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid #F8FAFC}
    .att-row:last-child{border-bottom:none}
    .att-row-left{}
    .att-subject{font-size:13px;font-weight:500;color:var(--text-dark)}
    .att-code{font-size:11px;color:var(--text-muted);margin-top:1px}
    .att-row-right{display:flex;align-items:center;gap:10px;min-width:130px}
    .att-bar-wrap{flex:1;height:6px;background:var(--border);border-radius:99px;overflow:hidden}
    .att-bar-fill{height:100%;border-radius:99px}
    .att-percent{font-size:12px;font-weight:600;min-width:34px;text-align:right}

    /* MARK ATTENDANCE */
    .att-form-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0}
    .att-count-row{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:13px}
    .att-count-present{font-weight:600;color:var(--success)}
    .att-count-sep{color:var(--text-muted)}
    .att-count-total{color:var(--text-muted)}
    .att-count-absent{font-weight:600;color:var(--danger)}
    .bulk-btn{padding:8px 14px;border-radius:var(--radius-md);font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid;transition:all .2s;font-family:'DM Sans',sans-serif}
    .bulk-present{background:#F0FDF4;color:var(--success);border-color:#BBF7D0}
    .bulk-present:hover{background:var(--success);color:#fff}
    .bulk-absent{background:#FEF2F2;color:var(--danger);border-color:#FECACA}
    .bulk-absent:hover{background:var(--danger);color:#fff}
    .student-att-list{display:flex;flex-direction:column;gap:0;margin-bottom:20px}
    .student-att-row{display:flex;align-items:center;justify-content:space-between;padding:12px 10px;border-bottom:1px solid #F8FAFC;border-radius:8px;transition:background .15s}
    .student-att-row:hover{background:#FAFAFA}
    .row-absent{background:#FFF8F8!important}
    .sar-left{display:flex;align-items:center;gap:12px}
    .sar-num{font-size:12px;color:var(--text-muted);width:22px;text-align:center}
    .sar-avatar{width:32px;height:32px;border-radius:50%;background:rgba(11,29,58,0.08);color:var(--navy);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .sar-name{font-size:13px;font-weight:500;color:var(--text-dark)}
    .sar-roll{font-size:11px;color:var(--text-muted);margin-top:1px}
    .att-toggle{padding:7px 18px;border-radius:var(--radius-md);font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid;transition:all .2s;font-family:'DM Sans',sans-serif}
    .att-present{background:#F0FDF4;color:var(--success);border-color:#BBF7D0}
    .att-absent{background:#FEF2F2;color:var(--danger);border-color:#FECACA}
    .att-submit-row{display:flex;align-items:center;gap:14px;padding-top:8px;border-top:1px solid var(--border)}
    .btn-att-submit{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;background:var(--navy);color:#fff;border:none;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
    .btn-att-submit:hover{background:var(--navy-light);transform:translateY(-1px)}
    .btn-att-submit:disabled{opacity:.7;cursor:not-allowed;transform:none}
    .att-submit-note{font-size:12px;color:var(--text-muted)}
    .att-success{text-align:center;padding:32px 0}
    .att-success-icon{width:52px;height:52px;background:#D1FAE5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--success);margin:0 auto 14px;font-weight:700}
    .att-success-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text-dark);margin-bottom:6px}
    .att-success-sub{font-size:13px;color:var(--text-muted)}

    /* RECORDS */
    .records-table-wrap{overflow-x:auto;margin-bottom:14px}
    .records-table th,.records-table td{white-space:nowrap}
    .att-chip{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:4px;font-size:11px;font-weight:700}
    .att-chip-p{background:#D1FAE5;color:var(--success)}
    .att-chip-a{background:#FEE2E2;color:var(--danger)}
    .records-legend{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px}

    /* MARKS ENTRY */
    .marks-limits-bar{display:flex;align-items:center;gap:12px;font-size:12px;color:var(--text-muted);background:var(--cream);border-radius:var(--radius-md);padding:10px 16px;margin-bottom:16px}
    .mlb-sep{color:var(--border)}
    .marks-input{width:70px;padding:7px 10px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;text-align:center;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s}
    .marks-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,153,42,0.1)}
    .marks-actions{display:flex;align-items:center;gap:14px;padding-top:16px;border-top:1px solid var(--border);margin-top:8px}

    /* ANNOUNCEMENTS */
    .announce-mini-row{padding:10px 0;border-bottom:1px solid #F1F5F9}
    .announce-mini-row:last-child{border-bottom:none}
    .amr-subject{font-size:10px;font-weight:600;color:var(--gold);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:3px}
    .amr-title{font-size:13px;font-weight:500;color:var(--text-dark)}
    .amr-meta{font-size:11px;color:var(--text-muted);margin-top:2px}
    .announce-row{padding:14px 0;border-bottom:1px solid #F1F5F9}
    .announce-row:last-child{border-bottom:none}
    .ann-subject-tag{display:inline-block;font-size:10px;font-weight:600;background:#EFF6FF;color:#1E40AF;padding:3px 8px;border-radius:4px;margin-bottom:6px}
    .ann-title{font-size:14px;font-weight:500;color:var(--text-dark);margin-bottom:3px}
    .ann-meta{font-size:11px;color:var(--text-muted)}
  `;
  document.head.appendChild(style);
}