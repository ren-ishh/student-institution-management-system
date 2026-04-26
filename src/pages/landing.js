// ============================================
//  LANDING PAGE
// ============================================

import INSTITUTION from '../../config/institution.js';

export function renderLanding() {
  const page = document.createElement('div');
  page.innerHTML = `

    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg-grid"></div>
      <div class="hero-glow"></div>
      <div class="container hero-inner">
        <div class="hero-left">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            Academic Year ${INSTITUTION.academicYear}
          </div>
          <h1>Manage Your<br><span>${INSTITUTION.name}</span><br>Intelligently</h1>
          <p class="hero-sub">
            A unified platform for students, faculty, and administrators —
            built for institutions that value precision, transparency, and growth.
          </p>
          <div class="hero-actions">
            <a href="/src/pages/login.html" class="btn btn-primary btn-lg">Get Started</a>
            <a href="#features" class="btn btn-lg" style="color:rgba(255,255,255,0.7);border:1.5px solid rgba(255,255,255,0.2);">
              See Features
            </a>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-num">10k+</div>
              <div class="hero-stat-label">Students Managed</div>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <div class="hero-stat-num">98%</div>
              <div class="hero-stat-label">Approval Accuracy</div>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <div class="hero-stat-num">3 min</div>
              <div class="hero-stat-label">Avg. Leave Response</div>
            </div>
          </div>
        </div>
        <div class="hero-right">
          <div class="dashboard-preview">
            <div class="preview-topbar">
              <div class="preview-dots">
                <span style="background:#FF5F57"></span>
                <span style="background:#FFBD2E"></span>
                <span style="background:#28CA41"></span>
              </div>
              <div class="preview-title">Student Dashboard — ${INSTITUTION.shortName}Portal</div>
            </div>
            <div class="preview-body">
              <div class="preview-greeting">Good morning, <strong>Arjun Singh</strong> &nbsp;·&nbsp; B.Tech CSE · Sem 5</div>
              <div class="preview-stats-grid">
                <div class="preview-stat">
                  <div class="ps-label">Attendance</div>
                  <div class="ps-val" style="color:var(--success)">84.2%</div>
                </div>
                <div class="preview-stat">
                  <div class="ps-label">CGPA</div>
                  <div class="ps-val" style="color:var(--gold)">8.6</div>
                </div>
                <div class="preview-stat">
                  <div class="ps-label">Leaves Used</div>
                  <div class="ps-val">7 / ${INSTITUTION.leavePolicy.maxLeavesPerSemester}</div>
                </div>
                <div class="preview-stat">
                  <div class="ps-label">Pending</div>
                  <div class="ps-val" style="color:var(--warn)">2</div>
                </div>
              </div>
              <div class="preview-leave-card">
                <div class="preview-leave-title">Recent Leave Requests</div>
                <div class="preview-leave-row">
                  <div>
                    <div class="plr-name">Medical Leave</div>
                    <div class="plr-date">Dec 12–14, 2025</div>
                  </div>
                  <span class="badge badge-approved">Approved</span>
                </div>
                <div class="preview-leave-row">
                  <div>
                    <div class="plr-name">Family Function</div>
                    <div class="plr-date">Jan 3–4, 2026</div>
                  </div>
                  <span class="badge badge-pending">Pending</span>
                </div>
                <div class="preview-leave-row" style="border:none">
                  <div>
                    <div class="plr-name">Personal</div>
                    <div class="plr-date">Nov 28, 2025</div>
                  </div>
                  <span class="badge badge-rejected">Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="section" id="features" style="background:var(--white)">
      <div class="container">
        <div class="features-header">
          <div>
            <div class="section-tag">Core Modules</div>
            <div class="section-title">Everything Your Institution Needs</div>
          </div>
          <p class="section-sub" style="max-width:320px">
            Six modules that handle every aspect of academic administration — built to work together seamlessly.
          </p>
        </div>
        <div class="features-grid">
          ${features(INSTITUTION)}
        </div>
      </div>
    </section>

    <!-- ROLES -->
    <section class="section roles-section" id="roles">
      <div class="roles-bg"></div>
      <div class="container" style="position:relative">
        <div class="section-tag" style="color:var(--gold-light)">Built For Everyone</div>
        <div class="section-title" style="color:var(--white)">Three Roles. One Platform.</div>
        <p class="section-sub" style="color:rgba(255,255,255,0.5)">
          Every role gets a tailored experience — only what they need, nothing they don't.
        </p>
        <div class="roles-grid">
          ${roles()}
        </div>
      </div>
    </section>

    <!-- ROADMAP -->
    <section class="section" id="roadmap" style="background:var(--cream)">
      <div class="container">
        <div class="section-tag">Development Plan</div>
        <div class="section-title">How We Build This</div>
        <p class="section-sub">A phased approach — you see working features early and build confidently.</p>
        <div class="roadmap-grid">
          ${roadmap()}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container" style="text-align:center">
        <div class="section-tag" style="color:var(--gold-light)">Ready to Begin?</div>
        <div class="section-title" style="color:var(--white);max-width:560px;margin:0 auto 14px">
          Build ${INSTITUTION.name}'s Digital Backbone
        </div>
        <p class="section-sub" style="color:rgba(255,255,255,0.5);margin:0 auto 40px">
          Start with Phase 1 today. Every feature built step by step, from scratch.
        </p>
        <div style="display:flex;align-items:center;justify-content:center;gap:16px">
          <a href="/src/pages/login.html" class="btn btn-primary btn-lg">Get Started</a>
          <a href="#features" class="btn btn-lg" style="color:rgba(255,255,255,0.7);border:1.5px solid rgba(255,255,255,0.2)">
            Explore Features
          </a>
        </div>
      </div>
    </section>

  `;

  injectLandingStyles();
  return page;
}

// ── Helpers ──────────────────────────────────

function features(inst) {
  const list = [
    { icon: 'M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', title: 'User & Role Management', desc: 'Secure role-based access for students, faculty, and admins. Each user sees only what they need.' },
    { icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z', title: 'Leave Management', desc: 'Students apply with reason and documents. Admins approve or reject. Real-time status updates.' },
    { icon: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z', title: 'Attendance Tracking', desc: `Faculty marks attendance in seconds. Auto-alert when below ${inst.leavePolicy.minAttendancePercent}%.` },
    { icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z', title: 'Marks & Grades', desc: 'Enter and manage exam scores by subject. Students view results with grade breakdowns instantly.' },
    { icon: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z', title: 'Announcements', desc: 'Post college-wide or department-specific notices. Students get timely notifications.' },
    { icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', title: 'Reports & Analytics', desc: 'Export attendance, marks, and leave logs as PDF or Excel. Visual dashboards for admins.' },
  ];

  return list.map(f => `
    <div class="feature-card">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="${f.icon}"/></svg>
      </div>
      <div class="feature-title">${f.title}</div>
      <div class="feature-desc">${f.desc}</div>
    </div>
  `).join('');
}

function roles() {
  const list = [
    {
      name: 'Student', tag: 'Self-service access',
      icon: 'M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
      items: ['Apply for and track leave requests', 'View subject-wise attendance', 'Check exam marks and CGPA', 'Read college notices and alerts', 'Download personal reports'],
      highlight: false,
    },
    {
      name: 'Administrator', tag: 'Full control',
      icon: 'M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L3 10.26V15c0 3.31 4.03 6 9 6s9-2.69 9-6v-4.74L12 15.5z',
      items: ['Approve or reject leave requests', 'Manage all student records', 'View institution-wide reports', 'Configure departments and courses', 'Add and manage faculty accounts'],
      highlight: true,
    },
    {
      name: 'Faculty', tag: 'Classroom tools',
      icon: 'M20 17.17L18.83 16H4V4h16v13.17zM20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z',
      items: ['Mark daily and subject attendance', 'Enter and update exam scores', 'View class performance reports', 'Recommend leave decisions', 'Post class-level announcements'],
      highlight: false,
    },
  ];

  return list.map(r => `
    <div class="role-card ${r.highlight ? 'role-card--highlight' : ''}">
      <div class="role-header">
        <div class="role-avatar ${r.highlight ? 'role-avatar--gold' : ''}">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="${r.icon}"/></svg>
        </div>
        <div>
          <div class="role-name">${r.name}</div>
          <div class="role-tag">${r.tag}</div>
        </div>
      </div>
      <ul class="role-list">
        ${r.items.map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function roadmap() {
  const phases = [
    { num: '1', weeks: 'Weeks 1–4',   title: 'Foundation',    items: ['Project setup', 'Auth & roles', 'Database schema', 'Basic dashboards'] },
    { num: '2', weeks: 'Weeks 5–12',  title: 'Core Modules',  items: ['Leave management', 'Attendance system', 'Marks & grades', 'Notifications'] },
    { num: '3', weeks: 'Weeks 13–18', title: 'Polish',         items: ['Reports & exports', 'Mobile optimisation', 'File uploads', 'Admin tools'] },
    { num: '4', weeks: 'Ongoing',     title: 'Scale & Grow',  items: ['Multi-institution', 'Analytics', 'API integrations', 'Mobile apps'] },
  ];

  return phases.map(p => `
    <div class="phase-card">
      <div class="phase-circle">${p.num}</div>
      <div class="phase-weeks">${p.weeks}</div>
      <div class="phase-title">${p.title}</div>
      <ul class="phase-list">
        ${p.items.map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function injectLandingStyles() {
  if (document.getElementById('landing-styles')) return;
  const style = document.createElement('style');
  style.id = 'landing-styles';
  style.textContent = `
    /* HERO */
    .hero { background:var(--navy); padding:88px 0 0; position:relative; overflow:hidden; }
    .hero-bg-grid { position:absolute;inset:0;background-image:linear-gradient(rgba(201,153,42,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,153,42,0.06) 1px,transparent 1px);background-size:48px 48px;pointer-events:none; }
    .hero-glow { position:absolute;top:-100px;right:-60px;width:560px;height:560px;background:radial-gradient(circle,rgba(201,153,42,0.13) 0%,transparent 70%);pointer-events:none; }
    .hero-inner { display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:flex-end;position:relative;z-index:1; }
    .hero-badge { display:inline-flex;align-items:center;gap:8px;background:rgba(201,153,42,0.12);border:1px solid rgba(201,153,42,0.3);color:var(--gold-light);font-size:11px;font-weight:600;padding:6px 14px;border-radius:100px;letter-spacing:1px;text-transform:uppercase;margin-bottom:22px; }
    .hero-badge-dot { width:6px;height:6px;background:var(--gold-light);border-radius:50%; }
    .hero-left h1 { font-size:50px;color:var(--white);margin-bottom:18px; }
    .hero-left h1 span { color:var(--gold-light); }
    .hero-sub { font-size:16px;color:rgba(255,255,255,0.55);line-height:1.75;max-width:420px;margin-bottom:36px;font-weight:300; }
    .hero-actions { display:flex;gap:14px;margin-bottom:52px; }
    .hero-stats { display:flex;align-items:center;gap:0;padding:24px 0;border-top:1px solid rgba(255,255,255,0.1); }
    .hero-stat { padding:0 28px; }
    .hero-stat:first-child { padding-left:0; }
    .hero-stat-num { font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--gold-light); }
    .hero-stat-label { font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px;letter-spacing:0.3px; }
    .hero-stat-divider { width:1px;height:36px;background:rgba(255,255,255,0.1); }

    /* DASHBOARD PREVIEW */
    .dashboard-preview { background:var(--white);border-radius:14px 14px 0 0;overflow:hidden;box-shadow:0 -8px 60px rgba(0,0,0,0.35); }
    .preview-topbar { background:#1C2D4A;padding:11px 18px;display:flex;align-items:center;gap:8px; }
    .preview-dots { display:flex;gap:6px; }
    .preview-dots span { width:10px;height:10px;border-radius:50%;display:block; }
    .preview-title { margin-left:8px;font-size:11px;color:rgba(255,255,255,0.4); }
    .preview-body { padding:18px;background:#F8FAFC; }
    .preview-greeting { font-size:12px;color:var(--text-muted);margin-bottom:14px; }
    .preview-greeting strong { color:var(--text-dark); }
    .preview-stats-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px; }
    .preview-stat { background:var(--white);border:1px solid var(--border);border-radius:8px;padding:10px 12px; }
    .ps-label { font-size:9px;color:var(--text-muted);letter-spacing:0.3px;margin-bottom:4px;text-transform:uppercase; }
    .ps-val { font-size:18px;font-weight:600;color:var(--text-dark); }
    .preview-leave-card { background:var(--white);border:1px solid var(--border);border-radius:8px;padding:12px 14px; }
    .preview-leave-title { font-size:9px;font-weight:600;color:var(--text-muted);letter-spacing:0.8px;text-transform:uppercase;margin-bottom:10px; }
    .preview-leave-row { display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid #F1F5F9; }
    .plr-name { font-size:11px;font-weight:500;color:var(--text-dark); }
    .plr-date { font-size:10px;color:var(--text-muted); }

    /* FEATURES */
    .features-header { display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px; }
    .features-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:20px; }
    .feature-card { background:var(--cream);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px;transition:all .25s;position:relative;overflow:hidden; }
    .feature-card::before { content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-light));opacity:0;transition:opacity .25s; }
    .feature-card:hover { transform:translateY(-4px);box-shadow:var(--shadow-md);border-color:rgba(201,153,42,0.3); }
    .feature-card:hover::before { opacity:1; }
    .feature-icon { width:44px;height:44px;background:var(--navy);border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:18px; }
    .feature-icon svg { width:20px;height:20px;fill:var(--gold-light); }
    .feature-title { font-size:15px;font-weight:600;color:var(--text-dark);margin-bottom:8px; }
    .feature-desc { font-size:13px;color:var(--text-muted);line-height:1.65; }

    /* ROLES */
    .roles-section { background:var(--navy);position:relative;overflow:hidden; }
    .roles-bg { position:absolute;inset:0;background-image:linear-gradient(rgba(201,153,42,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,153,42,0.05) 1px,transparent 1px);background-size:40px 40px;pointer-events:none; }
    .roles-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:44px; }
    .role-card { background:rgba(255,255,255,0.04);border:1px solid rgba(201,153,42,0.18);border-radius:var(--radius-lg);padding:28px;transition:all .25s; }
    .role-card--highlight { border-color:rgba(201,153,42,0.5);background:rgba(201,153,42,0.06); }
    .role-card:hover { background:rgba(255,255,255,0.07); }
    .role-header { display:flex;align-items:center;gap:14px;margin-bottom:22px; }
    .role-avatar { width:42px;height:42px;border-radius:10px;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center; }
    .role-avatar--gold { background:rgba(201,153,42,0.18); }
    .role-avatar svg { width:20px;height:20px;fill:rgba(255,255,255,0.6); }
    .role-avatar--gold svg { fill:var(--gold-light); }
    .role-name { font-size:16px;font-weight:600;color:var(--white); }
    .role-tag { font-size:11px;color:rgba(255,255,255,0.38);margin-top:2px; }
    .role-list li { font-size:13px;color:rgba(255,255,255,0.6);padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;gap:8px; }
    .role-list li:last-child { border-bottom:none; }
    .role-list li::before { content:'';display:block;width:4px;height:4px;background:var(--gold);border-radius:50%;flex-shrink:0; }

    /* ROADMAP */
    .roadmap-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:52px;position:relative; }
    .roadmap-grid::before { content:'';position:absolute;top:27px;left:12.5%;right:12.5%;height:1.5px;background:linear-gradient(90deg,var(--gold),var(--gold-light),var(--gold));opacity:0.3; }
    .phase-card { text-align:center;padding:0 12px; }
    .phase-circle { width:54px;height:54px;border-radius:50%;background:var(--navy);border:2.5px solid var(--gold);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--gold-light);position:relative;z-index:1; }
    .phase-weeks { font-size:10px;color:var(--gold);font-weight:600;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:8px; }
    .phase-title { font-size:14px;font-weight:600;color:var(--text-dark);margin-bottom:10px; }
    .phase-list li { font-size:12px;color:var(--text-muted);padding:3px 0; }

    /* CTA */
    .cta-section { background:var(--navy);padding:100px 0; }
  `;
  document.head.appendChild(style);
}