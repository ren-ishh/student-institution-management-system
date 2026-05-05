// ============================================
//  LOGIN PAGE
//  Role-based login — Student / Admin / Faculty
// ============================================

import INSTITUTION from '../../config/institution.js';
import { auth, saveToken, saveUser } from '../api.js';

export function renderLogin() {
  const page = document.createElement('div');
  page.className = 'login-page';

  page.innerHTML = `
    <div class="login-left">
      <div class="login-left-inner">

        <a href="/index.html" class="login-back">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to home
        </a>

        <div class="login-brand">
          <div class="login-brand-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L3 10.26V15
              c0 3.31 4.03 6 9 6s9-2.69 9-6v-4.74L12 15.5z"/>
            </svg>
          </div>
          <div>
            <div class="login-brand-name">
              ${INSTITUTION.shortName}<span>Portal</span>
            </div>
            <div class="login-brand-inst">${INSTITUTION.name}</div>
          </div>
        </div>

        <h2 class="login-heading">Welcome back</h2>
        <p class="login-subheading">
          Sign in to your account to continue
        </p>

        <!-- ROLE SELECTOR -->
        <div class="role-selector">
          <button class="role-btn active" data-role="student">
            <div class="role-btn-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4
                1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div class="role-btn-label">Student</div>
          </button>
          <button class="role-btn" data-role="admin">
            <div class="role-btn-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L3
                10.26V15c0 3.31 4.03 6 9 6s9-2.69 9-6v-4.74L12 15.5z"/>
              </svg>
            </div>
            <div class="role-btn-label">Admin</div>
          </button>
          <button class="role-btn" data-role="faculty">
            <div class="role-btn-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 17.17L18.83 16H4V4h16v13.17zM20 2H4c-1.1
                0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <div class="role-btn-label">Faculty</div>
          </button>
        </div>

        <!-- FORM -->
        <form class="login-form" id="loginForm" novalidate>

          <div class="form-group" id="rollGroup">
            <label class="form-label" for="rollNumber">
              Roll Number / ID
            </label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1
                0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <input
                type="text"
                id="rollNumber"
                class="form-input input-with-icon"
                placeholder="e.g. CS2023001"
                autocomplete="username"
              />
            </div>
            <div class="field-error" id="rollError"></div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1
                0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9
                -2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2
                2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <input
                type="password"
                id="password"
                class="form-input input-with-icon"
                placeholder="Enter your password"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="password-toggle"
                id="passwordToggle"
                aria-label="Toggle password"
              >
                <svg id="eyeIcon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11
                  7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12.5c-2.76
                  0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66
                  0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            <div class="field-error" id="passwordError"></div>
          </div>

          <div class="login-options">
            <label class="remember-me">
              <input type="checkbox" id="rememberMe" />
              <span class="checkbox-custom"></span>
              Remember me
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <button type="submit" class="btn-login" id="loginBtn">
            <span id="loginBtnText">Sign In</span>
            <div class="login-spinner" id="loginSpinner"></div>
          </button>

          <div class="login-error-banner" id="loginError">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48
              10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span id="loginErrorText"></span>
          </div>

        </form>

        <p class="login-footer-note">
          ${INSTITUTION.academicYear} &nbsp;·&nbsp; ${INSTITUTION.name}
          &nbsp;·&nbsp;
          <a href="mailto:${INSTITUTION.email}">Support</a>
        </p>

      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="login-right">
      <div class="login-right-inner">
        <div class="login-right-content" id="rightContent">
          ${getRightContent('student')}
        </div>
      </div>
      <div class="login-right-bg"></div>
      <div class="login-right-grid"></div>
    </div>
  `;

  injectLoginStyles();
  initLoginLogic(page);
  return page;
}

// ── Right panel content per role ──────────────

function getRightContent(role) {
  const content = {
    student: {
      heading: 'Your academic life,<br>in one place',
      points: [
        { icon: '📋', text: 'Apply for leaves and track status in real time' },
        { icon: '📊', text: 'View attendance across all your subjects' },
        { icon: '🎓', text: 'Check marks, grades, and CGPA instantly' },
        { icon: '🔔', text: 'Get notified on approvals and announcements' },
      ],
      stat1: { val: '84%', label: 'Avg. attendance maintained' },
      stat2: { val: '< 3min', label: 'Average leave response time' },
    },
    admin: {
      heading: 'Full control over<br>your institution',
      points: [
        { icon: '✅', text: 'Approve or reject leave requests with one click' },
        { icon: '👥', text: 'Manage all students, faculty, and departments' },
        { icon: '📈', text: 'View real-time institution-wide analytics' },
        { icon: '⚙️', text: 'Configure policies, workflows, and settings' },
      ],
      stat1: { val: '10k+', label: 'Student records managed' },
      stat2: { val: '99.9%', label: 'System uptime guaranteed' },
    },
    faculty: {
      heading: 'Teaching tools<br>built for speed',
      points: [
        { icon: '✏️', text: 'Mark attendance for your class in under 60 seconds' },
        { icon: '📝', text: 'Enter and update exam scores effortlessly' },
        { icon: '📊', text: 'View class-level performance at a glance' },
        { icon: '📢', text: 'Post announcements directly to your students' },
      ],
      stat1: { val: '60s', label: 'To mark full class attendance' },
      stat2: { val: '100%', label: 'Paperless academic records' },
    },
  };

  const c = content[role];
  return `
    <div class="rp-heading">${c.heading}</div>
    <ul class="rp-points">
      ${c.points.map(p => `
        <li class="rp-point">
          <div class="rp-point-icon">${p.icon}</div>
          <div class="rp-point-text">${p.text}</div>
        </li>
      `).join('')}
    </ul>
    <div class="rp-stats">
      <div class="rp-stat">
        <div class="rp-stat-val">${c.stat1.val}</div>
        <div class="rp-stat-label">${c.stat1.label}</div>
      </div>
      <div class="rp-stat-divider"></div>
      <div class="rp-stat">
        <div class="rp-stat-val">${c.stat2.val}</div>
        <div class="rp-stat-label">${c.stat2.label}</div>
      </div>
    </div>
  `;
}

// ── Login logic ───────────────────────────────

function initLoginLogic(page) {
  let currentRole = 'student';

  const roleBtns     = page.querySelectorAll('.role-btn');
  const rollGroup    = page.querySelector('#rollGroup');
  const rollInput    = page.querySelector('#rollNumber');
  const rollLabel    = page.querySelector('label[for="rollNumber"]');
  const passwordInput= page.querySelector('#password');
  const loginForm    = page.querySelector('#loginForm');
  const loginBtn     = page.querySelector('#loginBtn');
  const loginBtnText = page.querySelector('#loginBtnText');
  const loginSpinner = page.querySelector('#loginSpinner');
  const loginError   = page.querySelector('#loginError');
  const loginErrorTxt= page.querySelector('#loginErrorText');
  const rightContent = page.querySelector('#rightContent');
  const pwToggle     = page.querySelector('#passwordToggle');
  const rollError    = page.querySelector('#rollError');
  const pwError      = page.querySelector('#passwordError');

  // Role switching
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRole = btn.dataset.role;

      // Update placeholder and label per role
      const placeholders = {
        student: { label: 'Roll Number', ph: 'e.g. CS2023001' },
        admin:   { label: 'Admin Email', ph: 'e.g. priya.mehta@greenfield.edu.in' },
        faculty: { label: 'Faculty ID',  ph: 'e.g. FAC042' },
      };
      rollLabel.textContent = placeholders[currentRole].label;
      rollInput.placeholder = placeholders[currentRole].ph;

      // Update right panel
      rightContent.style.opacity = '0';
      rightContent.style.transform = 'translateY(10px)';
      setTimeout(() => {
        rightContent.innerHTML = getRightContent(currentRole);
        rightContent.style.opacity = '1';
        rightContent.style.transform = 'translateY(0)';
      }, 200);

      clearErrors();
    });
  });

  // Password toggle
  pwToggle.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    pwToggle.style.color = isPassword
      ? 'var(--gold)'
      : 'var(--text-muted)';
  });

  // Clear errors on input
  rollInput.addEventListener('input', () => clearFieldError(rollInput, rollError));
  passwordInput.addEventListener('input', () => clearFieldError(passwordInput, pwError));

  // Form submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const id  = rollInput.value.trim();
    const pwd = passwordInput.value;
    let valid = true;

    // Validate
    if (!id) {
      showFieldError(rollInput, rollError, 'This field is required');
      valid = false;
    } else if (id.length < 3) {
      showFieldError(rollInput, rollError, 'Enter a valid ID');
      valid = false;
    }

    if (!pwd) {
      showFieldError(passwordInput, pwError, 'Password is required');
      valid = false;
    } else if (pwd.length < 4) {
      showFieldError(passwordInput, pwError, 'Password is too short');
      valid = false;
    }

    if (!valid) return;

    // Show loading
    setLoading(true);

    try {
      const data = await auth.login(id, pwd, currentRole);
      saveToken(data.token);
      saveUser(data.user);
      loginBtnText.textContent = 'Redirecting...';
      const routes = {
        student: '/src/pages/student-dashboard.html',
        admin:   '/src/pages/admin-dashboard.html',
        faculty: '/src/pages/faculty-dashboard.html',
      };
      setTimeout(() => {
        window.location.href = routes[data.user.role];
      }, 600);
    } catch (err) {
      setLoading(false);
      showBannerError(err.message || 'Incorrect ID or password. Please try again.');
    }
  });

  // Helpers
  function setLoading(on) {
    loginBtn.disabled = on;
    loginBtnText.style.opacity = on ? '0' : '1';
    loginSpinner.style.display = on ? 'block' : 'none';
  }

  function showFieldError(input, errorEl, msg) {
    input.classList.add('input-error');
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  function clearFieldError(input, errorEl) {
    input.classList.remove('input-error');
    errorEl.style.display = 'none';
  }

  function showBannerError(msg) {
    loginErrorTxt.textContent = msg;
    loginError.style.display = 'flex';
  }

  function clearErrors() {
    clearFieldError(rollInput, rollError);
    clearFieldError(passwordInput, pwError);
    loginError.style.display = 'none';
  }
}

// Auth is now handled by the real API via api.js

// ── Styles ────────────────────────────────────

function injectLoginStyles() {
  if (document.getElementById('login-styles')) return;
  const style = document.createElement('style');
  style.id = 'login-styles';
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .login-page {
      display: grid;
      grid-template-columns: 480px 1fr;
      min-height: 100vh;
      background: var(--white);
    }

    /* LEFT */
    .login-left {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--white);
      border-right: 1px solid var(--border);
    }
    .login-left-inner { width: 100%; max-width: 380px; }

    .login-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--text-muted);
      text-decoration: none;
      margin-bottom: 36px;
      transition: color .2s;
    }
    .login-back:hover { color: var(--text-dark); }

    .login-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 32px;
    }
    .login-brand-icon {
      width: 40px;
      height: 40px;
      background: var(--navy);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .login-brand-icon svg { width: 20px; height: 20px; fill: var(--gold-light); }
    .login-brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--navy);
    }
    .login-brand-name span { color: var(--gold); }
    .login-brand-inst {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .login-heading {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 6px;
    }
    .login-subheading {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 28px;
    }

    /* ROLE SELECTOR */
    .role-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 28px;
    }
    .role-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 12px 8px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--cream);
      cursor: pointer;
      transition: all .2s;
    }
    .role-btn:hover {
      border-color: var(--gold);
      background: var(--gold-pale);
    }
    .role-btn.active {
      border-color: var(--gold);
      background: var(--gold-pale);
      box-shadow: 0 0 0 3px rgba(201,153,42,0.12);
    }
    .role-btn-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--navy);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .role-btn.active .role-btn-icon { background: var(--gold); }
    .role-btn-icon svg { width: 16px; height: 16px; fill: var(--gold-light); }
    .role-btn.active .role-btn-icon svg { fill: var(--navy); }
    .role-btn-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
    }
    .role-btn.active .role-btn-label { color: var(--navy); font-weight: 600; }

    /* FORM */
    .login-form { margin-bottom: 24px; }
    .form-group { margin-bottom: 18px; }
    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-mid);
      margin-bottom: 6px;
    }
    .input-wrapper { position: relative; }
    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      fill: var(--text-muted);
      pointer-events: none;
    }
    .form-input {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-md);
      font-size: 14px;
      color: var(--text-dark);
      background: var(--white);
      transition: border-color .2s, box-shadow .2s;
      outline: none;
      font-family: 'DM Sans', sans-serif;
    }
    .input-with-icon { padding-left: 40px; }
    .form-input:focus {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(201,153,42,0.1);
    }
    .form-input.input-error {
      border-color: var(--danger);
      box-shadow: 0 0 0 3px rgba(185,28,28,0.08);
    }
    .form-input::placeholder { color: var(--text-muted); }
    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      padding: 4px;
      transition: color .2s;
    }
    .password-toggle svg { width: 18px; height: 18px; fill: currentColor; }
    .field-error {
      font-size: 12px;
      color: var(--danger);
      margin-top: 5px;
      display: none;
    }

    /* OPTIONS ROW */
    .login-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22px;
    }
    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-muted);
      cursor: pointer;
    }
    .remember-me input { display: none; }
    .checkbox-custom {
      width: 16px;
      height: 16px;
      border: 1.5px solid var(--border);
      border-radius: 4px;
      display: inline-block;
      position: relative;
      transition: all .2s;
      flex-shrink: 0;
    }
    .remember-me input:checked + .checkbox-custom {
      background: var(--gold);
      border-color: var(--gold);
    }
    .remember-me input:checked + .checkbox-custom::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 1px;
      width: 5px;
      height: 9px;
      border: 2px solid var(--navy);
      border-top: none;
      border-left: none;
      transform: rotate(45deg);
    }
    .forgot-link {
      font-size: 13px;
      color: var(--gold);
      text-decoration: none;
      font-weight: 500;
      transition: color .2s;
    }
    .forgot-link:hover { color: var(--navy); }

    /* LOGIN BUTTON */
    .btn-login {
      width: 100%;
      padding: 13px;
      background: var(--navy);
      color: var(--white);
      font-size: 15px;
      font-weight: 600;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      position: relative;
      transition: all .2s;
      font-family: 'DM Sans', sans-serif;
      letter-spacing: 0.2px;
    }
    .btn-login:hover { background: var(--navy-light); transform: translateY(-1px); box-shadow: var(--shadow-md); }
    .btn-login:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
    .login-spinner {
      display: none;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: var(--white);
      border-radius: 50%;
      animation: spin .7s linear infinite;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    @keyframes spin { to { transform: translate(-50%,-50%) rotate(360deg); } }

    /* ERROR BANNER */
    .login-error-banner {
      display: none;
      align-items: center;
      gap: 8px;
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: var(--radius-md);
      padding: 11px 14px;
      margin-top: 14px;
      font-size: 13px;
      color: var(--danger);
    }
    .login-error-banner svg { fill: var(--danger); flex-shrink: 0; }

    .login-footer-note {
      font-size: 12px;
      color: var(--text-muted);
      text-align: center;
    }
    .login-footer-note a { color: var(--gold); text-decoration: none; }

    /* RIGHT PANEL */
    .login-right {
      background: var(--navy);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .login-right-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(201,153,42,0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201,153,42,0.07) 1px, transparent 1px);
      background-size: 44px 44px;
      pointer-events: none;
    }
    .login-right-bg {
      position: absolute;
      top: -120px;
      left: -80px;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(201,153,42,0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .login-right-inner {
      position: relative;
      z-index: 1;
      padding: 48px;
      max-width: 480px;
      width: 100%;
    }
    .login-right-content {
      transition: opacity .2s ease, transform .2s ease;
    }
    .rp-heading {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 700;
      color: var(--white);
      line-height: 1.2;
      margin-bottom: 36px;
    }
    .rp-points { list-style: none; margin-bottom: 48px; }
    .rp-point {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 20px;
    }
    .rp-point-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(201,153,42,0.15);
      border: 1px solid rgba(201,153,42,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }
    .rp-point-text {
      font-size: 15px;
      color: rgba(255,255,255,0.7);
      line-height: 1.55;
      padding-top: 7px;
    }
    .rp-stats {
      display: flex;
      align-items: center;
      gap: 0;
      padding-top: 36px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .rp-stat { flex: 1; }
    .rp-stat-val {
      font-family: 'Playfair Display', serif;
      font-size: 32px;
      font-weight: 700;
      color: var(--gold-light);
      margin-bottom: 4px;
    }
    .rp-stat-label {
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      line-height: 1.4;
    }
    .rp-stat-divider {
      width: 1px;
      height: 48px;
      background: rgba(255,255,255,0.1);
      margin: 0 32px;
    }
  `;
  document.head.appendChild(style);
}