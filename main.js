// ── SUPABASE INTEGRATION ──
import { supabase } from './src/lib/supabase.js';

async function loadBlogs() {
  const container = document.getElementById('blog-container');
  if (!container) return;

  console.log('IPFS: Initializing Blog Load...');

  try {
    // Debug credential presence
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!envUrl) {
      console.warn('IPFS: VITE_SUPABASE_URL is missing!');
    }

    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('IPFS Supabase Error:', error);
      throw error;
    }

    console.log(`IPFS: Successfully fetched ${blogs?.length} blogs`);

    if (!blogs || blogs.length === 0) {
      container.innerHTML = `<p style="text-align:center; grid-column: 1/-1; opacity: 0.6;">Intelligence hub is currently being updated. Check back soon.</p>`;
      return;
    }

    container.innerHTML = ''; // Clear loading state

    blogs.forEach((blog, i) => {
      const card = document.createElement('div');
      const delayClass = `d${(i % 4) + 1}`;
      const themeClass = blog.theme === 'dark' ? 'dark-card' : 'light-card';

      card.className = `blog-card ${themeClass} reveal ${delayClass}`;

      let actionsHtml = '';
      if (blog.is_coming_soon) {
        const dotClass = blog.theme === 'dark' ? '' : 'dot-light';
        const badgeClass = blog.theme === 'dark' ? '' : 'coming-soon-light';
        actionsHtml = `
          <div class="coming-soon-badge ${badgeClass}">
            <span class="dot ${dotClass}"></span> Coming Soon
          </div>
        `;
      } else {
        const btnMainClass = blog.theme === 'dark' ? 'btn-pdf-main-sm' : 'btn-pdf-main-sm-light';
        const btnSecClass = blog.theme === 'dark' ? 'btn-pdf-sec-sm' : 'btn-pdf-sec-sm-light';

        actionsHtml = `
          <div class="card-actions">
            ${blog.pdf_url ? `<a href="${blog.pdf_url}" target="_blank" class="${btnMainClass}">Download</a>` : ''}
            ${blog.read_url ? `<a href="${blog.read_url}" class="${btnSecClass}">Read</a>` : ''}
          </div>
        `;
      }

      // Determine icon or image
      let mediaHtml = `
        <div class="card-img-wrap">
          <img src="${blog.image_url}" alt="${blog.title}" style="width:100%; height:100%; object-fit:cover;">
        </div>
      `;

      card.innerHTML = `
        ${mediaHtml}
        <div class="blog-meta">${blog.meta}</div>
        <h3 class="blog-title">${blog.title}</h3>
        <p class="blog-desc">${blog.description}</p>
        ${actionsHtml}
      `;

      container.appendChild(card);
    });

    // Re-trigger Reveal Observation
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  } catch (err) {
    console.error('IPFS: Critical Load Error:', err);
    container.innerHTML = `
      <div style="text-align:center; grid-column: 1/-1; border: 1px dashed rgba(255,0,0,0.3); padding: 20px; border-radius: 12px; background: rgba(255,0,0,0.05);">
        <p style="color:#d32f2f; font-weight: 700;">Intelligence Hub Connection Error</p>
        <p style="font-size: 11px; opacity: 0.7; margin: 10px 0;">Error Details: ${err.message || JSON.stringify(err)}</p>
        <p style="font-size: 10px; opacity: 0.5;">Check browser console (F12) for network details.</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('blogs-page')) {
    loadBlogs();
  }
});

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

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── MOBILE MENU ──
function setupMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!menuToggle || !navLinks) return;

  // Use addEventListener instead of onclick to avoid overrides
  menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// Initial call in case script is loaded after DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupMobileMenu);
} else {
  setupMobileMenu();
}

// ── PARALLAX (shapes + blobs) ──
if (window.innerWidth > 768) {
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
    const isFloat = target % 1 !== 0;
    const formattedVal = s >= 1000
      ? Math.floor(s).toLocaleString('en-IN')
      : (isFloat ? s.toFixed(2) : Math.floor(s));

    el.textContent = (prefix || '') + formattedVal + (suffix || '');

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
      countUp('s1', 26, '');
      countUp('s2', 595, '');
      countUp('s3', 443.89, '');
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

    // SVG Initialization for growth animation
    const path = document.querySelector('#growthLine');
    let l = 0;
    if (path) {
      l = path.getTotalLength();
      gsap.set(path, { strokeDasharray: l, strokeDashoffset: l });
    }

    // Set initial states via GSAP
    gsap.set(modal, { display: 'flex', opacity: 0, pointerEvents: 'auto' });
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
        stagger: 0.15,
        ease: "power4.out"
      }, "-=1.8")
      // COUNT UP ANIMATIONS
      .to({ val: 0 }, {
        val: 26,
        duration: 2,
        ease: "power2.out",
        onUpdate: function () {
          const el = document.getElementById('mYear');
          if (el) el.textContent = Math.floor(this.targets()[0].val);
        }
      }, "-=1.5")
      .to({ val: 0 }, {
        val: 443.89,
        duration: 2.2,
        ease: "power2.out",
        onUpdate: function () {
          const el = document.getElementById('mStat1');
          if (el) el.textContent = this.targets()[0].val.toFixed(2);
        }
      }, "-=1.5")
      .to({ val: 0 }, {
        val: 595,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: function () {
          const el = document.getElementById('mStat2');
          if (el) el.textContent = Math.floor(this.targets()[0].val).toLocaleString('en-IN');
        }
      }, "-=1.5");
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
