// ============================================
//  STUDENT DASHBOARD
//  Sections: Overview, Attendance, Marks,
//            Leaves, Apply Leave
// ============================================

import INSTITUTION from '../../config/institution.js';

// ── Mock student data (replace with API later) ──
const STUDENT = {
  name: 'Arjun Singh',
  initials: 'AS',
  rollNumber: 'CS2023001',
  department: 'Computer Science',
  semester: '5th Semester',
  batch: '2023–27',
  cgpa: 8.6,
  email: 'arjun.singh@greenfield.edu.in',
  phone: '+91 98765 43210',
};

const STATS = {
  attendance: 84.2,
  leavesUsed: 7,
  leavesTotal: INSTITUTION.leavePolicy.maxLeavesPerSemester,
  pendingLeaves: 2,
  subjects: 6,
};

const ATTENDANCE = [
  { subject: 'Data Structures',        code: 'CS301', present: 38, total: 45, percent: 84 },
  { subject: 'Operating Systems',      code: 'CS302', present: 40, total: 45, percent: 89 },
  { subject: 'Database Management',    code: 'CS303', present: 32, total: 45, percent: 71 },
  { subject: 'Computer Networks',      code: 'CS304', present: 41, total: 45, percent: 91 },
  { subject: 'Software Engineering',   code: 'CS305', present: 29, total: 45, percent: 64 },
  { subject: 'Machine Learning',       code: 'CS306', present: 36, total: 45, percent: 80 },
];

const MARKS = [
  { subject: 'Data Structures',       code: 'CS301', internal: 28, external: 71, total: 99,  max: 125, grade: 'A+' },
  { subject: 'Operating Systems',     code: 'CS302', internal: 25, external: 68, total: 93,  max: 125, grade: 'A'  },
  { subject: 'Database Management',   code: 'CS303', internal: 30, external: 74, total: 104, max: 125, grade: 'O'  },
  { subject: 'Computer Networks',     code: 'CS304', internal: 22, external: 65, total: 87,  max: 125, grade: 'A'  },
  { subject: 'Software Engineering',  code: 'CS305', internal: 18, external: 58, total: 76,  max: 125, grade: 'B+' },
  { subject: 'Machine Learning',      code: 'CS306', internal: 26, external: 70, total: 96,  max: 125, grade: 'A+' },
];

const LEAVES = [
  { id: 'LV001', type: 'Medical Leave',   from: 'Dec 12, 2025', to: 'Dec 14, 2025', days: 3, reason: 'Fever and viral infection', status: 'approved', appliedOn: 'Dec 11, 2025', comment: 'Approved. Get well soon.' },
  { id: 'LV002', type: 'Family Function', from: 'Jan 3, 2026',  to: 'Jan 4, 2026',  days: 2, reason: 'Sister\'s wedding ceremony', status: 'pending',  appliedOn: 'Dec 28, 2025', comment: '' },
  { id: 'LV003', type: 'Personal',        from: 'Nov 28, 2025', to: 'Nov 28, 2025', days: 1, reason: 'Personal work at home',    status: 'rejected', appliedOn: 'Nov 27, 2025', comment: 'Insufficient reason provided.' },
  { id: 'LV004', type: 'Medical Leave',   from: 'Oct 5, 2025',  to: 'Oct 6, 2025',  days: 2, reason: 'Dental surgery',           status: 'approved', appliedOn: 'Oct 4, 2025',  comment: 'Approved with medical certificate.' },
];

const NOTICES = [
  { title: 'End Semester Exam Schedule Released', date: 'Apr 20, 2026', tag: 'Exam' },
  { title: 'Holiday on Apr 30 — Maharashtra Day', date: 'Apr 18, 2026', tag: 'Holiday' },
  { title: 'Internal Assessment Marks Published',  date: 'Apr 15, 2026', tag: 'Marks' },
];

const HOSTEL_LEAVES = [
  {
    id: 'HL001',
    reason: 'Going home for Diwali',
    from: 'Oct 30, 2025',
    fromTime: '06:00 AM',
    to: 'Nov 2, 2025',
    toTime: '08:00 PM',
    status: 'approved',
    appliedOn: 'Oct 28, 2025',
    warden: 'Mr. Ramesh Kumar',
    comment: 'Approved. Report back on time.',
  },
  {
    id: 'HL002',
    reason: 'Medical checkup at home',
    from: 'Dec 5, 2025',
    fromTime: '09:00 AM',
    to: 'Dec 5, 2025',
    toTime: '07:00 PM',
    status: 'approved',
    appliedOn: 'Dec 4, 2025',
    warden: 'Mr. Ramesh Kumar',
    comment: '',
  },
  {
    id: 'HL003',
    reason: 'Family emergency',
    from: 'Jan 10, 2026',
    fromTime: '07:00 AM',
    to: 'Jan 12, 2026',
    toTime: '09:00 PM',
    status: 'pending',
    appliedOn: 'Jan 9, 2026',
    warden: 'Mr. Ramesh Kumar',
    comment: '',
  },
];

// ── Render ────────────────────────────────────

export function renderStudentDashboard() {
  const wrapper = document.createElement('div');
  wrapper.className = 'sd-wrapper';

  wrapper.innerHTML = `

    <!-- SIDEBAR -->
    <aside class="sd-sidebar" id="sidebar">
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
          ${navItem('overview',    'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z', 'Overview')}
          ${navItem('attendance',  'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z', 'Attendance')}
          ${navItem('marks',       'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z', 'Marks & Grades')}
          ${navItem('leaves',      'M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.93.5 13.5.5c-1.32 0-2.46.56-3.31 1.44L9 3.17l-1.19-1.23C6.96 1.06 5.82.5 4.5.5 2.07.5 0 2.54 0 4.66c0 .46.11.9.18 1.34H0v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z', 'Leave Requests')}
          ${navItem('apply',        'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z', 'Apply for Leave')}
          ${navItem('hostel',       'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', 'Hostel Leave')}
          <div class="sd-nav-label" style="margin-top:8px">Info</div>
          ${navItem('notices',     'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z', 'Notices')}
          ${navItem('profile',     'M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', 'My Profile')}
        </nav>
      </div>

      <div class="sd-sidebar-bottom">
        <div class="sd-user-card">
          <div class="sd-user-avatar">${STUDENT.initials}</div>
          <div class="sd-user-info">
            <div class="sd-user-name">${STUDENT.name}</div>
            <div class="sd-user-roll">${STUDENT.rollNumber}</div>
          </div>
        </div>
        <a href="/src/pages/login.html" class="sd-logout">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58
            2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0
            1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Sign Out
        </a>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="sd-main">

      <!-- TOP BAR -->
      <header class="sd-topbar">
        <div class="sd-topbar-left">
          <div class="sd-page-title" id="pageTitle">Overview</div>
          <div class="sd-breadcrumb">
            ${INSTITUTION.name} &nbsp;/&nbsp; <span id="breadcrumbPage">Dashboard</span>
          </div>
        </div>
        <div class="sd-topbar-right">
          <div class="sd-notice-bell">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0
              -3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67
              -1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <div class="sd-bell-dot"></div>
          </div>
          <div class="sd-topbar-meta">
            <div class="sd-topbar-sem">${STUDENT.semester}</div>
            <div class="sd-topbar-year">${INSTITUTION.academicYear}</div>
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT AREA -->
      <div class="sd-content" id="sdContent">
        <!-- injected by JS -->
      </div>

    </main>
  `;

  injectDashboardStyles();

  // Init after DOM insertion
  requestAnimationFrame(() => initDashboard(wrapper));

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

// ── Init logic ────────────────────────────────

function initDashboard(wrapper) {
  const navItems  = wrapper.querySelectorAll('.sd-nav-item');
  const content   = wrapper.querySelector('#sdContent');
  const pageTitle = wrapper.querySelector('#pageTitle');
  const breadcrumb= wrapper.querySelector('#breadcrumbPage');

  const pages = {
    overview:   { title: 'Overview',          crumb: 'Dashboard',      render: renderOverview },
    attendance: { title: 'Attendance',         crumb: 'Attendance',     render: renderAttendance },
    marks:      { title: 'Marks & Grades',     crumb: 'Marks',          render: renderMarks },
    leaves:     { title: 'Leave Requests',     crumb: 'Leaves',         render: renderLeaves },
    apply:      { title: 'Apply for Leave',    crumb: 'Apply Leave',    render: renderApplyLeave },
    hostel:     { title: 'Hostel Leave',       crumb: 'Hostel Leave',   render: renderHostelPage },
    notices:    { title: 'Notices',            crumb: 'Notices',        render: renderNotices },
    profile:    { title: 'My Profile',         crumb: 'Profile',        render: renderProfile },
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

      // Init apply form after render
      // Init forms after render
      if (pageId === 'apply')  initApplyForm(content);
      if (pageId === 'hostel') initHostelForm(content);
    }, 150);
  }

  navItems.forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });

  // Default page
  navigate('overview');
}

// ═══════════════════════════════════════════════
//  PAGE RENDERERS
// ═══════════════════════════════════════════════

// ── OVERVIEW ─────────────────────────────────

function renderOverview() {
  const el = document.createElement('div');
  el.innerHTML = `

    <div class="sd-welcome-bar">
      <div>
        <div class="sd-welcome-text">Good morning, ${STUDENT.name.split(' ')[0]} 👋</div>
        <div class="sd-welcome-sub">${STUDENT.department} &nbsp;·&nbsp; ${STUDENT.semester} &nbsp;·&nbsp; Batch ${STUDENT.batch}</div>
      </div>
      <div class="sd-welcome-date">${new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</div>
    </div>

    <!-- STAT CARDS -->
    <div class="sd-stat-grid">
      ${statCard('Overall Attendance', STATS.attendance + '%', STATS.attendance >= 75 ? 'success' : 'danger', 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z', STATS.attendance >= 75 ? 'On track' : 'Below minimum')}
      ${statCard('CGPA', STUDENT.cgpa, 'gold', 'M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L3 10.26V15c0 3.31 4.03 6 9 6s9-2.69 9-6v-4.74L12 15.5z', 'Current semester')}
      ${statCard('Leaves Used', `${STATS.leavesUsed} / ${STATS.leavesTotal}`, 'navy', 'M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.93.5 13.5.5c-1.32 0-2.46.56-3.31 1.44L9 3.17l-1.19-1.23C6.96 1.06 5.82.5 4.5.5 2.07.5 0 2.54 0 4.66c0 .46.11.9.18 1.34H0v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z', `${STATS.leavesTotal - STATS.leavesUsed} remaining`)}
      ${statCard('Pending Approval', STATS.pendingLeaves, 'warn', 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z', 'Awaiting response')}
    </div>

    <!-- TWO COLUMN -->
    <div class="sd-two-col">

      <!-- ATTENDANCE SUMMARY -->
      <div class="sd-card">
        <div class="sd-card-header">
          <div class="sd-card-title">Attendance Summary</div>
          <span class="sd-card-tag">This Semester</span>
        </div>
        <div class="att-summary-list">
          ${ATTENDANCE.map(s => `
            <div class="att-row">
              <div class="att-row-left">
                <div class="att-subject">${s.subject}</div>
                <div class="att-code">${s.code} &nbsp;·&nbsp; ${s.present}/${s.total} classes</div>
              </div>
              <div class="att-row-right">
                <div class="att-bar-wrap">
                  <div class="att-bar-fill" style="width:${s.percent}%;background:${s.percent >= 75 ? 'var(--success)' : s.percent >= 60 ? 'var(--warn)' : 'var(--danger)'}"></div>
                </div>
                <div class="att-percent" style="color:${s.percent >= 75 ? 'var(--success)' : s.percent >= 60 ? 'var(--warn)' : 'var(--danger)'}">${s.percent}%</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="sd-right-col">

        <!-- RECENT LEAVES -->
        <div class="sd-card" style="margin-bottom:20px">
          <div class="sd-card-header">
            <div class="sd-card-title">Recent Leaves</div>
            <span class="sd-card-tag">${STATS.leavesUsed} applied</span>
          </div>
          <div class="leave-mini-list">
            ${LEAVES.slice(0, 3).map(l => `
              <div class="leave-mini-row">
                <div>
                  <div class="lmr-type">${l.type}</div>
                  <div class="lmr-date">${l.from}${l.days > 1 ? ' → ' + l.to : ''} &nbsp;·&nbsp; ${l.days} day${l.days > 1 ? 's' : ''}</div>
                </div>
                <span class="badge badge-${l.status}">${l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- NOTICES -->
        <div class="sd-card">
          <div class="sd-card-header">
            <div class="sd-card-title">Latest Notices</div>
          </div>
          <div class="notice-mini-list">
            ${NOTICES.map(n => `
              <div class="notice-mini-row">
                <div class="notice-mini-tag">${n.tag}</div>
                <div class="notice-mini-title">${n.title}</div>
                <div class="notice-mini-date">${n.date}</div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;
  return el;
}

// ── ATTENDANCE ───────────────────────────────

function renderAttendance() {
  const el = document.createElement('div');
  const overall = Math.round(ATTENDANCE.reduce((s, a) => s + a.percent, 0) / ATTENDANCE.length);
  el.innerHTML = `
    <div class="sd-card" style="margin-bottom:20px">
      <div class="sd-card-header">
        <div class="sd-card-title">Overall Attendance</div>
        <span class="sd-card-tag ${overall >= 75 ? 'tag-success' : 'tag-danger'}">${overall}% — ${overall >= 75 ? 'Good Standing' : 'Below Minimum'}</span>
      </div>
      <div class="att-overall-bar">
        <div class="att-overall-fill" style="width:${overall}%"></div>
        <div class="att-threshold" style="left:${INSTITUTION.leavePolicy.minAttendancePercent}%">
          <div class="att-threshold-line"></div>
          <div class="att-threshold-label">${INSTITUTION.leavePolicy.minAttendancePercent}% minimum</div>
        </div>
      </div>
    </div>

    <div class="sd-card">
      <div class="sd-card-header">
        <div class="sd-card-title">Subject-wise Attendance</div>
        <span class="sd-card-tag">Semester 5</span>
      </div>
      <table class="sd-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Code</th>
            <th>Present</th>
            <th>Total</th>
            <th>Percentage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${ATTENDANCE.map(a => `
            <tr>
              <td><strong>${a.subject}</strong></td>
              <td class="td-muted">${a.code}</td>
              <td>${a.present}</td>
              <td>${a.total}</td>
              <td>
                <div class="td-bar-wrap">
                  <div class="td-bar-fill" style="width:${a.percent}%;background:${a.percent >= 75 ? 'var(--success)' : a.percent >= 60 ? 'var(--warn)' : 'var(--danger)'}"></div>
                </div>
                <span style="font-weight:600;color:${a.percent >= 75 ? 'var(--success)' : a.percent >= 60 ? 'var(--warn)' : 'var(--danger)'}">${a.percent}%</span>
              </td>
              <td>
                <span class="badge ${a.percent >= 75 ? 'badge-approved' : a.percent >= 60 ? 'badge-pending' : 'badge-rejected'}">
                  ${a.percent >= 75 ? 'Good' : a.percent >= 60 ? 'Low' : 'Critical'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  return el;
}

// ── MARKS ────────────────────────────────────

function renderMarks() {
  const el = document.createElement('div');
  const gradeColors = { 'O':'var(--success)', 'A+':'var(--success)', 'A':'#2563EB', 'B+':'var(--gold)', 'B':'var(--warn)', 'F':'var(--danger)' };

  el.innerHTML = `
    <div class="sd-stat-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      ${statCard('CGPA', STUDENT.cgpa, 'gold', 'M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L3 10.26V15c0 3.31 4.03 6 9 6s9-2.69 9-6v-4.74L12 15.5z', 'Current')}
      ${statCard('Subjects', STATS.subjects, 'navy', 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z', 'This semester')}
      ${statCard('Best Grade', 'O', 'success', 'M12 3L1 9l11 6 9-4.91V17h2V9L12 3z', 'Database Mgmt')}
    </div>

    <div class="sd-card">
      <div class="sd-card-header">
        <div class="sd-card-title">Semester 5 — Marks Sheet</div>
        <span class="sd-card-tag">Internal + External</span>
      </div>
      <table class="sd-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Code</th>
            <th>Internal (30)</th>
            <th>External (95)</th>
            <th>Total (125)</th>
            <th>Percent</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          ${MARKS.map(m => {
            const pct = Math.round((m.total / m.max) * 100);
            return `
              <tr>
                <td><strong>${m.subject}</strong></td>
                <td class="td-muted">${m.code}</td>
                <td>${m.internal}</td>
                <td>${m.external}</td>
                <td><strong>${m.total}</strong></td>
                <td>
                  <div class="td-bar-wrap">
                    <div class="td-bar-fill" style="width:${pct}%;background:var(--gold)"></div>
                  </div>
                  ${pct}%
                </td>
                <td>
                  <span class="grade-pill" style="color:${gradeColors[m.grade]};background:${gradeColors[m.grade]}18">
                    ${m.grade}
                  </span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <!-- GRADE LEGEND -->
      <div class="grade-legend">
        ${INSTITUTION.gradingScale.map(g => `
          <div class="gl-item">
            <span class="grade-pill" style="color:${gradeColors[g.grade]||'var(--text-muted)'};background:${gradeColors[g.grade]||'#aaa'}18">${g.grade}</span>
            <span class="gl-label">${g.label} (≥${g.minPercent}%)</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return el;
}

// ── LEAVES ───────────────────────────────────

function renderLeaves() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="sd-stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      ${statCard('Total Applied', STATS.leavesUsed, 'navy',    'M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.93.5 13.5.5c-1.32 0-2.46.56-3.31 1.44L9 3.17l-1.19-1.23C6.96 1.06 5.82.5 4.5.5 2.07.5 0 2.54 0 4.66c0 .46.11.9.18 1.34H0v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z', 'This semester')}
      ${statCard('Approved',     LEAVES.filter(l=>l.status==='approved').length, 'success', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z', 'Leaves')}
      ${statCard('Pending',      LEAVES.filter(l=>l.status==='pending').length,  'warn',    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z', 'Awaiting')}
      ${statCard('Remaining',    STATS.leavesTotal - STATS.leavesUsed, 'gold',   'M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L3 10.26V15c0 3.31 4.03 6 9 6s9-2.69 9-6v-4.74L12 15.5z', `of ${STATS.leavesTotal}`)}
    </div>

    <div class="sd-card">
      <div class="sd-card-header">
        <div class="sd-card-title">All Leave Requests</div>
        <span class="sd-card-tag">${INSTITUTION.academicYear}</span>
      </div>
      <div class="leave-list">
        ${LEAVES.map(l => `
          <div class="leave-item">
            <div class="leave-item-top">
              <div class="leave-item-left">
                <div class="leave-item-type">${l.type}</div>
                <div class="leave-item-meta">
                  ${l.from}${l.days > 1 ? ' → ' + l.to : ''}
                  &nbsp;·&nbsp; ${l.days} day${l.days > 1 ? 's' : ''}
                  &nbsp;·&nbsp; Applied ${l.appliedOn}
                  &nbsp;·&nbsp; <span class="td-muted">${l.id}</span>
                </div>
              </div>
              <span class="badge badge-${l.status}">${l.status.charAt(0).toUpperCase() + l.status.slice(1)}</span>
            </div>
            <div class="leave-item-reason">"${l.reason}"</div>
            ${l.comment ? `<div class="leave-item-comment"><strong>Admin:</strong> ${l.comment}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return el;
}

// ── APPLY LEAVE ──────────────────────────────

function renderApplyLeave() {
  const el = document.createElement('div');
  const remaining = STATS.leavesTotal - STATS.leavesUsed;

  el.innerHTML = `
    <div class="sd-two-col" style="align-items:flex-start">

      <div class="sd-card">
        <div class="sd-card-header">
          <div class="sd-card-title">New Leave Application</div>
          <span class="sd-card-tag">${remaining} leaves remaining</span>
        </div>

        <form id="applyForm" novalidate>

          <div class="form-group">
            <label class="form-label">Leave Type</label>
            <select class="form-input" id="leaveType">
              <option value="">Select leave type</option>
              <option>Medical Leave</option>
              <option>Personal Leave</option>
              <option>Family Function</option>
              <option>Academic Event</option>
              <option>Other</option>
            </select>
            <div class="field-error" id="leaveTypeErr"></div>
          </div>

          <div class="apply-date-row">
            <div class="form-group" style="flex:1">
              <label class="form-label">From Date</label>
              <input type="date" class="form-input" id="fromDate" />
              <div class="field-error" id="fromDateErr"></div>
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">To Date</label>
              <input type="date" class="form-input" id="toDate" />
              <div class="field-error" id="toDateErr"></div>
            </div>
          </div>

          <div class="apply-days-preview" id="daysPreview" style="display:none">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
            </svg>
            <span id="daysPreviewText"></span>
          </div>

          <div class="form-group">
            <label class="form-label">Reason</label>
            <textarea class="form-input" id="leaveReason" rows="4"
              placeholder="Describe the reason for your leave request..."></textarea>
            <div class="field-error" id="leaveReasonErr"></div>
          </div>

          ${INSTITUTION.leavePolicy.requiresDocument ? `
            <div class="form-group">
              <label class="form-label">Supporting Document <span style="color:var(--text-muted);font-weight:400">(optional)</span></label>
              <div class="file-upload-area" id="fileUploadArea">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" style="fill:var(--text-muted);margin-bottom:8px">
                  <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                </svg>
                <div class="fua-text">Drag & drop or <span>browse file</span></div>
                <div class="fua-hint">PDF, JPG, PNG up to 5MB</div>
                <input type="file" id="fileInput" accept=".pdf,.jpg,.jpeg,.png" style="display:none" />
              </div>
              <div class="file-chosen" id="fileChosen" style="display:none"></div>
            </div>
          ` : ''}

          <div class="apply-form-footer">
            <button type="submit" class="btn-login" id="applyBtn" style="width:auto;padding:12px 32px">
              <span id="applyBtnText">Submit Application</span>
              <div class="login-spinner" id="applySpinner"></div>
            </button>
            <div class="apply-note">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style="fill:var(--text-muted)">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              Admin will respond within ${INSTITUTION.leavePolicy.autoRejectAfterDays} days
            </div>
          </div>

          <div class="login-error-banner" id="applyError" style="display:none;margin-top:16px">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span id="applyErrorText"></span>
          </div>

          <div class="apply-success" id="applySuccess" style="display:none">
            <div class="apply-success-icon">✓</div>
            <div class="apply-success-title">Application Submitted!</div>
            <div class="apply-success-sub">Your leave request has been sent to the admin for review.</div>
          </div>

        </form>
      </div>

      <!-- POLICY INFO -->
      <div>
        <div class="sd-card" style="margin-bottom:16px">
          <div class="sd-card-title" style="margin-bottom:16px">Leave Policy</div>
          <div class="policy-row">
            <div class="policy-key">Max leaves / semester</div>
            <div class="policy-val">${INSTITUTION.leavePolicy.maxLeavesPerSemester}</div>
          </div>
          <div class="policy-row">
            <div class="policy-key">Leaves used</div>
            <div class="policy-val">${STATS.leavesUsed}</div>
          </div>
          <div class="policy-row">
            <div class="policy-key">Remaining</div>
            <div class="policy-val" style="color:var(--success);font-weight:600">${remaining}</div>
          </div>
          <div class="policy-row">
            <div class="policy-key">Min. attendance required</div>
            <div class="policy-val">${INSTITUTION.leavePolicy.minAttendancePercent}%</div>
          </div>
          <div class="policy-row" style="border:none">
            <div class="policy-key">Auto-reject if no response in</div>
            <div class="policy-val">${INSTITUTION.leavePolicy.autoRejectAfterDays} days</div>
          </div>
        </div>

        <div class="sd-card">
          <div class="sd-card-title" style="margin-bottom:16px">Tips</div>
          <ul class="tips-list">
            <li>Apply at least 2 days in advance for planned leaves</li>
            <li>Always attach a document for medical leaves</li>
            <li>Keep your attendance above ${INSTITUTION.leavePolicy.minAttendancePercent}% at all times</li>
            <li>Check your leave status in the Leave Requests section</li>
          </ul>
        </div>
      </div>

    </div>
  `;
  return el;
}

// ── HOSTEL LEAVE PAGE ─────────────────────────

function renderHostelPage() {
  const el = document.createElement('div');

  el.innerHTML = `

    <!-- STATS ROW -->
    <div class="sd-stat-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      ${statCard('Total Applied',  HOSTEL_LEAVES.length, 'navy',
        'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', 'This semester')}
      ${statCard('Approved',
        HOSTEL_LEAVES.filter(h => h.status === 'approved').length, 'success',
        'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z', 'Leaves')}
      ${statCard('Pending',
        HOSTEL_LEAVES.filter(h => h.status === 'pending').length, 'warn',
        'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
        'Awaiting warden')}
      ${statCard('Warden',  'Mr. R. Kumar', 'gold',
        'M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
        'Your warden')}
    </div>

    <div class="sd-two-col" style="align-items:flex-start">

      <!-- APPLY FORM -->
      <div class="sd-card">
        <div class="sd-card-header">
          <div class="sd-card-title">New Hostel Leave Application</div>
          <span class="sd-card-tag" style="background:#EFF6FF;color:#1E40AF;border-color:#BFDBFE">
            No document required
          </span>
        </div>

        <div class="hostel-info-bar">
          <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
            10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          Hostel leave requires warden approval only. No documents needed.
          Return on time to avoid penalty.
        </div>

        <form id="hostelForm" novalidate>

          <!-- REASON -->
          <div class="form-group">
            <label class="form-label">Reason for Leave</label>
            <select class="form-input" id="hostelReason">
              <option value="">Select reason</option>
              <option>Going home</option>
              <option>Medical checkup</option>
              <option>Family function</option>
              <option>Family emergency</option>
              <option>Personal work</option>
              <option>Other</option>
            </select>
            <div class="field-error" id="hostelReasonErr"></div>
          </div>

          <!-- DESCRIPTION -->
          <div class="form-group">
            <label class="form-label">Brief Description</label>
            <textarea class="form-input" id="hostelDesc" rows="3"
              placeholder="Give a short description of your reason..."></textarea>
            <div class="field-error" id="hostelDescErr"></div>
          </div>

          <!-- DEPARTURE -->
          <div class="hostel-section-label">Departure</div>
          <div class="hostel-datetime-row">
            <div class="form-group" style="flex:1">
              <label class="form-label">Date</label>
              <input type="date" class="form-input" id="hostelFromDate" />
              <div class="field-error" id="hostelFromDateErr"></div>
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">Time</label>
              <input type="time" class="form-input" id="hostelFromTime" />
              <div class="field-error" id="hostelFromTimeErr"></div>
            </div>
          </div>

          <!-- RETURN -->
          <div class="hostel-section-label">Expected Return</div>
          <div class="hostel-datetime-row">
            <div class="form-group" style="flex:1">
              <label class="form-label">Date</label>
              <input type="date" class="form-input" id="hostelToDate" />
              <div class="field-error" id="hostelToDateErr"></div>
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">Time</label>
              <input type="time" class="form-input" id="hostelToTime" />
              <div class="field-error" id="hostelToTimeErr"></div>
            </div>
          </div>

          <!-- DURATION PREVIEW -->
          <div class="apply-days-preview" id="hostelDuration" style="display:none">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99
              10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24
              16L11 13V7h1.5v5.25l4.5 2.67-.77 1.08z"/>
            </svg>
            <span id="hostelDurationText"></span>
          </div>

          <!-- PARENT CONTACT -->
          <div class="form-group">
            <label class="form-label">Parent / Guardian Contact Number</label>
            <input type="tel" class="form-input" id="hostelParentPhone"
              placeholder="e.g. +91 98765 43210" />
            <div class="field-error" id="hostelParentPhoneErr"></div>
          </div>

          <!-- DESTINATION -->
          <div class="form-group">
            <label class="form-label">Destination Address</label>
            <input type="text" class="form-input" id="hostelDestination"
              placeholder="e.g. 12 MG Road, Bengaluru" />
            <div class="field-error" id="hostelDestinationErr"></div>
          </div>

          <div class="apply-form-footer">
            <button type="submit" class="btn-login"
              id="hostelBtn" style="width:auto;padding:12px 32px">
              <span id="hostelBtnText">Submit to Warden</span>
              <div class="login-spinner" id="hostelSpinner"></div>
            </button>
            <div class="apply-note">
              <svg viewBox="0 0 24 24" fill="currentColor"
                width="14" height="14" style="fill:var(--text-muted)">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10
                10 10 10-4.48 10-10S17.52 2 12 2zm1
                15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              Warden reviews within 24 hours
            </div>
          </div>

          <div class="login-error-banner" id="hostelError"
            style="display:none;margin-top:16px">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10
              10 10 10-4.48 10-10S17.52 2 12 2zm1
              15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span id="hostelErrorText"></span>
          </div>

          <div class="apply-success" id="hostelSuccess" style="display:none">
            <div class="apply-success-icon">✓</div>
            <div class="apply-success-title">Submitted to Warden!</div>
            <div class="apply-success-sub">
              Your hostel leave request has been sent to Mr. Ramesh Kumar for approval.
            </div>
          </div>

        </form>
      </div>

      <!-- RIGHT COLUMN -->
      <div>

        <!-- PAST HOSTEL LEAVES -->
        <div class="sd-card" style="margin-bottom:16px">
          <div class="sd-card-header">
            <div class="sd-card-title">Past Hostel Leaves</div>
            <span class="sd-card-tag">${HOSTEL_LEAVES.length} total</span>
          </div>
          <div class="hostel-leave-list">
            ${HOSTEL_LEAVES.map(h => `
              <div class="hostel-leave-item">
                <div class="hostel-leave-top">
                  <div>
                    <div class="hostel-leave-reason">${h.reason}</div>
                    <div class="hostel-leave-id">${h.id}</div>
                  </div>
                  <span class="badge badge-${h.status}">
                    ${h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                  </span>
                </div>
                <div class="hostel-leave-times">
                  <div class="hostel-time-block">
                    <div class="htb-label">Departure</div>
                    <div class="htb-date">${h.from}</div>
                    <div class="htb-time">${h.fromTime}</div>
                  </div>
                  <div class="hostel-time-arrow">
                    <svg viewBox="0 0 24 24" fill="currentColor"
                      width="16" height="16" style="fill:var(--text-muted)">
                      <path d="M12 4l-1.41 1.41L16.17
                      11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                    </svg>
                  </div>
                  <div class="hostel-time-block">
                    <div class="htb-label">Return</div>
                    <div class="htb-date">${h.to}</div>
                    <div class="htb-time">${h.toTime}</div>
                  </div>
                </div>
                ${h.comment
                  ? `<div class="leave-item-comment">
                      <strong>Warden:</strong> ${h.comment}
                     </div>`
                  : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- HOSTEL RULES -->
        <div class="sd-card">
          <div class="sd-card-title" style="margin-bottom:14px">Hostel Rules</div>
          <ul class="tips-list">
            <li>Apply at least 24 hours before departure</li>
            <li>Return by the exact time mentioned in your application</li>
            <li>Late return without notice will be marked as unauthorised absence</li>
            <li>Parent contact number must be reachable during the leave period</li>
            <li>Emergency leaves can be applied with warden's verbal approval</li>
          </ul>
        </div>

      </div>
    </div>
  `;

  injectHostelStyles();
  return el;
}

function initHostelForm(container) {
  const form            = container.querySelector('#hostelForm');
  if (!form) return;

  const fromDate        = container.querySelector('#hostelFromDate');
  const fromTime        = container.querySelector('#hostelFromTime');
  const toDate          = container.querySelector('#hostelToDate');
  const toTime          = container.querySelector('#hostelToTime');
  const durationPreview = container.querySelector('#hostelDuration');
  const durationText    = container.querySelector('#hostelDurationText');
  const hostelBtn       = container.querySelector('#hostelBtn');
  const hostelBtnTxt    = container.querySelector('#hostelBtnText');
  const hostelSpinner   = container.querySelector('#hostelSpinner');
  const hostelSuccess   = container.querySelector('#hostelSuccess');

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  fromDate.min = today;
  toDate.min   = today;

  // Duration preview — updates whenever any date/time field changes
  function updateDuration() {
    if (fromDate.value && fromTime.value && toDate.value && toTime.value) {
      const start = new Date(`${fromDate.value}T${fromTime.value}`);
      const end   = new Date(`${toDate.value}T${toTime.value}`);
      const diffMs = end - start;

      if (diffMs <= 0) {
        durationPreview.style.display = 'none';
        return;
      }

      const totalMins = Math.floor(diffMs / 60000);
      const days  = Math.floor(totalMins / 1440);
      const hours = Math.floor((totalMins % 1440) / 60);
      const mins  = totalMins % 60;

      let label = '';
      if (days > 0)  label += `${days} day${days > 1 ? 's' : ''} `;
      if (hours > 0) label += `${hours} hr${hours > 1 ? 's' : ''} `;
      if (mins > 0)  label += `${mins} min`;

      durationText.textContent = `Duration: ${label.trim()}`;
      durationPreview.style.display = 'flex';
    } else {
      durationPreview.style.display = 'none';
    }
  }

  [fromDate, fromTime, toDate, toTime].forEach(el =>
    el.addEventListener('change', updateDuration)
  );

  fromDate.addEventListener('change', () => {
    toDate.min = fromDate.value;
  });

  // Required fields
  const required = [
    { id: 'hostelReason',      errId: 'hostelReasonErr',      msg: 'Please select a reason' },
    { id: 'hostelDesc',        errId: 'hostelDescErr',        msg: 'Please add a brief description' },
    { id: 'hostelFromDate',    errId: 'hostelFromDateErr',    msg: 'Select departure date' },
    { id: 'hostelFromTime',    errId: 'hostelFromTimeErr',    msg: 'Select departure time' },
    { id: 'hostelToDate',      errId: 'hostelToDateErr',      msg: 'Select return date' },
    { id: 'hostelToTime',      errId: 'hostelToTimeErr',      msg: 'Select return time' },
    { id: 'hostelParentPhone', errId: 'hostelParentPhoneErr', msg: 'Enter parent contact number' },
    { id: 'hostelDestination', errId: 'hostelDestinationErr', msg: 'Enter destination address' },
  ];

  // Clear errors on input
  required.forEach(f => {
    container.querySelector('#' + f.id)?.addEventListener('input', () => {
      const el  = container.querySelector('#' + f.id);
      const err = container.querySelector('#' + f.errId);
      el.classList.remove('input-error');
      err.style.display = 'none';
    });
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    required.forEach(f => {
      const el  = container.querySelector('#' + f.id);
      const err = container.querySelector('#' + f.errId);
      if (!el.value.trim()) {
        el.classList.add('input-error');
        err.textContent   = f.msg;
        err.style.display = 'block';
        valid = false;
      }
    });

    // Extra: validate return is after departure
    if (fromDate.value && fromTime.value && toDate.value && toTime.value) {
      const start = new Date(`${fromDate.value}T${fromTime.value}`);
      const end   = new Date(`${toDate.value}T${toTime.value}`);
      if (end <= start) {
        const err = container.querySelector('#hostelToTimeErr');
        container.querySelector('#hostelToTime').classList.add('input-error');
        err.textContent   = 'Return must be after departure';
        err.style.display = 'block';
        valid = false;
      }
    }

    if (!valid) return;

    // Loading state
    hostelBtn.disabled        = true;
    hostelBtnTxt.style.opacity = '0';
    hostelSpinner.style.display = 'block';

    await new Promise(r => setTimeout(r, 1400));

    // Show success
    form.querySelectorAll('.form-group, .hostel-datetime-row, .hostel-section-label, .apply-days-preview, .apply-form-footer, .hostel-info-bar')
      .forEach(el => el.style.display = 'none');
    hostelSuccess.style.display = 'block';
  });
}

// ── NOTICES ──────────────────────────────────

function renderNotices() {
  const el = document.createElement('div');
  const all = [
    ...NOTICES,
    { title: 'Project Submission Deadline — May 10', date: 'Apr 12, 2026', tag: 'Academic' },
    { title: 'Sports Day — Apr 28, Registration Open',  date: 'Apr 10, 2026', tag: 'Event' },
    { title: 'Library Timings Extended till 9 PM', date: 'Apr 8, 2026', tag: 'Info' },
  ];
  const tagColors = { Exam:'#DBEAFE:#1E40AF', Holiday:'#D1FAE5:#065F46', Marks:'#FEF3C7:#92400E', Academic:'#EDE9FE:#5B21B6', Event:'#FCE7F3:#9D174D', Info:'#F0F9FF:#0369A1' };

  el.innerHTML = `
    <div class="sd-card">
      <div class="sd-card-header">
        <div class="sd-card-title">College Notices</div>
        <span class="sd-card-tag">${all.length} notices</span>
      </div>
      <div class="notice-full-list">
        ${all.map(n => {
          const [bg, color] = (tagColors[n.tag] || '#F1F5F9:#64748B').split(':');
          return `
            <div class="notice-full-row">
              <div class="notice-full-left">
                <span class="notice-full-tag" style="background:${bg};color:${color}">${n.tag}</span>
                <div class="notice-full-title">${n.title}</div>
              </div>
              <div class="notice-full-date">${n.date}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  return el;
}

// ── PROFILE ──────────────────────────────────

function renderProfile() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="sd-two-col" style="align-items:flex-start">
      <div class="sd-card">
        <div class="sd-card-title" style="margin-bottom:24px">Personal Information</div>
        <div class="profile-avatar-row">
          <div class="profile-avatar">${STUDENT.initials}</div>
          <div>
            <div class="profile-name">${STUDENT.name}</div>
            <div class="profile-role">Student &nbsp;·&nbsp; ${STUDENT.department}</div>
          </div>
        </div>
        <hr class="divider" />
        ${profileRow('Roll Number',  STUDENT.rollNumber)}
        ${profileRow('Department',   STUDENT.department)}
        ${profileRow('Semester',     STUDENT.semester)}
        ${profileRow('Batch',        STUDENT.batch)}
        ${profileRow('Email',        STUDENT.email)}
        ${profileRow('Phone',        STUDENT.phone)}
        ${profileRow('Institution',  INSTITUTION.name)}
      </div>

      <div class="sd-card">
        <div class="sd-card-title" style="margin-bottom:24px">Academic Summary</div>
        ${profileRow('CGPA',             STUDENT.cgpa)}
        ${profileRow('Overall Attendance', STATS.attendance + '%')}
        ${profileRow('Subjects Enrolled', STATS.subjects)}
        ${profileRow('Leaves Used',       `${STATS.leavesUsed} / ${STATS.leavesTotal}`)}
        ${profileRow('Academic Year',     INSTITUTION.academicYear)}
      </div>
    </div>
  `;
  return el;
}

function profileRow(label, value) {
  return `
    <div class="profile-row">
      <div class="profile-row-label">${label}</div>
      <div class="profile-row-value">${value}</div>
    </div>
  `;
}

// ── STAT CARD HELPER ─────────────────────────

function statCard(label, value, color, iconPath, sub) {
  const colors = {
    success: { bg: '#F0FDF4', text: 'var(--success)', icon: '#D1FAE5' },
    danger:  { bg: '#FEF2F2', text: 'var(--danger)',  icon: '#FEE2E2' },
    gold:    { bg: '#FFFBEB', text: 'var(--gold)',    icon: '#FEF3C7' },
    navy:    { bg: '#EFF6FF', text: 'var(--navy)',    icon: '#DBEAFE' },
    warn:    { bg: '#FFFBEB', text: 'var(--warn)',    icon: '#FEF3C7' },
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

// ── APPLY FORM LOGIC ─────────────────────────

function initApplyForm(container) {
  const form        = container.querySelector('#applyForm');
  if (!form) return;

  const fromDate    = container.querySelector('#fromDate');
  const toDate      = container.querySelector('#toDate');
  const daysPreview = container.querySelector('#daysPreview');
  const daysText    = container.querySelector('#daysPreviewText');
  const fileArea    = container.querySelector('#fileUploadArea');
  const fileInput   = container.querySelector('#fileInput');
  const fileChosen  = container.querySelector('#fileChosen');
  const applyBtn    = container.querySelector('#applyBtn');
  const applyBtnTxt = container.querySelector('#applyBtnText');
  const applySpinner= container.querySelector('#applySpinner');
  const applyError  = container.querySelector('#applyError');
  const applyErrorT = container.querySelector('#applyErrorText');
  const applySuccess= container.querySelector('#applySuccess');

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  fromDate.min = today;
  toDate.min   = today;

  // Days preview
  function updateDays() {
    if (fromDate.value && toDate.value) {
      const diff = Math.round((new Date(toDate.value) - new Date(fromDate.value)) / 86400000) + 1;
      if (diff > 0) {
        daysText.textContent = `${diff} day${diff > 1 ? 's' : ''} selected`;
        daysPreview.style.display = 'flex';
        return;
      }
    }
    daysPreview.style.display = 'none';
  }
  fromDate.addEventListener('change', () => { toDate.min = fromDate.value; updateDays(); });
  toDate.addEventListener('change', updateDays);

  // File upload
  if (fileArea && fileInput) {
    fileArea.addEventListener('click', () => fileInput.click());
    fileArea.addEventListener('dragover', e => { e.preventDefault(); fileArea.classList.add('fua-drag'); });
    fileArea.addEventListener('dragleave', () => fileArea.classList.remove('fua-drag'));
    fileArea.addEventListener('drop', e => {
      e.preventDefault();
      fileArea.classList.remove('fua-drag');
      if (e.dataTransfer.files[0]) showFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) showFile(fileInput.files[0]);
    });
  }

  function showFile(file) {
    fileArea.style.display = 'none';
    fileChosen.style.display = 'flex';
    fileChosen.innerHTML = `
      <svg viewBox="0 0 24 24" fill="var(--success)" width="16" height="16">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
      </svg>
      ${file.name}
      <button type="button" onclick="this.parentElement.style.display='none';document.getElementById('fileUploadArea').style.display='flex'" style="background:none;border:none;cursor:pointer;color:var(--danger);margin-left:auto;font-size:13px">Remove</button>
    `;
  }

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    applyError.style.display = 'none';
    let valid = true;

    const fields = [
      { id: 'leaveType',   errId: 'leaveTypeErr',   msg: 'Please select a leave type' },
      { id: 'fromDate',    errId: 'fromDateErr',     msg: 'Please select a start date' },
      { id: 'toDate',      errId: 'toDateErr',       msg: 'Please select an end date' },
      { id: 'leaveReason', errId: 'leaveReasonErr',  msg: 'Please enter a reason' },
    ];

    fields.forEach(f => {
      const el  = container.querySelector('#' + f.id);
      const err = container.querySelector('#' + f.errId);
      if (!el.value.trim()) {
        el.classList.add('input-error');
        err.textContent = f.msg;
        err.style.display = 'block';
        valid = false;
      } else {
        el.classList.remove('input-error');
        err.style.display = 'none';
      }
    });

    if (!valid) return;

    // Loading
    applyBtn.disabled = true;
    applyBtnTxt.style.opacity = '0';
    applySpinner.style.display = 'block';

    await new Promise(r => setTimeout(r, 1400));

    applyBtn.style.display    = 'none';
    applySpinner.style.display= 'none';
    form.querySelectorAll('.form-group').forEach(g => g.style.display = 'none');
    form.querySelector('.apply-date-row')?.style && (form.querySelector('.apply-date-row').style.display = 'none');
    form.querySelector('.apply-form-footer').style.display = 'none';
    applySuccess.style.display = 'block';
  });
}

// ═══════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════

function injectDashboardStyles() {
  if (document.getElementById('sd-styles')) return;
  const style = document.createElement('style');
  style.id = 'sd-styles';
  style.textContent = `
    /* LAYOUT */
    .sd-wrapper { display:grid;grid-template-columns:240px 1fr;min-height:100vh;background:var(--cream); }

    /* SIDEBAR */
    .sd-sidebar { background:var(--navy);display:flex;flex-direction:column;justify-content:space-between;position:sticky;top:0;height:100vh;overflow-y:auto; }
    .sd-sidebar-top { padding:24px 16px; }
    .sd-logo { display:flex;align-items:center;gap:10px;margin-bottom:36px;padding:0 8px; }
    .sd-logo-icon { width:34px;height:34px;background:var(--gold);border-radius:8px;display:flex;align-items:center;justify-content:center; }
    .sd-logo-icon svg { fill:var(--navy); }
    .sd-logo-text { font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--white); }
    .sd-logo-text span { color:var(--gold-light); }
    .sd-nav-label { font-size:10px;font-weight:600;color:rgba(255,255,255,0.28);letter-spacing:1.4px;text-transform:uppercase;padding:0 12px;margin-bottom:4px;margin-top:8px; }
    .sd-nav-item { width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;border:none;background:none;color:rgba(255,255,255,0.55);font-size:13px;font-weight:400;border-radius:8px;cursor:pointer;transition:all .18s;text-align:left;font-family:'DM Sans',sans-serif; }
    .sd-nav-item:hover { background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.9); }
    .sd-nav-item.active { background:rgba(201,153,42,0.18);color:var(--gold-light);font-weight:500; }
    .sd-nav-item.active svg { fill:var(--gold-light); }
    .sd-nav-item svg { fill:currentColor;flex-shrink:0; }

    /* SIDEBAR BOTTOM */
    .sd-sidebar-bottom { padding:16px;border-top:1px solid rgba(255,255,255,0.08); }
    .sd-user-card { display:flex;align-items:center;gap:10px;padding:10px 8px;margin-bottom:8px; }
    .sd-user-avatar { width:34px;height:34px;border-radius:50%;background:rgba(201,153,42,0.2);border:1.5px solid var(--gold);color:var(--gold-light);font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .sd-user-name { font-size:13px;font-weight:500;color:var(--white); }
    .sd-user-roll { font-size:11px;color:rgba(255,255,255,0.35);margin-top:1px; }
    .sd-logout { display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:8px;color:rgba(255,255,255,0.45);font-size:13px;text-decoration:none;transition:all .18s; }
    .sd-logout:hover { background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.8); }
    .sd-logout svg { fill:currentColor; }

    /* MAIN */
    .sd-main { display:flex;flex-direction:column;min-height:100vh;overflow:hidden; }

    /* TOPBAR */
    .sd-topbar { background:var(--white);border-bottom:1px solid var(--border);padding:0 32px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10; }
    .sd-page-title { font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text-dark); }
    .sd-breadcrumb { font-size:12px;color:var(--text-muted);margin-top:2px; }
    .sd-topbar-right { display:flex;align-items:center;gap:20px; }
    .sd-notice-bell { position:relative;cursor:pointer;color:var(--text-muted); }
    .sd-bell-dot { position:absolute;top:-2px;right:-2px;width:8px;height:8px;background:var(--danger);border-radius:50%;border:2px solid var(--white); }
    .sd-topbar-meta { text-align:right; }
    .sd-topbar-sem { font-size:13px;font-weight:500;color:var(--text-dark); }
    .sd-topbar-year { font-size:11px;color:var(--text-muted); }

    /* CONTENT */
    .sd-content { padding:28px 32px;flex:1;transition:opacity .15s ease,transform .15s ease; }

    /* WELCOME BAR */
    .sd-welcome-bar { display:flex;justify-content:space-between;align-items:center;margin-bottom:24px; }
    .sd-welcome-text { font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--text-dark); }
    .sd-welcome-sub { font-size:13px;color:var(--text-muted);margin-top:3px; }
    .sd-welcome-date { font-size:13px;color:var(--text-muted); }

    /* STAT GRID */
    .sd-stat-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px; }
    .stat-card { border-radius:var(--radius-lg);padding:20px;border:1px solid rgba(0,0,0,0.05); }
    .stat-card-icon { width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:14px; }
    .stat-card-val { font-family:'Playfair Display',serif;font-size:26px;font-weight:700;margin-bottom:2px; }
    .stat-card-label { font-size:13px;font-weight:500;color:var(--text-dark);margin-bottom:2px; }
    .stat-card-sub { font-size:11px;color:var(--text-muted); }

    /* TWO COL */
    .sd-two-col { display:grid;grid-template-columns:1fr 1fr;gap:20px; }
    .sd-right-col { display:flex;flex-direction:column; }

    /* CARD */
    .sd-card { background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:0; }
    .sd-card-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:20px; }
    .sd-card-title { font-size:15px;font-weight:600;color:var(--text-dark); }
    .sd-card-tag { font-size:11px;font-weight:500;color:var(--text-muted);background:var(--cream);border:1px solid var(--border);padding:3px 10px;border-radius:4px; }
    .tag-success { color:var(--success)!important;background:#F0FDF4!important;border-color:#BBF7D0!important; }
    .tag-danger  { color:var(--danger)!important; background:#FEF2F2!important;border-color:#FECACA!important; }

    /* ATTENDANCE ROWS */
    .att-summary-list { display:flex;flex-direction:column;gap:14px; }
    .att-row { display:flex;align-items:center;justify-content:space-between;gap:16px; }
    .att-subject { font-size:13px;font-weight:500;color:var(--text-dark); }
    .att-code { font-size:11px;color:var(--text-muted);margin-top:2px; }
    .att-row-right { display:flex;align-items:center;gap:10px;min-width:140px; }
    .att-bar-wrap { flex:1;height:6px;background:var(--border);border-radius:99px;overflow:hidden; }
    .att-bar-fill { height:100%;border-radius:99px;transition:width .6s ease; }
    .att-percent { font-size:12px;font-weight:600;min-width:36px;text-align:right; }

    /* OVERALL ATT BAR */
    .att-overall-bar { position:relative;height:12px;background:var(--border);border-radius:99px;overflow:visible;margin-top:4px; }
    .att-overall-fill { height:100%;background:var(--success);border-radius:99px;transition:width .8s ease; }
    .att-threshold { position:absolute;top:-4px;transform:translateX(-50%); }
    .att-threshold-line { width:2px;height:20px;background:var(--danger);border-radius:1px; }
    .att-threshold-label { font-size:10px;color:var(--danger);white-space:nowrap;margin-top:4px;font-weight:500; }

    /* TABLE */
    .sd-table { width:100%;border-collapse:collapse; }
    .sd-table th { font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;padding:10px 12px;text-align:left;border-bottom:1px solid var(--border); }
    .sd-table td { font-size:13px;color:var(--text-dark);padding:12px 12px;border-bottom:1px solid #F8FAFC;vertical-align:middle; }
    .sd-table tr:last-child td { border-bottom:none; }
    .sd-table tr:hover td { background:#FAFAFA; }
    .td-muted { color:var(--text-muted)!important; }
    .td-bar-wrap { display:inline-block;width:60px;height:5px;background:var(--border);border-radius:99px;overflow:hidden;margin-right:6px;vertical-align:middle; }
    .td-bar-fill { height:100%;border-radius:99px; }
    .grade-pill { display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;width:32px;height:24px;border-radius:4px; }
    .grade-legend { display:flex;flex-wrap:wrap;gap:12px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border); }
    .gl-item { display:flex;align-items:center;gap:6px; }
    .gl-label { font-size:11px;color:var(--text-muted); }

    /* LEAVE LIST */
    .leave-mini-list { display:flex;flex-direction:column;gap:0; }
    .leave-mini-row { display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #F1F5F9; }
    .leave-mini-row:last-child { border-bottom:none; }
    .lmr-type { font-size:13px;font-weight:500;color:var(--text-dark); }
    .lmr-date { font-size:11px;color:var(--text-muted);margin-top:2px; }

    .leave-list { display:flex;flex-direction:column;gap:0; }
    .leave-item { padding:16px 0;border-bottom:1px solid #F1F5F9; }
    .leave-item:last-child { border-bottom:none; }
    .leave-item-top { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px; }
    .leave-item-type { font-size:14px;font-weight:600;color:var(--text-dark); }
    .leave-item-meta { font-size:12px;color:var(--text-muted);margin-top:2px; }
    .leave-item-reason { font-size:13px;color:var(--text-mid);font-style:italic;margin-bottom:4px; }
    .leave-item-comment { font-size:12px;color:var(--text-muted);background:var(--cream);border-radius:6px;padding:6px 10px;margin-top:6px; }

    /* APPLY FORM */
    .apply-date-row { display:flex;gap:16px; }
    .apply-days-preview { display:flex;align-items:center;gap:6px;font-size:12px;color:var(--gold);font-weight:500;background:var(--gold-pale);border:1px solid rgba(201,153,42,0.3);padding:6px 12px;border-radius:6px;margin-bottom:16px; }
    .file-upload-area { border:1.5px dashed var(--border);border-radius:var(--radius-md);padding:28px;text-align:center;cursor:pointer;transition:all .2s; }
    .file-upload-area:hover,.fua-drag { border-color:var(--gold);background:var(--gold-pale); }
    .fua-text { font-size:13px;color:var(--text-muted); }
    .fua-text span { color:var(--gold);font-weight:500; }
    .fua-hint { font-size:11px;color:var(--text-muted);margin-top:4px; }
    .file-chosen { display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-dark);background:#F0FDF4;border:1px solid #BBF7D0;padding:10px 14px;border-radius:8px; }
    .apply-form-footer { display:flex;align-items:center;gap:16px;margin-top:8px; }
    .apply-note { font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:5px; }
    .apply-success { text-align:center;padding:40px 20px; }
    .apply-success-icon { width:56px;height:56px;background:#D1FAE5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;color:var(--success);margin:0 auto 16px;font-weight:700; }
    .apply-success-title { font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--text-dark);margin-bottom:8px; }
    .apply-success-sub { font-size:14px;color:var(--text-muted); }

    /* POLICY */
    .policy-row { display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px; }
    .policy-key { color:var(--text-muted); }
    .policy-val { font-weight:500;color:var(--text-dark); }
    .tips-list { display:flex;flex-direction:column;gap:10px; }
    .tips-list li { font-size:13px;color:var(--text-muted);padding-left:16px;position:relative;line-height:1.5; }
    .tips-list li::before { content:'·';position:absolute;left:0;color:var(--gold);font-weight:700; }

    /* NOTICES */
    .notice-mini-list { display:flex;flex-direction:column;gap:0; }
    .notice-mini-row { padding:10px 0;border-bottom:1px solid #F1F5F9; }
    .notice-mini-row:last-child { border-bottom:none; }
    .notice-mini-tag { font-size:10px;font-weight:600;color:var(--gold);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px; }
    .notice-mini-title { font-size:13px;font-weight:500;color:var(--text-dark); }
    .notice-mini-date { font-size:11px;color:var(--text-muted);margin-top:2px; }
    .notice-full-list { display:flex;flex-direction:column;gap:0; }
    .notice-full-row { display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid #F1F5F9; }
    .notice-full-row:last-child { border-bottom:none; }
    .notice-full-tag { font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px;margin-bottom:5px;display:inline-block; }
    .notice-full-title { font-size:14px;font-weight:500;color:var(--text-dark); }
    .notice-full-date { font-size:12px;color:var(--text-muted);white-space:nowrap;margin-left:24px; }

    /* PROFILE */
    .profile-avatar-row { display:flex;align-items:center;gap:16px;margin-bottom:20px; }
    .profile-avatar { width:56px;height:56px;border-radius:50%;background:rgba(11,29,58,0.1);border:2px solid var(--border);color:var(--navy);font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center; }
    .profile-name { font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--text-dark); }
    .profile-role { font-size:13px;color:var(--text-muted);margin-top:3px; }
    .profile-row { display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--border);font-size:13px; }
    .profile-row:last-child { border-bottom:none; }
    .profile-row-label { color:var(--text-muted); }
    .profile-row-value { font-weight:500;color:var(--text-dark); }

    /* LOGIN SPINNER (reused) */
    .btn-login { width:100%;padding:13px;background:var(--navy);color:var(--white);font-size:15px;font-weight:600;border:none;border-radius:var(--radius-md);cursor:pointer;position:relative;transition:all .2s;font-family:'DM Sans',sans-serif; }
    .btn-login:hover { background:var(--navy-light);transform:translateY(-1px); }
    .btn-login:disabled { opacity:.7;cursor:not-allowed;transform:none; }
    .login-spinner { display:none;width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:var(--white);border-radius:50%;animation:spin .7s linear infinite;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%); }
    @keyframes spin { to { transform:translate(-50%,-50%) rotate(360deg); } }
    .login-error-banner { display:none;align-items:center;gap:8px;background:#FEF2F2;border:1px solid #FECACA;border-radius:var(--radius-md);padding:11px 14px;font-size:13px;color:var(--danger); }
    .field-error { font-size:12px;color:var(--danger);margin-top:5px;display:none; }
    .input-error { border-color:var(--danger)!important;box-shadow:0 0 0 3px rgba(185,28,28,0.08)!important; }
  `;
  document.head.appendChild(style);
}
function injectHostelStyles() {
  if (document.getElementById('hostel-styles')) return;
  const style = document.createElement('style');
  style.id = 'hostel-styles';
  style.textContent = `
    .hostel-info-bar {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      border-radius: var(--radius-md);
      padding: 10px 14px;
      font-size: 13px;
      color: #1E40AF;
      margin-bottom: 22px;
      line-height: 1.5;
    }
    .hostel-info-bar svg { fill: #3B82F6; flex-shrink: 0; margin-top: 1px; }

    .hostel-section-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 10px;
      margin-top: 4px;
    }

    .hostel-datetime-row {
      display: flex;
      gap: 16px;
      margin-bottom: 4px;
    }

    .hostel-leave-list {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .hostel-leave-item {
      padding: 14px 0;
      border-bottom: 1px solid #F1F5F9;
    }
    .hostel-leave-item:last-child { border-bottom: none; }

    .hostel-leave-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .hostel-leave-reason {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-dark);
    }

    .hostel-leave-id {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .hostel-leave-times {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--cream);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 10px 14px;
    }

    .hostel-time-block { flex: 1; }

    .htb-label {
      font-size: 9px;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }

    .htb-date {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-dark);
    }

    .htb-time {
      font-size: 13px;
      font-weight: 700;
      color: var(--navy);
      margin-top: 1px;
    }

    .hostel-time-arrow {
      display: flex;
      align-items: center;
      padding: 0 4px;
    }
  `;
  document.head.appendChild(style);
}