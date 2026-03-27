/* =====================================================
   PORTFOLIO JAVASCRIPT
   ===================================================== */

// ── Custom Cursor ──────────────────────────────────
const cursor       = document.getElementById('cursor');
const cursorFollow = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animCursor() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  cursorFollow.style.left = fx + 'px';
  cursorFollow.style.top  = fy + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card, .info-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorFollow.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorFollow.classList.remove('hover'); });
});

// ── Navbar scroll effect & active link ────────────
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  // Active nav link based on scroll position
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// ── Mobile hamburger menu ─────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksMenu.classList.toggle('open');
});

// Close menu on link click (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksMenu.classList.remove('open');
  });
});

// ── Particle Canvas ───────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.size   = Math.random() * 1.8 + 0.5;
    this.alpha  = Math.random() * 0.5 + 0.1;
    this.color  = Math.random() > 0.5 ? '0,229,255' : '124,58,237';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,229,255,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animParticles);
}
animParticles();

// ── Typewriter roles ──────────────────────────────
const roles = [
  'Computer Systems Engineer',
  'Frontend Developer',
  'Graphic Designer',
  'C/C++ Programmer',
  'UI/UX Designer',
];
let roleIdx = 0, charIdx = 0, deleting = false;
const roleEl = document.getElementById('roleText');

function typeRole() {
  const current = roles[roleIdx];
  if (!deleting) {
    roleEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRole, 2000);
      return;
    }
  } else {
    roleEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 50 : 90);
}
typeRole();

// ── Counter animation ─────────────────────────────
const statNums = document.querySelectorAll('.stat-num');
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;
  statNums.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let count = 0;
    const duration = 1400;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = Math.floor(count);
      if (count >= target) clearInterval(timer);
    }, 16);
  });
}

// ── Reveal on scroll (IntersectionObserver) ───────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger skill bars if inside skill section
      if (entry.target.classList.contains('skill-card') || entry.target.closest('.skills-grid')) {
        animSkillBars();
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Start counters when hero section is in view
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) animateCounters(); });
}, { threshold: 0.4 });
const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);

// ── Skill bars animation ──────────────────────────
let skillsAnimated = false;
function animSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const target = bar.dataset.width;
    setTimeout(() => { bar.style.width = target + '%'; }, 200);
  });
}

const skillsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) animSkillBars(); });
}, { threshold: 0.2 });
const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

// ── Project filter ────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const cat = card.dataset.category;
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── Contact form ──────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending...';

  // Simulate submission (replace with real backend/EmailJS/Formspree)
  setTimeout(() => {
    formSuccess.classList.add('show');
    contactForm.reset();
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1200);
});

// ── Smooth anchor scroll (fallback for older browsers) ─
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Navbar visible on load ────────────────────────
window.dispatchEvent(new Event('scroll'));

