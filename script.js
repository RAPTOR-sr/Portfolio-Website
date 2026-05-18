/* ─── PAGE LOADER ──────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1400);
  }
});

/* ─── CUSTOM CURSOR ────────────────────────── */
(function initCursor() {
  const orb   = document.getElementById('cursor-orb');
  const trail = document.getElementById('cursor-trail');
  if (!orb || !trail) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    orb.style.left = mouseX + 'px';
    orb.style.top  = mouseY + 'px';
  });

  // Lag the trail using requestAnimationFrame
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .btn, .skill-card, .project-card, .skill-icon, input, textarea';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ─── BACKGROUND PARTICLES ─────────────────── */
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 60;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomColor() {
    // alternates between blue and red tones
    return Math.random() > 0.5
      ? `rgba(0, ${160 + Math.floor(Math.random() * 40)}, 255, `
      : `rgba(255, ${30 + Math.floor(Math.random() * 30)}, ${60 + Math.floor(Math.random() * 30)}, `;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = 0.8 + Math.random() * 2;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.color = randomColor();
    this.alpha = 0.2 + Math.random() * 0.5;
  };

  for (let i = 0; i < COUNT; i++) {
    particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.07;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 198, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ─── TYPING ANIMATION ──────────────────────── */
(function initTyping() {
  const typingText = document.querySelector('.typing');
  if (!typingText) return;

  const words = ['Machine Learning Developer', 'Data Science Enthusiast', 'AI Explorer'];
  let wordIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, 4000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 600);
    } else {
      setTimeout(type, isDeleting ? 80 : 160);
    }
  }

  type();
})();

/* ─── NAV SCROLL EFFECT & ACTIVE LINK ──────── */
(function initNav() {
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  function onScroll() {
    // Compact nav on scroll
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    // Active section highlight
    let current = '';
    sections.forEach(section => {
      const top    = section.offsetTop - 120;
      const bottom = top + section.clientHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── SMOOTH SCROLL ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── SCROLL REVEAL ─────────────────────────── */
(function initReveal() {
  // Add reveal class to key containers
  const revealSelectors = [
    { sel: '.hero-content',        cls: 'reveal-left' },
    { sel: '.hero-img',            cls: 'reveal-right' },
    { sel: '.about-text',          cls: 'reveal-left' },
    { sel: '.about-img',           cls: 'reveal-right' },
    { sel: '.education-text',      cls: 'reveal-left' },
    { sel: '.education-img',       cls: 'reveal-right' },
    { sel: '.exp-img',             cls: 'reveal-left' },
    { sel: '.exp-text',            cls: 'reveal-right' },
    { sel: '.skill-card',          cls: 'reveal' },
    { sel: '.project-card',        cls: 'reveal' },
    { sel: '.section-title',       cls: 'reveal' },
    { sel: '.subsection-title',    cls: 'reveal' },
    { sel: '.contact-info',        cls: 'reveal' },
    { sel: '#contact-form',        cls: 'reveal' },
  ];

  revealSelectors.forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add(cls);
      // Stagger cards
      if (sel === '.skill-card' || sel === '.project-card') {
        el.style.transitionDelay = `${i * 0.08}s`;
      }
    });
  });

  // Hero is immediately visible
  document.querySelectorAll('.hero .reveal, .hero .reveal-left, .hero .reveal-right').forEach(el => {
    el.classList.add('visible');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();

/* ─── CARD 3D TILT ──────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── MAGNETIC BUTTON EFFECT ─────────────────── */
(function initMagnetic() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top  + rect.height / 2);
      btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();
