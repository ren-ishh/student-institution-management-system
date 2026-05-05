// ============================================
//  ADMIN DASHBOARD
//  Sections: Overview, Leave Approvals,
//  Hostel Leave Approvals, Students,
//  Attendance, Marks, Notices, Settings
// ============================================

import INSTITUTION from '../../config/institution.js';
import { auth, leaves, hostelLeaves, students, attendance, marks, notices, isLoggedIn } from '../api.js';

// ── Live Data ─────────────────────────────────

let ADMIN = { name: 'Loading...', initials: '..', role: 'Administrator', email: '' };

let PENDING_LEAVES = [];
let PENDING_HOSTEL = [];
let ALL_STUDENTS = [];
let ATTENDANCE_DATA = [];
let MARKS_DATA = [];
let NOTICES_DATA = [];

// ── Load all data from API ───────────────────
async function loadAllData() {
  try {
    const [profile, leavesData, hostelData, studentsData, attData, marksData, noticesData] = await Promise.allSettled([
      auth.me(),
      leaves.getPending(),
      hostelLeaves.getPending(),
      students.getAll(),
      attendance.summary(),
      marks.getPending ? marks.getPending() : Promise.resolve([]), // Adjust to actual admin marks API when built
      notices.getAll(),
    ]);

    if (profile.status === 'fulfilled' && profile.value) {
      const p = profile.value;
      ADMIN = {
        name: p.name || 'Admin',
        initials: (p.name || 'A').split(' ').map(w => w[0]).join(''),
        role: 'Administrator',
        email: p.email || p.name,
      };
    }

    if (leavesData.status === 'fulfilled' && Array.isArray(leavesData.value)) {
      PENDING_LEAVES = leavesData.value.map(l => ({
        id: 'LV' + String(l.id).padStart(3, '0'),
        dbId: l.id,
        student: l.student_name,
        roll: l.roll_number,
        dept: l.department,
        type: l.type,
        from: new Date(l.from_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        to: new Date(l.to_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        days: l.days,
        reason: l.reason,
        appliedOn: new Date(l.applied_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        attendance: 80, // placeholder since API doesn't return this yet
        doc: false
      }));
    }

    if (hostelData.status === 'fulfilled' && Array.isArray(hostelData.value)) {
      PENDING_HOSTEL = hostelData.value.map(h => ({
        id: 'HL' + String(h.id).padStart(3, '0'),
        dbId: h.id,
        student: h.student_name,
        roll: h.roll_number,
        dept: h.department,
        reason: h.reason,
        from: new Date(h.from_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        fromTime: h.from_time ? h.from_time.slice(0,5) : '',
        to: new Date(h.to_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        toTime: h.to_time ? h.to_time.slice(0,5) : '',
        appliedOn: new Date(h.applied_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        parentPhone: h.parent_phone || '',
        destination: h.destination || '',
      }));
    }

    if (studentsData.status === 'fulfilled' && Array.isArray(studentsData.value)) {
      ALL_STUDENTS = studentsData.value.map(s => ({
        name: s.name,
        roll: s.roll_number,
        dept: s.department,
        sem: s.semester,
        attendance: 80, // placeholder
        cgpa: 8.0,      // placeholder
        status: 'active'
      }));
    }

    if (attData.status === 'fulfilled' && Array.isArray(attData.value)) {
      ATTENDANCE_DATA = attData.value.map(a => ({
        dept: a.department,
        total: parseInt(a.total_students) || 0,
        present: parseInt(a.present_students) || 0,
        percent: Math.round(((parseInt(a.present_students) || 0) / (parseInt(a.total_students) || 1)) * 100)
      }));
    }

    if (noticesData.status === 'fulfilled' && Array.isArray(noticesData.value)) {
      NOTICES_DATA = noticesData.value.map(n => ({
        id: 'N' + String(n.id).padStart(3, '0'),
        title: n.title,
        date: new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        dept: 'All Departments',
        tag: n.tag || 'General',
        author: ADMIN.name
      }));
    }

  } catch (err) {
    console.error('Failed to load admin data:', err);
  }
}

// ── Render ────────────────────────────────────

export function renderAdminDashboard() {
  if (!isLoggedIn()) {
    window.location.href = '/src/pages/login.html';
    return document.createElement('div');
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'sd-wrapper';

  const pendingCount = PENDING_LEAVES.length + PENDING_HOSTEL.length;

  wrapper.innerHTML = `

    <aside class="sd-sidebar">
      <div class="sd-sidebar-top">
        <div class="sd-logo">
          <div class="sd-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0
              12.5L3 10.26V15c0 3.31 4.03 6 9 6s9-2.69
              9-6v-4.74L12 15.5z"/>
            </svg>
          </div>
          <div class="sd-logo-text">
            ${INSTITUTION.shortName}<span>Portal</span>
          </div>
        </div>

        <nav class="sd-nav">
          <div class="sd-nav-label">Main</div>
          ${navItem('overview',  'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',                                             'Overview')}
          ${navItem('leaves',    'M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.93.5 13.5.5c-1.32 0-2.46.56-3.31 1.44L9 3.17l-1.19-1.23C6.96 1.06 5.82.5 4.5.5 2.07.5 0 2.54 0 4.66c0 .46.11.9.18 1.34H0v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z', 'Leave Approvals', pendingCount)}
          ${navItem('hostel',    'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',                                                                        'Hostel Approvals', PENDING_HOSTEL.length)}
          ${navItem('students',  'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', 'Students')}

          <div class="sd-nav-label" style="margin-top:8px">Academics</div>
          ${navItem('attendance','M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z','Attendance')}
          ${navItem('marks',     'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',            'Marks')}
          ${navItem('notices',   'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',                      'Notices')}
          ${navItem('settings',  'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z', 'Settings')}
        </nav>
      </div>

      <div class="sd-sidebar-bottom">
        <div class="sd-user-card">
          <div class="sd-user-avatar">${ADMIN.initials}</div>
          <div class="sd-user-info">
            <div class="sd-user-name">${ADMIN.name}</div>
            <div class="sd-user-roll">${ADMIN.role}</div>
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

    <main class="sd-main">
      <header class="sd-topbar">
        <div class="sd-topbar-left">
          <div class="sd-page-title" id="pageTitle">Overview</div>
          <div class="sd-breadcrumb">
            ${INSTITUTION.name} &nbsp;/&nbsp;
            <span id="breadcrumbPage">Admin Panel</span>
          </div>
        </div>
        <div class="sd-topbar-right">
          <div class="admin-pending-pill" id="pendingPill">
            <div class="pending-dot"></div>
            ${pendingCount} pending approvals
          </div>
          <div class="sd-topbar-meta">
            <div class="sd-topbar-sem">Admin Panel</div>
            <div class="sd-topbar-year">${INSTITUTION.academicYear}</div>
          </div>
        </div>
      </header>

      <div class="sd-content" id="sdContent"></div>
    </main>
  `;

  injectAdminStyles();
  requestAnimationFrame(async () => {
    const content = wrapper.querySelector('#sdContent');
    if (content) content.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading dashboard...</div>';
    
    await loadAllData();
    
    // Update pending counts in sidebar
    const pendingCount = PENDING_LEAVES.length + PENDING_HOSTEL.length;
    const leaveNav = wrapper.querySelector('[data-page="leaves"] .nav-badge');
    const hostelNav = wrapper.querySelector('[data-page="hostel"] .nav-badge');
    if (leaveNav) {
      if (pendingCount > 0) { leaveNav.textContent = pendingCount; leaveNav.style.display = 'flex'; }
      else leaveNav.style.display = 'none';
    }
    if (hostelNav) {
      if (PENDING_HOSTEL.length > 0) { hostelNav.textContent = PENDING_HOSTEL.length; hostelNav.style.display = 'flex'; }
      else hostelNav.style.display = 'none';
    }
    
    initAdmin(wrapper);
  });
  return wrapper;
}

// ── Nav item ──────────────────────────────────

function navItem(id, iconPath, label, badge) {
  return `
    <button class="sd-nav-item" data-page="${id}">
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="${iconPath}"/>
      </svg>
      <span>${label}</span>
      ${badge ? `<span class="nav-badge">${badge}</span>` : ''}
    </button>
  `;
}

// ── Init ──────────────────────────────────────

function initAdmin(wrapper) {
  const navItems   = wrapper.querySelectorAll('.sd-nav-item');
  const content    = wrapper.querySelector('#sdContent');
  const pageTitle  = wrapper.querySelector('#pageTitle');
  const breadcrumb = wrapper.querySelector('#breadcrumbPage');

  // Mutable leave arrays so approvals update the UI
  let pendingLeaves  = [...PENDING_LEAVES];
  let pendingHostel  = [...PENDING_HOSTEL];

  const pages = {
    overview:   { title:'Overview',         crumb:'Dashboard',        render: () => renderOverview(pendingLeaves, pendingHostel) },
    leaves:     { title:'Leave Approvals',     crumb:'Leave Approvals',  render: () => renderLeaveApprovals(pendingLeaves, pendingHostel, navigate, updateBadge) },
    hostel:     { title:'Hostel Approvals',    crumb:'Hostel Approvals', render: () => renderHostelApprovals(pendingHostel, navigate, updateBadge) },
    students:   { title:'Students',            crumb:'Students',         render: renderStudents },
    attendance: { title:'Attendance',          crumb:'Attendance',       render: renderAttendance },
    marks:      { title:'Marks',               crumb:'Marks',            render: renderMarks },
    notices:    { title:'Notices',             crumb:'Notices',          render: () => renderNotices(navigate) },
    settings:   { title:'Settings',            crumb:'Settings',         render: renderSettings },
  };

  function updateBadge() {
    const total = pendingLeaves.length + pendingHostel.length;
    const pill  = wrapper.querySelector('#pendingPill');
    const leaveBadge  = wrapper.querySelector('[data-page="leaves"] .nav-badge');
    const hostelBadge = wrapper.querySelector('[data-page="hostel"] .nav-badge');
    if (pill)        pill.innerHTML = `<div class="pending-dot"></div> ${total} pending approvals`;
    if (leaveBadge)  leaveBadge.textContent  = pendingLeaves.length;
    if (hostelBadge) hostelBadge.textContent = pendingHostel.length;
  }

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

// ═══════════════════════════════════════════════
//  PAGE RENDERERS
// ═══════════════════════════════════════════════

// ── OVERVIEW ─────────────────────────────────

function renderOverview(pendingLeaves, pendingHostel) {
  const el = document.createElement('div');
  const criticalStudents = ALL_STUDENTS.filter(s => s.attendance < 75).length;
  const avgAttendance = Math.round(
    ATTENDANCE_DATA.reduce((s, d) => s + d.percent, 0) / ATTENDANCE_DATA.length
  );

  el.innerHTML = `
    <div class="sd-welcome-bar">
      <div>
        <div class="sd-welcome-text">Good morning, ${ADMIN.name.split(' ')[0]} 👋</div>
        <div class="sd-welcome-sub">${ADMIN.role} &nbsp;·&nbsp; ${INSTITUTION.name}</div>
      </div>
      <div class="sd-welcome-date">
        ${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
      </div>
    </div>

    <div class="sd-stat-grid">
      ${adminStat('Total Students',    ALL_STUDENTS.length,                          'navy',
        'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
        'Enrolled this semester')}
      ${adminStat('Pending Approvals', pendingLeaves.length + pendingHostel.length,  'warn',
        'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
        'Needs your attention')}
      ${adminStat('Avg. Attendance',   avgAttendance + '%',                          avgAttendance >= 75 ? 'success' : 'danger',
        'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
        'Across all departments')}
      ${adminStat('Critical Students', criticalStudents,                             'danger',
        'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
        'Below 75% attendance')}
    </div>

    <div class="sd-two-col">

      <div class="sd-card">
        <div class="sd-card-header">
          <div class="sd-card-title">Pending Leave Requests</div>
          <span class="sd-card-tag tag-warn">${pendingLeaves.length} pending</span>
        </div>
        ${pendingLeaves.slice(0,3).map(l => `
          <div class="overview-leave-row">
            <div class="olr-avatar">${l.student.split(' ').map(w=>w[0]).join('')}</div>
            <div class="olr-info">
              <div class="olr-name">${l.student}</div>
              <div class="olr-meta">${l.type} &nbsp;·&nbsp; ${l.days} day${l.days>1?'s':''} &nbsp;·&nbsp; ${l.roll}</div>
            </div>
            <span class="badge badge-pending">Pending</span>
          </div>
        `).join('')}
        ${pendingLeaves.length === 0
          ? `<div class="empty-state">✓ All leave requests reviewed</div>`
          : `<div class="view-all-link" data-nav="leaves">View all ${pendingLeaves.length} requests →</div>`
        }
      </div>

      <div>
        <div class="sd-card" style="margin-bottom:16px">
          <div class="sd-card-header">
            <div class="sd-card-title">Department Attendance</div>
            <span class="sd-card-tag">Today</span>
          </div>
          ${ATTENDANCE_DATA.map(d => `
            <div class="dept-att-row">
              <div class="dept-att-name">${d.dept.split(' ')[0]}</div>
              <div class="att-bar-wrap" style="flex:1;margin:0 12px">
                <div class="att-bar-fill" style="width:${d.percent}%;background:${d.percent>=75?'var(--success)':d.percent>=60?'var(--warn)':'var(--danger)'}"></div>
              </div>
              <div class="dept-att-pct" style="color:${d.percent>=75?'var(--success)':d.percent>=60?'var(--warn)':'var(--danger)'}">${d.percent}%</div>
            </div>
          `).join('')}
        </div>

        <div class="sd-card">
          <div class="sd-card-header">
            <div class="sd-card-title">Pending Hostel Leaves</div>
            <span class="sd-card-tag tag-warn">${pendingHostel.length} pending</span>
          </div>
          ${pendingHostel.map(h => `
            <div class="overview-leave-row">
              <div class="olr-avatar">${h.student.split(' ').map(w=>w[0]).join('')}</div>
              <div class="olr-info">
                <div class="olr-name">${h.student}</div>
                <div class="olr-meta">${h.reason} &nbsp;·&nbsp; ${h.from} ${h.fromTime} → ${h.toTime}</div>
              </div>
              <span class="badge badge-pending">Pending</span>
            </div>
          `).join('')}
          ${pendingHostel.length === 0
            ? `<div class="empty-state">✓ All hostel leaves reviewed</div>`
            : ''
          }
        </div>
      </div>

    </div>
  `;

  // wire view-all links
  el.querySelectorAll('.view-all-link').forEach(link => {
    link.style.cursor = 'pointer';
    link.addEventListener('click', () => {
      document.querySelector(`[data-page="${link.dataset.nav}"]`)?.click();
    });
  });

  return el;
}


// ── LEAVE APPROVALS PAGE ──────────────────────

function renderLeaveApprovals(pendingLeaves, pendingHostel, navigate, updateBadge) {
  const el = document.createElement('div');

  function rebuild() {
    el.innerHTML = '';

    // Stats
    const statsDiv = document.createElement('div');
    statsDiv.className = 'sd-stat-grid';
    statsDiv.style = 'grid-template-columns:repeat(3,1fr);margin-bottom:20px';
    statsDiv.innerHTML = `
      ${adminStat('Pending',         pendingLeaves.length,                           'warn',    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z', 'Awaiting review')}
      ${adminStat('Reviewed',        PENDING_LEAVES.length - pendingLeaves.length,   'success', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',                                         'This session')}
      ${adminStat('With Documents',  pendingLeaves.filter(l=>l.doc).length,          'navy',    'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z', 'Docs attached')}
    `;
    el.appendChild(statsDiv);

    if (pendingLeaves.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sd-card';
      empty.innerHTML = `<div class="empty-state-big">
        <div style="font-size:40px;margin-bottom:12px">✓</div>
        <div style="font-size:18px;font-weight:600;color:var(--text-dark);margin-bottom:6px">All caught up!</div>
        <div style="font-size:14px;color:var(--text-muted)">No pending leave requests.</div>
      </div>`;
      el.appendChild(empty);
    } else {
      pendingLeaves.forEach(l => {
        el.appendChild(buildLeaveCard(l, pendingLeaves, rebuild, updateBadge));
      });
    }
  }

  rebuild();
  return el;
}

function buildLeaveCard(l, pendingLeaves, rebuild, updateBadge) {
  const div = document.createElement('div');
  div.className = 'approval-card';
  div.id = `card-${l.id}`;
  div.innerHTML = `
    <div class="approval-card-top">
      <div class="approval-student">
        <div class="approval-avatar">${l.student.split(' ').map(w=>w[0]).join('')}</div>
        <div>
          <div class="approval-name">${l.student}</div>
          <div class="approval-meta">
            ${l.roll} &nbsp;·&nbsp; ${l.dept} &nbsp;·&nbsp;
            Attendance: <strong style="color:${l.attendance>=75?'var(--success)':'var(--danger)'}">
              ${l.attendance}%
            </strong>
          </div>
        </div>
      </div>
      <div class="approval-right">
        <span class="badge badge-info">${l.type}</span>
        ${l.doc ? `
          <span class="doc-chip">
            <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2
              2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            Doc attached
          </span>` : ''}
      </div>
    </div>

    <div class="approval-details">
      <div class="approval-detail-row">
        <div class="adr-item">
          <div class="adr-label">Leave Period</div>
          <div class="adr-val">${l.from} → ${l.to} &nbsp;(${l.days} day${l.days>1?'s':''})</div>
        </div>
        <div class="adr-item">
          <div class="adr-label">Applied On</div>
          <div class="adr-val">${l.appliedOn}</div>
        </div>
        <div class="adr-item">
          <div class="adr-label">Request ID</div>
          <div class="adr-val">${l.id}</div>
        </div>
      </div>
      <div class="approval-reason">"${l.reason}"</div>
    </div>

    <div class="approval-actions" id="actions-${l.id}">
      <input
        type="text"
        class="form-input approval-comment"
        placeholder="Add a comment (optional)..."
        id="comment-${l.id}"
      />
      <button class="btn-approve" id="approve-${l.id}">
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
        Approve
      </button>
      <button class="btn-reject" id="reject-${l.id}">
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41
          10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19
          17.59 13.41 12 19 6.41z"/>
        </svg>
        Reject
      </button>
    </div>
  `;

  div.querySelector(`#approve-${l.id}`).addEventListener('click', async () => {
    const comment = div.querySelector(`#comment-${l.id}`).value.trim() || 'Approved.';
    try {
      await leaves.review(l.dbId, { status: 'approved', adminComment: comment });
      resolveLeave(div, l, 'approved', comment, pendingLeaves, updateBadge);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });

  div.querySelector(`#reject-${l.id}`).addEventListener('click', async () => {
    const comment = div.querySelector(`#comment-${l.id}`).value.trim() || 'Rejected.';
    try {
      await leaves.review(l.dbId, { status: 'rejected', adminComment: comment });
      resolveLeave(div, l, 'rejected', comment, pendingLeaves, updateBadge);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });

  return div;
}

function resolveLeave(card, l, status, comment, pendingLeaves, updateBadge) {
  const actions = card.querySelector(`#actions-${l.id}`);
  actions.innerHTML = `
    <div class="resolved-bar ${status === 'approved' ? 'resolved-approved' : 'resolved-rejected'}">
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        ${status === 'approved'
          ? '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>'
          : '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>'}
      </svg>
      ${status === 'approved' ? 'Approved' : 'Rejected'} — "${comment}"
    </div>
  `;
  card.style.opacity = '0.6';
  card.style.pointerEvents = 'none';

  // Remove from pending array
  const idx = pendingLeaves.findIndex(x => x.id === l.id);
  if (idx > -1) pendingLeaves.splice(idx, 1);
  updateBadge();
}

// ── HOSTEL APPROVALS ──────────────────────────

function renderHostelApprovals(pendingHostel, navigate, updateBadge) {
  const el = document.createElement('div');

  function rebuild() {
    el.innerHTML = '';

    const statsDiv = document.createElement('div');
    statsDiv.className = 'sd-stat-grid';
    statsDiv.style = 'grid-template-columns:repeat(3,1fr);margin-bottom:20px';
    statsDiv.innerHTML = `
      ${adminStat('Pending',   pendingHostel.length,                             'warn',    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z', 'Awaiting warden')}
      ${adminStat('Reviewed',  PENDING_HOSTEL.length - pendingHostel.length,     'success', 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',                                         'This session')}
      ${adminStat('Same Day',  pendingHostel.filter(h=>h.from===h.to).length,  'navy',    'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L11 13V7h1.5v5.25l4.5 2.67-.77 1.08z', 'Single day')}
    `;
    el.appendChild(statsDiv);

    if (pendingHostel.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'sd-card';
      empty.innerHTML = `<div class="empty-state-big">
        <div style="font-size:40px;margin-bottom:12px">✓</div>
        <div style="font-size:18px;font-weight:600;color:var(--text-dark);margin-bottom:6px">All caught up!</div>
        <div style="font-size:14px;color:var(--text-muted)">No pending hostel leave requests.</div>
      </div>`;
      el.appendChild(empty);
    } else {
      pendingHostel.forEach(h => {
        el.appendChild(buildHostelCard(h, pendingHostel, rebuild, updateBadge));
      });
    }
  }

  rebuild();
  return el;
}

function buildHostelCard(h, pendingHostel, rebuild, updateBadge) {
  const div = document.createElement('div');
  div.className = 'approval-card';
  div.innerHTML = `
    <div class="approval-card-top">
      <div class="approval-student">
        <div class="approval-avatar">${h.student.split(' ').map(w=>w[0]).join('')}</div>
        <div>
          <div class="approval-name">${h.student}</div>
          <div class="approval-meta">${h.roll} &nbsp;·&nbsp; ${h.dept}</div>
        </div>
      </div>
      <div class="approval-right">
        <span class="badge badge-info">${h.reason}</span>
        <span class="doc-chip" style="background:#EFF6FF;color:#1E40AF;border-color:#BFDBFE">No doc required</span>
      </div>
    </div>

    <div class="approval-details">
      <div class="approval-detail-row">
        <div class="adr-item">
          <div class="adr-label">Departure</div>
          <div class="adr-val">${h.from} &nbsp;<strong>${h.fromTime}</strong></div>
        </div>
        <div class="adr-item">
          <div class="adr-label">Return</div>
          <div class="adr-val">${h.to} &nbsp;<strong>${h.toTime}</strong></div>
        </div>
        <div class="adr-item">
          <div class="adr-label">Request ID</div>
          <div class="adr-val">${h.id}</div>
        </div>
      </div>
      <div class="approval-detail-row" style="margin-top:10px">
        <div class="adr-item">
          <div class="adr-label">Destination</div>
          <div class="adr-val">${h.destination}</div>
        </div>
        <div class="adr-item">
          <div class="adr-label">Parent Contact</div>
          <div class="adr-val">${h.parentPhone}</div>
        </div>
        <div class="adr-item">
          <div class="adr-label">Applied On</div>
          <div class="adr-val">${h.appliedOn}</div>
        </div>
      </div>
    </div>

    <div class="approval-actions" id="hactions-${h.id}">
      <input
        type="text"
        class="form-input approval-comment"
        placeholder="Add a comment for student (optional)..."
        id="hcomment-${h.id}"
      />
      <button class="btn-approve" id="happrove-${h.id}">
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
        Approve
      </button>
      <button class="btn-reject" id="hreject-${h.id}">
        <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41
          10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19
          17.59 13.41 12 19 6.41z"/>
        </svg>
        Reject
      </button>
    </div>
  `;

  div.querySelector(`#happrove-${h.id}`).addEventListener('click', async () => {
    const comment = div.querySelector(`#hcomment-${h.id}`).value.trim() || 'Approved.';
    try {
      await hostelLeaves.review(h.dbId, { status: 'approved', wardenComment: comment });
      resolveLeave(div, { id: h.id }, 'approved', comment, pendingHostel, updateBadge);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });

  div.querySelector(`#hreject-${h.id}`).addEventListener('click', async () => {
    const comment = div.querySelector(`#hcomment-${h.id}`).value.trim() || 'Rejected.';
    try {
      await hostelLeaves.review(h.dbId, { status: 'rejected', wardenComment: comment });
      resolveLeave(div, { id: h.id }, 'rejected', comment, pendingHostel, updateBadge);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });

  return div;
}

// ── STUDENTS ──────────────────────────────────

function renderStudents() {
  const el = document.createElement('div');
  let filtered = [...ALL_STUDENTS];
  let searchVal = '';
  let deptFilter = 'all';

  function rebuild() {
    const list = filtered.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchVal) ||
                          s.roll.toLowerCase().includes(searchVal);
      const matchDept   = deptFilter === 'all' || s.dept === deptFilter;
      return matchSearch && matchDept;
    });

    const tbody = el.querySelector('#studentsTbody');
    if (!tbody) return;
    tbody.innerHTML = list.map(s => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="approval-avatar" style="width:30px;height:30px;font-size:11px">
              ${s.name.split(' ').map(w=>w[0]).join('')}
            </div>
            <div>
              <div style="font-size:13px;font-weight:500">${s.name}</div>
              <div style="font-size:11px;color:var(--text-muted)">${s.email||s.roll+'@greenfield.edu.in'}</div>
            </div>
          </div>
        </td>
        <td class="td-muted">${s.roll}</td>
        <td>${s.dept}</td>
        <td>Sem ${s.sem}</td>
        <td>
          <div class="td-bar-wrap">
            <div class="td-bar-fill" style="width:${s.attendance}%;background:${s.attendance>=75?'var(--success)':s.attendance>=60?'var(--warn)':'var(--danger)'}"></div>
          </div>
          <span style="font-size:12px;font-weight:600;color:${s.attendance>=75?'var(--success)':s.attendance>=60?'var(--warn)':'var(--danger)'}">${s.attendance}%</span>
        </td>
        <td style="font-weight:600">${s.cgpa}</td>
        <td>
          <span class="badge ${s.status==='active'?'badge-approved':s.status==='warning'?'badge-pending':'badge-rejected'}">
            ${s.status.charAt(0).toUpperCase()+s.status.slice(1)}
          </span>
        </td>
      </tr>
    `).join('');
  }

  el.innerHTML = `
    <div class="sd-card">
      <div class="sd-card-header">
        <div class="sd-card-title">All Students</div>
        <span class="sd-card-tag">${ALL_STUDENTS.length} enrolled</span>
      </div>

      <div class="students-toolbar">
        <div class="input-wrapper" style="flex:1;max-width:320px">
          <svg class="input-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5
            0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49
            19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14
            9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            class="form-input input-with-icon"
            id="studentSearch"
            placeholder="Search by name or roll number..."
          />
        </div>
        <select class="form-input" id="deptFilter" style="max-width:220px">
          <option value="all">All Departments</option>
          ${INSTITUTION.departments.map(d=>`<option value="${d}">${d}</option>`).join('')}
        </select>
      </div>

      <table class="sd-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Roll No.</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Attendance</th>
            <th>CGPA</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="studentsTbody"></tbody>
      </table>
    </div>
  `;

  // Wire search and filter
  el.querySelector('#studentSearch').addEventListener('input', e => {
    searchVal = e.target.value.toLowerCase();
    rebuild();
  });
  el.querySelector('#deptFilter').addEventListener('change', e => {
    deptFilter = e.target.value;
    rebuild();
  });

  rebuild();
  return el;
}

// ── ATTENDANCE ────────────────────────────────

function renderAttendance() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="sd-stat-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      ${adminStat('Avg. Attendance', Math.round(ATTENDANCE_DATA.reduce((s,d)=>s+d.percent,0)/ATTENDANCE_DATA.length)+'%', 'success', 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z', 'All departments')}
      ${adminStat('Total Students',  ALL_STUDENTS.length, 'navy', 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', 'Enrolled')}
      ${adminStat('Critical',        ALL_STUDENTS.filter(s=>s.attendance<75).length, 'danger', 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z', 'Below 75%')}
    </div>

    <div class="sd-card" style="margin-bottom:20px">
      <div class="sd-card-header">
        <div class="sd-card-title">Department-wise Attendance</div>
        <span class="sd-card-tag">${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
      </div>
      <table class="sd-table">
        <thead>
          <tr><th>Department</th><th>Total Students</th><th>Present</th><th>Absent</th><th>Percentage</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${ATTENDANCE_DATA.map(d=>`
            <tr>
              <td><strong>${d.dept}</strong></td>
              <td>${d.total}</td>
              <td style="color:var(--success);font-weight:500">${d.present}</td>
              <td style="color:var(--danger);font-weight:500">${d.total-d.present}</td>
              <td>
                <div class="td-bar-wrap" style="width:80px">
                  <div class="td-bar-fill" style="width:${d.percent}%;background:${d.percent>=75?'var(--success)':d.percent>=60?'var(--warn)':'var(--danger)'}"></div>
                </div>
                <span style="font-weight:600;color:${d.percent>=75?'var(--success)':d.percent>=60?'var(--warn)':'var(--danger)'}">${d.percent}%</span>
              </td>
              <td>
                <span class="badge ${d.percent>=75?'badge-approved':d.percent>=60?'badge-pending':'badge-rejected'}">
                  ${d.percent>=75?'Good':d.percent>=60?'Low':'Critical'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="sd-card">
      <div class="sd-card-header">
        <div class="sd-card-title">Students Below 75% Attendance</div>
        <span class="sd-card-tag tag-danger">${ALL_STUDENTS.filter(s=>s.attendance<75).length} students</span>
      </div>
      <table class="sd-table">
        <thead>
          <tr><th>Student</th><th>Roll No.</th><th>Department</th><th>Attendance</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${ALL_STUDENTS.filter(s=>s.attendance<75).map(s=>`
            <tr>
              <td><strong>${s.name}</strong></td>
              <td class="td-muted">${s.roll}</td>
              <td>${s.dept}</td>
              <td>
                <div class="td-bar-wrap">
                  <div class="td-bar-fill" style="width:${s.attendance}%;background:${s.attendance>=60?'var(--warn)':'var(--danger)'}"></div>
                </div>
                <span style="font-weight:700;color:${s.attendance>=60?'var(--warn)':'var(--danger)'}">${s.attendance}%</span>
              </td>
              <td>
                <span class="badge ${s.status==='warning'?'badge-pending':'badge-rejected'}">
                  ${s.status==='warning'?'Warning':'Critical'}
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

// ── MARKS ─────────────────────────────────────

function renderMarks() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="sd-card">
      <div class="sd-card-header">
        <div class="sd-card-title">Subject-wise Performance Overview</div>
        <span class="sd-card-tag">Semester 5</span>
      </div>
      <table class="sd-table">
        <thead>
          <tr><th>Subject</th><th>Code</th><th>Department</th><th>Appeared</th><th>Avg. Score</th><th>Highest</th><th>Lowest</th><th>Performance</th></tr>
        </thead>
        <tbody>
          ${MARKS_DATA.map(m=>`
            <tr>
              <td><strong>${m.subject}</strong></td>
              <td class="td-muted">${m.code}</td>
              <td>${m.dept.split(' ')[0]}</td>
              <td>${m.appeared}</td>
              <td>
                <strong>${m.avgScore}</strong>
                <span style="color:var(--text-muted);font-size:11px"> / 100</span>
              </td>
              <td style="color:var(--success);font-weight:600">${m.highest}</td>
              <td style="color:var(--danger);font-weight:600">${m.lowest}</td>
              <td>
                <div class="td-bar-wrap" style="width:80px">
                  <div class="td-bar-fill" style="width:${m.avgScore}%;background:${m.avgScore>=75?'var(--success)':m.avgScore>=60?'var(--gold)':'var(--warn)'}"></div>
                </div>
                <span style="font-size:11px;color:var(--text-muted)">${m.avgScore}%</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  return el;
}

// ── NOTICES ───────────────────────────────────

function renderNotices(navigate) {
  const el = document.createElement('div');
  const notices = [...NOTICES];
  const tagColors = {
    Exam:    ['#DBEAFE','#1E40AF'],
    Holiday: ['#D1FAE5','#065F46'],
    Marks:   ['#FEF3C7','#92400E'],
    General: ['#F3F4F6','#374151'],
  };

  function rebuild() {
    el.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'sd-card';
    card.innerHTML = `
      <div class="sd-card-header">
        <div class="sd-card-title">College Notices</div>
        <button class="btn btn-primary" id="addNoticeBtn" style="font-size:13px;padding:8px 18px">
          + Post Notice
        </button>
      </div>

      <div class="notice-form" id="noticeForm" style="display:none">
        <div class="form-group">
          <label class="form-label">Notice Title</label>
          <input type="text" class="form-input" id="noticeTitle" placeholder="e.g. Exam schedule update..." />
          <div class="field-error" id="noticeTitleErr"></div>
        </div>
        <div style="display:flex;gap:16px">
          <div class="form-group" style="flex:1">
            <label class="form-label">Tag</label>
            <select class="form-input" id="noticeTag">
              <option>Exam</option><option>Holiday</option>
              <option>Marks</option><option>General</option>
            </select>
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Department</label>
            <select class="form-input" id="noticeDept">
              <option>All Departments</option>
              ${INSTITUTION.departments.map(d=>`<option>${d}</option>`).join('')}
            </select>
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:4px">
          <button class="btn btn-primary" id="submitNotice" style="font-size:13px;padding:9px 20px">Post</button>
          <button class="btn btn-outline" id="cancelNotice" style="font-size:13px;padding:9px 20px">Cancel</button>
        </div>
        <hr class="divider" />
      </div>

      <div class="notice-full-list" id="noticeList">
        ${notices.map(n => {
          const [bg, color] = tagColors[n.tag] || ['#F3F4F6','#374151'];
          return `
            <div class="notice-full-row">
              <div class="notice-full-left">
                <span class="notice-full-tag" style="background:${bg};color:${color}">${n.tag}</span>
                <div class="notice-full-title">${n.title}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
                  ${n.dept} &nbsp;·&nbsp; By ${n.author} &nbsp;·&nbsp; ${n.id}
                </div>
              </div>
              <div class="notice-full-date">${n.date}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    el.appendChild(card);

    // Toggle form
    card.querySelector('#addNoticeBtn').addEventListener('click', () => {
      const form = card.querySelector('#noticeForm');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    card.querySelector('#cancelNotice').addEventListener('click', () => {
      card.querySelector('#noticeForm').style.display = 'none';
    });

    // Submit notice
    card.querySelector('#submitNotice').addEventListener('click', () => {
      const title = card.querySelector('#noticeTitle').value.trim();
      const err   = card.querySelector('#noticeTitleErr');
      if (!title) {
        err.textContent   = 'Please enter a notice title';
        err.style.display = 'block';
        return;
      }
      err.style.display = 'none';

      const tag    = card.querySelector('#noticeTag').value;
      const dept   = card.querySelector('#noticeDept').value;
      const today  = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
      const id     = 'N00' + (notices.length + 1);

      notices.unshift({ id, title, date: today, dept, tag, author: ADMIN.name });
      card.querySelector('#noticeForm').style.display = 'none';
      card.querySelector('#noticeTitle').value = '';

      // Refresh list
      const [bg, color] = tagColors[tag] || ['#F3F4F6','#374151'];
      const list = card.querySelector('#noticeList');
      const row  = document.createElement('div');
      row.className = 'notice-full-row';
      row.innerHTML = `
        <div class="notice-full-left">
          <span class="notice-full-tag" style="background:${bg};color:${color}">${tag}</span>
          <div class="notice-full-title">${title}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
            ${dept} &nbsp;·&nbsp; By ${ADMIN.name} &nbsp;·&nbsp; ${id}
          </div>
        </div>
        <div class="notice-full-date">${today}</div>
      `;
      list.insertBefore(row, list.firstChild);
    });
  }

  rebuild();
  return el;
}

// ── SETTINGS ──────────────────────────────────

function renderSettings() {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="sd-two-col" style="align-items:flex-start">
      <div>
        <div class="sd-card" style="margin-bottom:16px">
          <div class="sd-card-title" style="margin-bottom:20px">Institution Details</div>
          <div class="form-group">
            <label class="form-label">Institution Name</label>
            <input type="text" class="form-input" value="${INSTITUTION.name}" />
          </div>
          <div class="form-group">
            <label class="form-label">Short Name</label>
            <input type="text" class="form-input" value="${INSTITUTION.shortName}" />
          </div>
          <div class="form-group">
            <label class="form-label">Academic Year</label>
            <input type="text" class="form-input" value="${INSTITUTION.academicYear}" />
          </div>
          <div class="form-group">
            <label class="form-label">Admin Email</label>
            <input type="email" class="form-input" value="${INSTITUTION.email}" />
          </div>
          <button class="btn btn-primary" onclick="alert('In a real build, this saves to your database.')">
            Save Changes
          </button>
        </div>

        <div class="sd-card">
          <div class="sd-card-title" style="margin-bottom:20px">Leave Policy</div>
          <div class="form-group">
            <label class="form-label">Max Leaves Per Semester</label>
            <input type="number" class="form-input" value="${INSTITUTION.leavePolicy.maxLeavesPerSemester}" />
          </div>
          <div class="form-group">
            <label class="form-label">Minimum Attendance Required (%)</label>
            <input type="number" class="form-input" value="${INSTITUTION.leavePolicy.minAttendancePercent}" />
          </div>
          <div class="form-group">
            <label class="form-label">Auto-reject After (days)</label>
            <input type="number" class="form-input" value="${INSTITUTION.leavePolicy.autoRejectAfterDays}" />
          </div>
          <button class="btn btn-primary" onclick="alert('In a real build, this updates institution.js via API.')">
            Update Policy
          </button>
        </div>
      </div>

      <div>
        <div class="sd-card" style="margin-bottom:16px">
          <div class="sd-card-title" style="margin-bottom:20px">Feature Toggles</div>
          ${Object.entries(INSTITUTION.features).map(([key, val]) => `
            <div class="toggle-row">
              <div>
                <div class="toggle-label">${key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</div>
                <div class="toggle-sub">${val ? 'Enabled' : 'Disabled'}</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" ${val ? 'checked' : ''} />
                <span class="toggle-knob"></span>
              </label>
            </div>
          `).join('')}
        </div>

        <div class="sd-card">
          <div class="sd-card-title" style="margin-bottom:16px">Quick Info</div>
          <div class="profile-row">
            <div class="profile-row-label">Config file</div>
            <div class="profile-row-value" style="font-size:12px;font-family:monospace">config/institution.js</div>
          </div>
          <div class="profile-row">
            <div class="profile-row-label">Address</div>
            <div class="profile-row-value">${INSTITUTION.address}</div>
          </div>
          <div class="profile-row" style="border:none">
            <div class="profile-row-label">Support</div>
            <div class="profile-row-value">${INSTITUTION.email}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  return el;
}

// ── Stat card helper ──────────────────────────

function adminStat(label, value, color, iconPath, sub) {
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

// ── Admin-specific styles ─────────────────────

function injectAdminStyles() {
  if (document.getElementById('admin-styles')) return;
  const style = document.createElement('style');
  style.id = 'admin-styles';
  style.textContent = `
    /* reuse student dashboard layout */
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
    .nav-badge{margin-left:auto;background:var(--danger);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;min-width:20px;text-align:center}
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
    .sd-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:0}
    .sd-card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
    .sd-card-title{font-size:15px;font-weight:600;color:var(--text-dark)}
    .sd-card-tag{font-size:11px;font-weight:500;color:var(--text-muted);background:var(--cream);border:1px solid var(--border);padding:3px 10px;border-radius:4px}
    .tag-warn{color:var(--warn)!important;background:#FFFBEB!important;border-color:#FDE68A!important}
    .tag-danger{color:var(--danger)!important;background:#FEF2F2!important;border-color:#FECACA!important}

    /* TOPBAR PENDING PILL */
    .admin-pending-pill{display:flex;align-items:center;gap:7px;background:#FEF3C7;border:1px solid #FDE68A;color:#92400E;font-size:12px;font-weight:600;padding:6px 14px;border-radius:99px}
    .pending-dot{width:7px;height:7px;background:var(--warn);border-radius:50%;animation:pulse 1.5s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}

    /* OVERVIEW ROWS */
    .overview-leave-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #F1F5F9}
    .overview-leave-row:last-of-type{border-bottom:none}
    .olr-avatar{width:34px;height:34px;border-radius:50%;background:rgba(11,29,58,0.08);color:var(--navy);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .olr-info{flex:1}
    .olr-name{font-size:13px;font-weight:500;color:var(--text-dark)}
    .olr-meta{font-size:11px;color:var(--text-muted);margin-top:2px}
    .dept-att-row{display:flex;align-items:center;gap:0;padding:8px 0;border-bottom:1px solid #F8FAFC}
    .dept-att-row:last-child{border-bottom:none}
    .dept-att-name{font-size:12px;color:var(--text-muted);width:80px;flex-shrink:0}
    .dept-att-pct{font-size:12px;font-weight:600;min-width:36px;text-align:right}
    .att-bar-wrap{height:6px;background:var(--border);border-radius:99px;overflow:hidden}
    .att-bar-fill{height:100%;border-radius:99px}
    .view-all-link{font-size:13px;color:var(--gold);font-weight:500;margin-top:12px;display:block}
    .view-all-link:hover{color:var(--navy)}
    .empty-state{font-size:13px;color:var(--success);text-align:center;padding:16px 0}
    .empty-state-big{text-align:center;padding:48px 0}

    /* APPROVAL CARDS */
    .approval-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px;margin-bottom:16px;transition:box-shadow .2s}
    .approval-card:hover{box-shadow:var(--shadow-sm)}
    .approval-card-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px}
    .approval-student{display:flex;align-items:center;gap:12px}
    .approval-avatar{width:40px;height:40px;border-radius:50%;background:rgba(11,29,58,0.08);color:var(--navy);font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .approval-name{font-size:15px;font-weight:600;color:var(--text-dark)}
    .approval-meta{font-size:12px;color:var(--text-muted);margin-top:3px}
    .approval-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
    .doc-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;background:#F0FDF4;color:var(--success);border:1px solid #BBF7D0;padding:3px 10px;border-radius:4px}
    .approval-details{background:var(--cream);border-radius:var(--radius-md);padding:14px 16px;margin-bottom:16px}
    .approval-detail-row{display:flex;gap:24px;flex-wrap:wrap}
    .adr-item{flex:1;min-width:140px}
    .adr-label{font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
    .adr-val{font-size:13px;font-weight:500;color:var(--text-dark)}
    .approval-reason{font-size:13px;color:var(--text-mid);font-style:italic;margin-top:12px}
    .approval-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .approval-comment{flex:1;min-width:200px}
    .btn-approve{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;background:#F0FDF4;color:var(--success);border:1.5px solid #BBF7D0;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
    .btn-approve:hover{background:var(--success);color:#fff;border-color:var(--success)}
    .btn-reject{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;background:#FEF2F2;color:var(--danger);border:1.5px solid #FECACA;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
    .btn-reject:hover{background:var(--danger);color:#fff;border-color:var(--danger)}
    .resolved-bar{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:var(--radius-md);font-size:13px;font-weight:500}
    .resolved-approved{background:#F0FDF4;color:var(--success);border:1px solid #BBF7D0}
    .resolved-rejected{background:#FEF2F2;color:var(--danger);border:1px solid #FECACA}

    /* STUDENTS TABLE */
    .students-toolbar{display:flex;gap:12px;margin-bottom:20px}
    .sd-table{width:100%;border-collapse:collapse}
    .sd-table th{font-size:11px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;padding:10px 12px;text-align:left;border-bottom:1px solid var(--border)}
    .sd-table td{font-size:13px;color:var(--text-dark);padding:12px 12px;border-bottom:1px solid #F8FAFC;vertical-align:middle}
    .sd-table tr:last-child td{border-bottom:none}
    .sd-table tr:hover td{background:#FAFAFA}
    .td-muted{color:var(--text-muted)!important}
    .td-bar-wrap{display:inline-block;width:60px;height:5px;background:var(--border);border-radius:99px;overflow:hidden;margin-right:6px;vertical-align:middle}
    .td-bar-fill{height:100%;border-radius:99px}

    /* NOTICES */
    .notice-full-list{display:flex;flex-direction:column}
    .notice-full-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid #F1F5F9}
    .notice-full-row:last-child{border-bottom:none}
    .notice-full-tag{font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px;margin-bottom:5px;display:inline-block}
    .notice-full-title{font-size:14px;font-weight:500;color:var(--text-dark)}
    .notice-full-date{font-size:12px;color:var(--text-muted);white-space:nowrap;margin-left:24px}
    .notice-form{background:var(--cream);border:1px solid var(--border);border-radius:var(--radius-md);padding:20px;margin-bottom:20px}

    /* SETTINGS */
    .toggle-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)}
    .toggle-row:last-child{border-bottom:none}
    .toggle-label{font-size:13px;font-weight:500;color:var(--text-dark)}
    .toggle-sub{font-size:11px;color:var(--text-muted);margin-top:2px}
    .toggle-switch{position:relative;display:inline-block;width:40px;height:22px;cursor:pointer}
    .toggle-switch input{opacity:0;width:0;height:0}
    .toggle-knob{position:absolute;inset:0;background:var(--border);border-radius:99px;transition:.2s}
    .toggle-knob::before{content:'';position:absolute;width:16px;height:16px;background:#fff;border-radius:50%;top:3px;left:3px;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2)}
    .toggle-switch input:checked + .toggle-knob{background:var(--success)}
    .toggle-switch input:checked + .toggle-knob::before{transform:translateX(18px)}
    .profile-row{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--border);font-size:13px}
    .profile-row:last-child{border-bottom:none}
    .profile-row-label{color:var(--text-muted)}
    .profile-row-value{font-weight:500;color:var(--text-dark)}

    /* SHARED FORM ELEMENTS */
    .form-group{margin-bottom:18px}
    .form-label{display:block;font-size:13px;font-weight:500;color:var(--text-mid);margin-bottom:6px}
    .form-input{width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:var(--radius-md);font-size:14px;color:var(--text-dark);background:var(--white);transition:border-color .2s,box-shadow .2s;outline:none;font-family:'DM Sans',sans-serif}
    .form-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,153,42,0.1)}
    .input-wrapper{position:relative}
    .input-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:16px;height:16px;fill:var(--text-muted);pointer-events:none}
    .input-with-icon{padding-left:40px}
    .field-error{font-size:12px;color:var(--danger);margin-top:5px;display:none}
    .divider{border:none;border-top:1px solid var(--border);margin:20px 0}
    .btn{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:500;padding:11px 24px;border-radius:var(--radius-md);border:none;transition:all .2s;cursor:pointer;font-family:'DM Sans',sans-serif}
    .btn-primary{background:var(--gold);color:var(--navy);font-weight:600}
    .btn-primary:hover{background:var(--gold-light)}
    .btn-outline{background:transparent;color:var(--navy);border:1.5px solid var(--border)}
    .btn-outline:hover{border-color:var(--gold);color:var(--gold)}
  `;
  document.head.appendChild(style);
}