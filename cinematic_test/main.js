// ── PRELOADER ──
function setupPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const logo = preloader.querySelector('.brand-logo-loader');
  const shimmer = preloader.querySelector('.logo-shimmer');
  const statusWrap = preloader.querySelector('.loading-status');
  const bar = preloader.querySelector('.progress-bar');
  const pct = preloader.querySelector('.progress-pct');
  const text = preloader.querySelector('.status-text');

  gsap.defaults({ ease: "power2.out" });

  const tl = gsap.timeline({
    onComplete: () => {
      preloader.style.display = 'none';
      gsap.from("#hero", { opacity: 0, y: 20, duration: 0.8 });
      if (window.showJourneyModal) {
        setTimeout(window.showJourneyModal, 800); // Small delay after hero reveal
      }
    }
  });

  // Fast-paced elegant reveal
  tl.to(logo, { opacity: 1, y: 0, duration: 0.5 }, 0.1)
    .to(statusWrap, { opacity: 1, y: 0, duration: 0.4 }, 0.2)
    .to({ val: 0 }, {
      val: 100,
      duration: 0.8,
      ease: "none",
      onUpdate: function () {
        const p = Math.round(this.targets()[0].val);
        bar.style.width = p + '%';
        pct.innerHTML = p + '%';
        if (p === 100) text.innerHTML = "ACCESS GRANTED";
      }
    }, 0.2)
    .to(shimmer, { left: "150%", duration: 0.6, ease: "power2.inOut" }, 0.3)
    .to([logo, statusWrap], { opacity: 0, y: -10, duration: 0.3 }, 1.1)
    .to(preloader, {
      yPercent: -100,
      duration: 0.6,
      ease: "expo.inOut"
    }, 1.3);
}
document.addEventListener('DOMContentLoaded', setupPreloader);

// ── NAVBAR + SCROLL TOP ──
const navbar = document.getElementById('navbar');
const stBtn = document.getElementById('stBtn');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  if (stBtn) stBtn.classList.toggle('vis', window.scrollY > 500);
});

// ── REVEAL ON SCROLL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-cinematic').forEach(el => obs.observe(el));

// ── PARALLAX (shapes + blobs) ──
if (window.innerWidth > 768) {
  // Mouse parallax
  document.addEventListener('mousemove', e => {
    const rx = (e.clientX / window.innerWidth - 0.5);
    const ry = (e.clientY / window.innerHeight - 0.5);

    document.querySelectorAll('.shape').forEach((s, i) => {
      const f = (i % 3 + 1) * 12;
      s.style.transform = `translateY(${ry * f}px) translateX(${rx * f}px)`;
    });

    document.querySelectorAll('.blob').forEach((b, i) => {
      const f = (i + 1) * 8;
      b.style.transform = `translate(${rx * f}px, ${ry * f}px)`;
    });
  });

  // Scroll parallax (Cinematic Depth)
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    document.querySelectorAll('.shape').forEach((s, i) => {
      const depth = (i + 1) * 0.15;
      s.style.top = `${(-scroll * depth)}px`;
    });
    document.querySelectorAll('.blob').forEach((b, i) => {
      const depth = (i + 1) * 0.1;
      b.style.marginTop = `${(scroll * depth)}px`;
    });
  });
}

// ── SLIDER GRADIENT ──
function updateSlider(el) {
  const min = +el.min || 0;
  const max = +el.max || 100;
  const val = +el.value;
  const pct = ((val - min) / (max - min)) * 100;
  el.style.setProperty('--pct', `${pct}%`);
  el.style.background = `linear-gradient(90deg, var(--green-soft) ${pct}%, rgba(26, 143, 115, 0.12) ${pct}%)`;
}

document.querySelectorAll('input[type=range]').forEach(el => {
  updateSlider(el);
  el.addEventListener('input', () => {
    updateSlider(el);
    calcSIP();
  });
});

// ── SIP CALC ──
function fmtINR(n) {
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + 'Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2) + 'L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

function fmtFull(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function calcSIP() {
  const slAmt = document.getElementById('slAmt');
  const slRate = document.getElementById('slRate');
  const slYrs = document.getElementById('slYrs');

  if (!slAmt || !slRate || !slYrs) return;

  const sip = parseFloat(slAmt.value);
  const r = parseFloat(slRate.value) / 100 / 12;
  const n = parseFloat(slYrs.value) * 12;

  document.getElementById('cAmt').textContent = '₹' + sip.toLocaleString('en-IN');
  document.getElementById('cRate').textContent = slRate.value + '%';
  document.getElementById('cYrs').textContent = slYrs.value + ' Years';

  const total = sip * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = sip * n;
  const gains = total - invested;

  document.getElementById('dTotal').textContent = fmtINR(total);
  document.getElementById('rInv').textContent = fmtFull(invested);
  document.getElementById('rGain').textContent = fmtFull(gains);
  document.getElementById('rTotal').textContent = fmtFull(total);

  const C = 2 * Math.PI * 70;
  const iA = C * (invested / total);
  const gA = C * (gains / total);

  const dInv = document.getElementById('dInv');
  const dGain = document.getElementById('dGain');

  if (dInv && dGain) {
    dInv.setAttribute('stroke-dasharray', `${iA} ${C - iA}`);
    dGain.setAttribute('stroke-dasharray', `${gA} ${C - gA}`);
    dGain.setAttribute('stroke-dashoffset', `-${iA}`);
  }
}

// ── COUNT-UP STATS ──
function countUp(id, target, suffix, prefix) {
  let s = 0;
  const el = document.getElementById(id);
  if (!el) return;

  const duration = 2000; // 2 seconds
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);

    s = target * ease;
    el.textContent = (prefix || '') + (s >= 1000 ? Math.floor(s).toLocaleString('en-IN') : Math.floor(s)) + (suffix || '');

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

const statsEl = document.getElementById('stats');
if (statsEl) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      countUp('s1', 27, '');
      countUp('s2', 1200, '');
      countUp('s3', 500, '');
      countUp('s4', 40, '');
      statsObs.disconnect();
    }
  }, { threshold: 0.4 });
  statsObs.observe(statsEl);
}

// ── JOURNEY MODAL ──
function setupJourneyModal() {
  const modal = document.getElementById('journeyModal');
  const card = document.getElementById('journeyCard');
  const closeBtn = document.getElementById('closeModal');
  if (!modal || !card || !closeBtn) return;

  // Cinematic Entrance Function
  window.showJourneyModal = () => {
    // Only show once per session
    if (sessionStorage.getItem('journeyShown')) return;

    // SVG Initialization
    const path = document.querySelector('#growthLine');
    let l = 0;
    if (path) {
      l = path.getTotalLength();
      gsap.set(path, { strokeDasharray: l, strokeDashoffset: l });
    }

    // Set initial states via GSAP
    gsap.set(modal, { display: 'flex', opacity: 0 });
    gsap.set(card, { scale: 0.85, y: 60, filter: 'blur(30px)', opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('journeyShown', 'true');
        modal.classList.add('active');
      }
    });

    tl.to(modal, { opacity: 1, duration: 1, ease: "power2.out" })
      .to(card, {
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        opacity: 1,
        duration: 1.8,
        ease: "expo.out"
      }, "-=0.6")
      .to(path, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.inOut"
      }, "-=1.2")
      .to(".milestone", {
        opacity: 1,
        y: 0,
        stagger: 0.3,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=1.5")
      .from(".modal-stat-card", {
        y: 40,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      }, "-=1.8");
  };

  const closePop = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        modal.style.display = 'none';
        modal.style.pointerEvents = 'none';
        modal.classList.remove('active');
      }
    });

    tl.to(card, {
      scale: 0.9,
      y: 40,
      filter: 'blur(10px)',
      opacity: 0,
      duration: 0.6,
      ease: "power2.in"
    })
      .to(modal, {
        opacity: 0,
        duration: 0.4
      }, "-=0.3");
  };

  closeBtn.onclick = (e) => {
    e.preventDefault();
    closePop();
  };

  modal.onclick = (e) => {
    if (e.target === modal) closePop();
  };
}
document.addEventListener('DOMContentLoaded', setupJourneyModal);

window.calcSIP = calcSIP;
window.addEventListener('DOMContentLoaded', calcSIP);
