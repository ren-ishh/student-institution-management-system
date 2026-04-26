// ============================================
//  MAIN ENTRY — routes to the right page module
// ============================================

import './style.css';
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderLanding } from './pages/landing.js';

const app = document.getElementById('app');

// Render page
app.appendChild(renderNavbar('landing'));
app.appendChild(renderLanding());
app.appendChild(renderFooter());