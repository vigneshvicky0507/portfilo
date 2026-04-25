/* ============================================================
   VIGNESH — CINEMATIC PORTFOLIO
   script.js
   ============================================================ */


/* ============================================================
   1. CINEMA INTRO SEQUENCE
   ============================================================ */
setTimeout(() => {
  document.getElementById('intro').classList.add('fade-out');
  document.getElementById('ltop').classList.add('open');
  document.getElementById('lbot').classList.add('open');

  // Remove from DOM after transition completes
  setTimeout(() => {
    document.getElementById('intro').style.display = 'none';
  }, 1500);
}, 3200);


/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
const cur   = document.getElementById('cur');
const trail = document.getElementById('cur-trail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

// Snap cursor dot to mouse immediately
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cur.style.left = mouseX + 'px';
  cur.style.top  = mouseY + 'px';
});

// Trail follows with easing
(function animateCursor() {
  trailX += (mouseX - trailX) * 0.1;
  trailY += (mouseY - trailY) * 0.1;
  trail.style.left = trailX + 'px';
  trail.style.top  = trailY + 'px';
  requestAnimationFrame(animateCursor);
})();


/* ============================================================
   3. CANVAS — CINEMATIC BACKGROUND SCENE
      - Deep space radial gradient
      - Perspective grid floor
      - Twinkling star field
      - Floating gold-dust nodes with connections
      - Horizontal cinematic scan line
   ============================================================ */
const canvas = document.getElementById('scene-canvas');
const ctx    = canvas.getContext('2d');

let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── Star field ──────────────────────────────────────────────
const stars = Array.from({ length: 200 }, () => ({
  x:            Math.random(),
  y:            Math.random(),
  size:         Math.random() * 1.2 + 0.2,
  speed:        Math.random() * 0.00015 + 0.00005,
  opacity:      Math.random() * 0.5 + 0.1,
  twinkleSpeed: Math.random() * 0.02 + 0.005,
  twinklePhase: Math.random() * Math.PI * 2,
}));

// ── Floating nodes ──────────────────────────────────────────
const nodes = Array.from({ length: 40 }, () => ({
  x:       Math.random(),
  y:       Math.random(),
  vx:      (Math.random() - 0.5) * 0.0003,
  vy:      (Math.random() - 0.5) * 0.0003,
  size:    Math.random() * 1.5 + 0.5,
  opacity: Math.random() * 0.25 + 0.05,
}));

let frame = 0;

function drawScene() {
  ctx.clearRect(0, 0, W, H);
  frame++;

  // Deep space gradient overlay
  const grad = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, H * 0.8);
  grad.addColorStop(0, 'rgba(14,11,7,0.0)');
  grad.addColorStop(1, 'rgba(6,5,4,0.4)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Perspective grid (vanishing-point floor)
  const gridY = H * 0.65;
  const vp    = { x: W * 0.5, y: gridY * 0.5 };

  ctx.strokeStyle = 'rgba(201,168,76,0.025)';
  ctx.lineWidth   = 0.5;

  // Vertical lines converging to vanishing point
  for (let i = -12; i <= 12; i++) {
    const x = W * 0.5 + i * 70;
    ctx.beginPath();
    ctx.moveTo(x, gridY);
    ctx.lineTo(vp.x, vp.y);
    ctx.stroke();
  }

  // Horizontal grid lines (perspective-spaced)
  for (let j = 0; j <= 10; j++) {
    const t      = j / 10;
    const y      = gridY + (H - gridY) * (1 - Math.pow(1 - t, 2.5));
    const xLeft  = vp.x - (vp.x - (-W * 0.2)) * (1 - t);
    const xRight = vp.x + (W * 1.2 - vp.x)    * (1 - t);
    ctx.beginPath();
    ctx.moveTo(xLeft, y);
    ctx.lineTo(xRight, y);
    ctx.stroke();
  }

  // Twinkling stars
  stars.forEach((s) => {
    s.twinklePhase += s.twinkleSpeed;
    const twinkle = (0.5 + 0.5 * Math.sin(s.twinklePhase)) * s.opacity;
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,240,232,${twinkle})`;
    ctx.fill();
  });

  // Gold-dust floating nodes
  nodes.forEach((n) => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > 1) n.vx *= -1;
    if (n.y < 0 || n.y > 1) n.vy *= -1;

    ctx.beginPath();
    ctx.arc(n.x * W, n.y * H, n.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,168,76,${n.opacity})`;
    ctx.fill();
  });

  // Node connection lines
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx   = (nodes[i].x - nodes[j].x) * W;
      const dy   = (nodes[i].y - nodes[j].y) * H;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x * W, nodes[i].y * H);
        ctx.lineTo(nodes[j].x * W, nodes[j].y * H);
        ctx.strokeStyle = `rgba(201,168,76,${0.06 * (1 - dist / 150)})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }
    }
  }

  // Cinematic horizontal scan line
  const scanY    = (frame * 0.4) % H;
  const scanGrad = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
  scanGrad.addColorStop(0,   'transparent');
  scanGrad.addColorStop(0.5, 'rgba(201,168,76,0.03)');
  scanGrad.addColorStop(1,   'transparent');
  ctx.fillStyle = scanGrad;
  ctx.fillRect(0, scanY - 2, W, 4);

  requestAnimationFrame(drawScene);
}

drawScene();


/* ============================================================
   4. POSTER CARD — 3D MOUSE TILT
   ============================================================ */
const posterCard = document.getElementById('posterCard');

if (posterCard) {
  posterCard.addEventListener('mousemove', (e) => {
    const rect = posterCard.getBoundingClientRect();
    const rx   =  ((e.clientY - rect.top)  / rect.height - 0.5) * 18;
    const ry   = -((e.clientX - rect.left) / rect.width  - 0.5) * 18;
    posterCard.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  });

  posterCard.addEventListener('mouseleave', () => {
    posterCard.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
}


/* ============================================================
   5. SCROLL REVEAL — INTERSECTION OBSERVER
   ============================================================ */
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');

      // Animate any skill bars inside the revealed element
      entry.target.querySelectorAll('.sp-fill').forEach((bar) => {
        bar.classList.add('on');
      });

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach((el) => revealObserver.observe(el));


/* ============================================================
   6. SKILL BARS — TRIGGER ON SECTION ENTER
   ============================================================ */
const skillSection = document.getElementById('skills');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.sp-fill').forEach((bar) => {
        bar.classList.add('on');
      });
    }
  });
}, { threshold: 0.2 });

if (skillSection) skillObserver.observe(skillSection);


/* ============================================================
   7. HERO PARALLAX ON SCROLL
   ============================================================ */
window.addEventListener('scroll', () => {
  const scrollY   = window.scrollY;
  const heroEl    = document.getElementById('hero');
  if (heroEl) {
    heroEl.style.transform = `translateY(${scrollY * 0.3}px)`;
  }
});