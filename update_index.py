import re
import os

filepath = r'd:\ipfs final\index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Hero Section
hero_old = """  <h1 class="hero-headline">
    Build Wealth That<br>
    <em>Lasts</em> <span class="gold-word">Generations</span>
  </h1>

  <p class="hero-sub">
    Smart wealth creation, simplified. Join over 1,200 families growing their legacy with tailored investment strategies and world-class management.
  </p>

  <div class="hero-cta">
    <a href="#contact" class="btn-primary-hero">Get Started</a>
    <a href="#difference" class="btn-ghost-hero">Our Strategy</a>
  </div>"""

hero_new = """  <h1 class="hero-headline">
    Build Wealth. Achieve Goals.<br>
    <em>Live</em> <span class="gold-word">Financially Confident.</span>
  </h1>

  <p class="hero-sub">
    Smart investment solutions designed to grow, protect, and manage your wealth — all in one place.
  </p>

  <div class="hero-cta">
    <a href="#contact" class="btn-primary-hero">Start Investing</a>
    <a href="#difference" class="btn-ghost-hero">View Portfolio</a>
  </div>"""
content = content.replace(hero_old, hero_new)

# 2. Difference -> Why Choose Us
diff_old_pattern = re.compile(r'<!-- IPFS DIFFERENCE -->.*?<!-- SOLUTIONS -->', re.DOTALL)
diff_new = """<!-- WHY CHOOSE US -->
<section id="difference">
  <div class="max-w">
    <div class="diff-header">
      <div>
        <div class="section-eyebrow reveal">Why Choose Us</div>
        <h2 class="section-title reveal d1">Why Investors <em>Trust Us</em></h2>
      </div>
      <div class="diff-header-right reveal d2">
        <p style="color:var(--text-2); font-size:15px; line-height:1.75; margin-top:12px;">We align your investments with your life goals — not just returns. Experience a platform built on transparency, strategy, and continuous monitoring.</p>
      </div>
    </div>

    <div class="diff-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
      <div class="diff-card reveal d1">
        <div class="diff-icon">🎯</div>
        <div class="diff-title">Goal-Based Investment Approach</div>
        <div class="diff-desc">We align your investments with your life goals — not just returns.</div>
      </div>
      <div class="diff-card reveal d2">
        <div class="diff-icon">📈</div>
        <div class="diff-title">Smart & Disciplined Investing</div>
        <div class="diff-desc">Structured investment strategies built for long-term wealth creation.</div>
      </div>
      <div class="diff-card reveal d3">
        <div class="diff-icon">📱</div>
        <div class="diff-title">Real-Time Portfolio Access</div>
        <div class="diff-desc">Track your investments anytime with complete transparency.</div>
      </div>
      <div class="diff-card reveal d4">
        <div class="diff-icon">⚡</div>
        <div class="diff-title">Continuous Monitoring</div>
        <div class="diff-desc">Regular tracking to keep your investments aligned with your goals.</div>
      </div>
    </div>
  </div>
</section>

<!-- SOLUTIONS -->"""
content = diff_old_pattern.sub(diff_new, content)

# 3. Solutions -> Services / Features
sol_old_pattern = re.compile(r'<!-- SOLUTIONS -->.*?<!-- JOURNEY -->', re.DOTALL)
sol_new = """<!-- SOLUTIONS -->
<section id="solutions">
  <div class="max-w">
    <div class="sol-layout">
      <div class="sol-info">
        <div class="section-eyebrow reveal">Services & Features</div>
        <h2 class="section-title reveal d1">Complete Investment<br><em>Solutions</em></h2>
        <p style="font-size:15.5px; line-height:1.75; color:var(--text-2); max-width:380px; margin-top:14px;" class="reveal d2">Empowering your financial journey with dynamic tools, diverse funds, and goal-oriented planning built into a seamless platform.</p>
        <a href="#contact" style="display:inline-flex; align-items:center; gap:8px; margin-top:28px; font-size:13.5px; font-weight:600; color:var(--green-mid); text-decoration:none;" class="reveal d3">Explore Platform →</a>
      </div>
      <div class="sol-cards" style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div class="sol-card reveal d1">
          <div class="sol-card-icon">💎</div>
          <div>
            <div class="sol-card-title">Mutual Fund Investments</div>
            <div class="sol-card-desc">Access top-performing funds across categories to build a diversified portfolio.</div>
          </div>
        </div>
        <div class="sol-card reveal d2">
          <div class="sol-card-icon">↻</div>
          <div>
            <div class="sol-card-title">SIP Investments</div>
            <div class="sol-card-desc">Create wealth consistently through disciplined monthly investments.</div>
          </div>
        </div>
        <div class="sol-card reveal d3">
          <div class="sol-card-icon">⛳</div>
          <div>
            <div class="sol-card-title">Goal Planning</div>
            <div class="sol-card-desc">Plan for life goals like retirement, education, or wealth creation with clarity.</div>
          </div>
        </div>
        <div class="sol-card reveal d4">
          <div class="sol-card-icon">📊</div>
          <div>
            <div class="sol-card-title">Portfolio Tracking</div>
            <div class="sol-card-desc">Monitor all your investments in one place with detailed insights.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- JOURNEY -->"""
content = sol_old_pattern.sub(sol_new, content)

# 4. Journey -> How it works -> POWER SECTION -> FINANCIAL GOALS -> APP PLATFORM -> STATS
journey_old_pattern = re.compile(r'<!-- JOURNEY -->.*?<!-- STATS -->', re.DOTALL)
journey_new = """<!-- JOURNEY -->
<section id="journey">
  <div class="max-w">
    <div class="section-eyebrow reveal" style="text-align:center">How It Works</div>
    <h2 class="section-title reveal d1" style="text-align:center">Your Investment Journey <em>Simplified</em></h2>
    <div class="journey-grid">
      <div class="journey-card reveal d1">
        <div class="journey-num">01</div>
        <div class="journey-title">Define Your Goals</div>
        <div class="journey-desc">Set clear financial goals — from short-term needs to long-term wealth creation.</div>
      </div>
      <div class="journey-card reveal d2">
        <div class="journey-num">02</div>
        <div class="journey-title">Build Your Strategy</div>
        <div class="journey-desc">Choose the right investment mix based on your time horizon and comfort level.</div>
      </div>
      <div class="journey-card reveal d3">
        <div class="journey-num">03</div>
        <div class="journey-title">Invest Smartly</div>
        <div class="journey-desc">Start investing seamlessly with a structured and disciplined approach.</div>
      </div>
      <div class="journey-card reveal d4">
        <div class="journey-num">04</div>
        <div class="journey-title">Track & Grow</div>
        <div class="journey-desc">Monitor progress and stay on track to achieve your financial goals.</div>
      </div>
    </div>
  </div>
</section>

<!-- POWER SECTION -->
<section id="sip-power" style="padding: 120px 0; background: var(--bg-alt); position: relative; overflow: hidden;">
  <div class="global-decor" style="opacity: 0.5;">
    <div class="central-glow"></div>
  </div>
  <div class="max-w" style="position: relative; z-index: 2; text-align: center;">
    <div class="section-eyebrow reveal">The Power Set</div>
    <h2 class="section-title reveal d1">Start Small. <em>Grow Big.</em></h2>
    <p class="reveal d2" style="font-size:18px; line-height:1.75; color:var(--text-2); max-width:600px; margin:24px auto 0;">
      Consistent investing through SIP helps you benefit from compounding and market averaging — turning small investments into long-term wealth.
    </p>
    <a href="#calculator" class="btn-primary-hero reveal d3" style="display:inline-block; margin-top:40px; background:var(--gold); color:var(--green-deep);">Explore SIP Power</a>
  </div>
</section>

<!-- FINANCIAL GOALS -->
<section id="goals" style="padding: 120px 0;">
  <div class="max-w">
    <div class="section-eyebrow reveal" style="text-align:center">Financial Goals</div>
    <h2 class="section-title reveal d1" style="text-align:center">Plan for What <em>Matters Most</em></h2>
    <div class="diff-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-top:60px;">
      <div class="diff-card reveal d1">
        <div class="diff-icon">🎓</div>
        <div class="diff-title">Child Education</div>
        <div class="diff-desc">Secure your child’s future with structured investments.</div>
      </div>
      <div class="diff-card reveal d2">
        <div class="diff-icon">🌴</div>
        <div class="diff-title">Retirement Planning</div>
        <div class="diff-desc">Build a strong financial foundation for a stress-free retirement.</div>
      </div>
      <div class="diff-card reveal d3">
        <div class="diff-icon">🚀</div>
        <div class="diff-title">Wealth Creation</div>
        <div class="diff-desc">Grow your money steadily over time with smart investments.</div>
      </div>
      <div class="diff-card reveal d4">
        <div class="diff-icon">🛡️</div>
        <div class="diff-title">Tax Saving</div>
        <div class="diff-desc">Optimize your investments while reducing tax liability.</div>
      </div>
    </div>
  </div>
</section>

<!-- APP PLATFORM / MARKET -->
<section id="platform" style="padding: 100px 0; background: rgba(160, 201, 105, 0.03); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);">
  <div class="max-w">
    <div style="display:flex; flex-wrap:wrap; gap:60px; align-items:center;">
      <div style="flex:1; min-width:320px;">
        <div class="section-eyebrow reveal">Premium Platform</div>
        <h2 class="section-title reveal d1">Everything You Need,<br><em>In One Place</em></h2>
        <p class="reveal d2" style="font-size:16px; line-height:1.75; color:var(--text-2); margin-top:20px;">
          Explore top-performing funds, invest in new opportunities, track market updates, and access powerful financial tools — all from a single platform.
        </p>
      </div>
      <div style="flex:1; min-width:320px;" class="reveal d3">
        <div style="background:var(--bg); border:1px solid var(--border); border-radius:24px; padding:40px; box-shadow:0 20px 40px rgba(0,0,0,0.1);">
          <h3 style="font-family:'DM Serif Display',serif; font-size:24px; margin-bottom:20px;">Stay Updated with Markets</h3>
          <div style="display:flex; flex-direction:column; gap:20px;">
            <div style="padding:20px; background:rgba(255,255,255,0.03); border-radius:16px; border:1px solid var(--border);">
              <div style="font-size:14px; color:var(--text-3); font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Latest NAV</div>
              <div style="font-size:15px; color:var(--text); line-height:1.5;">Get updated fund values instantly.</div>
            </div>
            <div style="padding:20px; background:rgba(255,255,255,0.03); border-radius:16px; border:1px solid var(--border);">
              <div style="font-size:14px; color:var(--text-3); font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Market Indices</div>
              <div style="font-size:15px; color:var(--text); line-height:1.5;">Track market performance and trends daily.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- STATS -->"""
content = journey_old_pattern.sub(journey_new, content)

# 5. Calculator Header
calc_old_header = """    <div class="calc-header">
      <div class="section-eyebrow reveal">Wealth Intelligence</div>
      <h2 class="section-title reveal d1">See your money <em>multiply</em></h2>
      <p style="font-size:15.5px; line-height:1.75; color:var(--text-2); max-width:440px; margin:14px auto 0;" class="reveal d2">Simulate your SIP growth and discover the power of disciplined, long-term investing.</p>
    </div>"""
calc_new_header = """    <div class="calc-header">
      <div class="section-eyebrow reveal">Smart Financial Tools</div>
      <h2 class="section-title reveal d1">Calculators for your <em>Goals</em></h2>
      <p style="font-size:15.5px; line-height:1.75; color:var(--text-2); max-width:440px; margin:14px auto 0;" class="reveal d2">Plan better with easy-to-use calculators designed for your financial goals.</p>
    </div>"""
content = content.replace(calc_old_header, calc_new_header)

# 6. Trust/Closing section replacing Testimonials
complete_testi_contact_old_pattern = re.compile(r'<!-- TESTIMONIALS -->.*?<!-- TICKER -->', re.DOTALL)

trust_contact_new = """<!-- TRUST / CLOSING -->
<section id="trust" style="padding: 100px 0 60px;">
  <div class="max-w" style="text-align:center;">
    <div class="section-eyebrow reveal">Invest & Prosper Financial Services</div>
    <h2 class="section-title reveal d1">Plan Today for a <em>Better Tomorrow</em></h2>
    <p class="reveal d2" style="font-size:18px; line-height:1.75; color:var(--text-2); max-width:700px; margin:24px auto 40px;">
      A well-planned financial journey today ensures a secure and stress-free future. Start early, stay consistent, and achieve your goals with confidence.
    </p>
  </div>
</section>

<!-- CONTACT -->
<section id="contact" style="padding-top: 60px;">
  <div class="max-w">
    <div class="contact-layout" style="display:grid; grid-template-columns:1fr 1.4fr; gap:80px; align-items:start">
      <div>
        <div class="section-eyebrow reveal">Get in Touch</div>
        <h2 class="section-title reveal d1">Start Your <em>Journey</em></h2>
        <div style="margin-top:40px; display:flex; flex-direction:column; gap:18px">
          <div class="reveal d1" style="display:flex; align-items:center; gap:14px">
            <div style="width:42px; height:42px; border-radius:13px; background:rgba(26,143,115,0.1); display:flex; align-items:center; justify-content:center; font-size:16px">📞</div>
            <div><div style="font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-3)">Direct Line</div><div style="font-size:14px; font-weight:600; color:var(--green-deep)">0120-4160290</div></div>
          </div>
          <div class="reveal d2" style="display:flex; align-items:center; gap:14px">
            <div style="width:42px; height:42px; border-radius:13px; background:rgba(26,143,115,0.1); display:flex; align-items:center; justify-content:center; font-size:16px">✉️</div>
            <div><div style="font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-3)">Email</div><div style="font-size:14px; font-weight:600; color:var(--green-deep)">info@ipfs-mfd.co.in</div></div>
          </div>
          <div class="reveal d3" style="display:flex; align-items:center; gap:14px">
            <div style="width:42px; height:42px; border-radius:13px; background:rgba(26,143,115,0.1); display:flex; align-items:center; justify-content:center; font-size:16px">📍</div>
            <div><div style="font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-3)">Office</div><div style="font-size:14px; font-weight:600; color:var(--green-deep)">Wave One, Floor 31, Unit 01 (Gold Offices), Sector 18, Noida – 201301</div></div>
          </div>
        </div>
      </div>
      <div class="contact-form-wrap reveal d2" style="background:var(--bg); border:1px solid var(--border); border-radius:24px; padding:40px;">
        <h3 style="font-family:'DM Serif Display',serif; font-size:26px; margin-bottom:28px;">Connect with us</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px">
          <div><label style="display:block; font-size:10.5px; font-weight:700; text-transform:uppercase; color:var(--text-3); margin-bottom:7px">Name</label><input type="text" style="width:100%; padding:12px; border-radius:12px; border:1px solid var(--border)"></div>
          <div><label style="display:block; font-size:10.5px; font-weight:700; text-transform:uppercase; color:var(--text-3); margin-bottom:7px">Phone</label><input type="tel" style="width:100%; padding:12px; border-radius:12px; border:1px solid var(--border)"></div>
        </div>
        <div style="margin-bottom:16px"><label style="display:block; font-size:10.5px; font-weight:700; text-transform:uppercase; color:var(--text-3); margin-bottom:7px">Email</label><input type="email" style="width:100%; padding:12px; border-radius:12px; border:1px solid var(--border)"></div>
        <div style="margin-bottom:16px"><label style="display:block; font-size:10.5px; font-weight:700; text-transform:uppercase; color:var(--text-3); margin-bottom:7px">Message</label><textarea style="width:100%; padding:12px; border-radius:12px; border:1px solid var(--border); min-height:100px"></textarea></div>
        <button style="width:100%; background:var(--green-deep); color:#fff; border:none; padding:15px; border-radius:50px; font-weight:600; cursor:pointer;">Send Message →</button>
      </div>
    </div>
  </div>
</section>

<!-- TICKER -->"""
content = complete_testi_contact_old_pattern.sub(trust_contact_new, content)

# 7. FOOTER LINE
footer_old = """  <div class="footer-bottom">
    <div class="footer-copy">© 2006$12026 www.ipfs-mfd.co.in · All Rights Reserved</div>
  </div>"""
footer_new = """  <div class="footer-bottom">
    <div class="footer-copy">Investments in Mutual Funds are subject to market risks. Please read all scheme-related documents carefully before investing.</div>
    <div class="footer-copy" style="margin-top:10px;">© 2006$12026 www.ipfs-mfd.co.in · All Rights Reserved</div>
  </div>"""
content = content.replace(footer_old, footer_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
