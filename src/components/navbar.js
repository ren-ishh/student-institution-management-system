// ============================================
//  NAVBAR COMPONENT
//  Call renderNavbar('landing' | 'dashboard' | 'login')
//  to get the right nav for each page
// ============================================

import INSTITUTION from '../../config/institution.js';

export function renderNavbar(page = 'landing') {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <div class="container navbar-inner">

      <a href="/index.html" class="navbar-brand">
        <div class="navbar-logo-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 12.5L3 10.26V15
            c0 3.31 4.03 6 9 6s9-2.69 9-6v-4.74L12 15.5z"/>
          </svg>
        </div>
        <span class="navbar-name">${INSTITUTION.shortName}<em>Portal</em></span>
      </a>

      ${page === 'landing' ? `
        <ul class="navbar-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#roles">Who It's For</a></li>
          <li><a href="#roadmap">Roadmap</a></li>
        </ul>
        <div class="navbar-actions">
          <a href="/src/pages/login.html" class="btn btn-outline" style="color:#fff;border-color:rgba(255,255,255,0.25);">
            Login
          </a>
        </div>
      ` : ''}

      ${page === 'dashboard' ? `
        <ul class="navbar-links navbar-links--light">
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Attendance</a></li>
          <li><a href="#">Marks</a></li>
          <li><a href="#">Leaves</a></li>
        </ul>
        <div class="navbar-actions">
          <div class="navbar-user">
            <div class="navbar-avatar">AS</div>
            <span class="navbar-username">Arjun Singh</span>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  // Inject navbar styles
  if (!document.getElementById('navbar-styles')) {
    const style = document.createElement('style');
    style.id = 'navbar-styles';
    style.textContent = `
      .navbar {
        background: var(--navy);
        height: 66px;
        display: flex;
        align-items: center;
        position: sticky;
        top: 0;
        z-index: 200;
        border-bottom: 1px solid rgba(201,153,42,0.18);
      }
      .navbar-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }
      .navbar-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }
      .navbar-logo-icon {
        width: 36px;
        height: 36px;
        background: var(--gold);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--navy);
      }
      .navbar-logo-icon svg { width: 18px; height: 18px; }
      .navbar-name {
        font-family: 'Playfair Display', serif;
        font-size: 18px;
        font-weight: 700;
        color: var(--white);
      }
      .navbar-name em {
        font-style: normal;
        color: var(--gold-light);
      }
      .navbar-links {
        display: flex;
        align-items: center;
        gap: 32px;
        list-style: none;
      }
      .navbar-links a {
        color: rgba(255,255,255,0.65);
        font-size: 14px;
        font-weight: 400;
        text-decoration: none;
        transition: color 0.2s;
        letter-spacing: 0.2px;
      }
      .navbar-links a:hover { color: var(--gold-light); }
      .navbar-actions { display: flex; align-items: center; gap: 12px; }
      .navbar-user {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
      }
      .navbar-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(201,153,42,0.2);
        border: 1.5px solid var(--gold);
        color: var(--gold-light);
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .navbar-username {
        font-size: 14px;
        color: rgba(255,255,255,0.8);
        font-weight: 400;
      }
    `;
    document.head.appendChild(style);
  }

  return nav;
}