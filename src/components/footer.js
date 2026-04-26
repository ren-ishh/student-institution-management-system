import INSTITUTION from '../../config/institution.js';

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container footer-inner">
      <div class="footer-left">
        <div class="footer-brand">
          <span>${INSTITUTION.shortName}</span>Portal
        </div>
        <p class="footer-tagline">${INSTITUTION.tagline}</p>
        <p class="footer-copy">© ${new Date().getFullYear()} ${INSTITUTION.name}. All rights reserved.</p>
      </div>
      <div class="footer-links">
        <div class="footer-col">
          <div class="footer-col-title">Platform</div>
          <a href="#">Features</a>
          <a href="#">Roadmap</a>
          <a href="#">Documentation</a>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Institution</div>
          <a href="#">${INSTITUTION.name}</a>
          <a href="#">${INSTITUTION.address}</a>
          <a href="#">${INSTITUTION.email}</a>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Legal</div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Support</a>
        </div>
      </div>
    </div>
  `;

  if (!document.getElementById('footer-styles')) {
    const style = document.createElement('style');
    style.id = 'footer-styles';
    style.textContent = `
      .footer {
        background: #07111F;
        padding: 56px 0 32px;
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      .footer-inner {
        display: flex;
        justify-content: space-between;
        gap: 48px;
      }
      .footer-brand {
        font-family: 'Playfair Display', serif;
        font-size: 20px;
        font-weight: 700;
        color: var(--white);
        margin-bottom: 8px;
      }
      .footer-brand span { color: var(--gold-light); }
      .footer-tagline {
        font-size: 13px;
        color: rgba(255,255,255,0.35);
        margin-bottom: 20px;
        max-width: 220px;
        line-height: 1.6;
      }
      .footer-copy {
        font-size: 12px;
        color: rgba(255,255,255,0.25);
      }
      .footer-links {
        display: flex;
        gap: 48px;
      }
      .footer-col {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .footer-col-title {
        font-size: 11px;
        font-weight: 600;
        color: rgba(255,255,255,0.4);
        letter-spacing: 1.2px;
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .footer-col a {
        font-size: 13px;
        color: rgba(255,255,255,0.5);
        text-decoration: none;
        transition: color 0.2s;
      }
      .footer-col a:hover { color: var(--gold-light); }
    `;
    document.head.appendChild(style);
  }

  return footer;
}