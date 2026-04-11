import re

html_path = r'd:\ipfs final\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. HERO SECTION
html = re.sub(
    r'<h1 class="hero-headline">.*?</h1>',
    '<h1 class="hero-headline">\n    Engineered for Growth.<br>\n    <em>Built for</em> <span class="gold-word">Generations.</span>\n  </h1>',
    html, flags=re.DOTALL
)
html = re.sub(
    r'<p class="hero-sub">.*?</p>',
    '<p class="hero-sub">\n    Access curated mutual funds, strategy-driven portfolios, and real-time tracking—all within a unified, high-fidelity digital platform.\n  </p>',
    html, flags=re.DOTALL
)
html = re.sub(
    r'<div class="trust-item"><span class="trust-check">✓</span>27\+ Years Mastery</div>',
    '<div class="trust-item"><span class="trust-check">✓</span>26+ Years Experience</div>',
    html, flags=re.DOTALL
)
html = re.sub(
    r'<div class="trust-item"><span class="trust-check">✓</span>₹500Cr\+ AUM</div>',
    '<div class="trust-item"><span class="trust-check">✓</span>₹500Cr+ Assets Managed</div>',
    html, flags=re.DOTALL
)
html = html.replace('1200+ Elite Families', '1,200+ Elite Families')

# 2. WHY INVESTORS TRUST US
html = re.sub(
    r'<h2 class="section-title reveal d1">Why Investors <em>Trust Us</em></h2>',
    '<h2 class="section-title reveal d1">The Architecture of <em>Trust</em></h2>',
    html, flags=re.DOTALL
)
html = re.sub(
    r'<p style="color:var\(--text-2\); font-size:15px; line-height:1\.75; margin-top:12px;">.*?</p>',
    '<p style="color:var(--text-2); font-size:15px; line-height:1.75; margin-top:12px;">We execute with precision. Our platform replaces guesswork with structured data, algorithmic tracking, and goal-oriented continuity.</p>',
    html, flags=re.DOTALL
)
# Cards for Why Trust Us
html = re.sub(
    r'<div class="diff-title">Goal-Based Investment Approach</div>.*?<div class="diff-desc">We align your investments with your life goals — not just returns\.</div>',
    '<div class="diff-title">Strategic Capital Allocation</div>\n        <div class="diff-desc">Portfolios mathematically aligned to your timeline, risk threshold, and ultimate financial objectives.</div>',
    html, flags=re.DOTALL
)
html = re.sub(
    r'<div class="diff-title">Smart & Disciplined Investing</div>.*?<div class="diff-desc">Structured investment strategies built for long-term wealth creation\.</div>',
    '<div class="diff-title">Structured Execution</div>\n        <div class="diff-desc">Eliminate market noise with systematic, non-emotional investment strategies built for long-term consistency.</div>',
    html, flags=re.DOTALL
)
html = re.sub(
    r'<div class="diff-title">Real-Time Portfolio Access</div>.*?<div class="diff-desc">Track your investments anytime with complete transparency\.</div>',
    '<div class="diff-title">Absolute Transparency</div>\n        <div class="diff-desc">A complete, unified view of your net worth, fund performance, and portfolio trajectory at your fingertips.</div>',
    html, flags=re.DOTALL
)
html = re.sub(
    r'<div class="diff-title">Continuous Monitoring</div>.*?<div class="diff-desc">Regular tracking to keep your investments aligned with your goals\.</div>',
    '<div class="diff-title">Dynamic Portfolio Tracking</div>\n        <div class="diff-desc">Oversight-driven monitoring ensuring your capital remains strictly aligned with original growth targets.</div>',
    html, flags=re.DOTALL
)

# 3. SERVICES / SOLUTIONS
html = re.sub(r'>Services &amp; Features<', '>Platform Capabilities<', html)
html = re.sub(r'>Services & Features<', '>Platform Capabilities<', html)
html = re.sub(
    r'<h2 class="section-title reveal d1">Complete Investment<br><em>Solutions</em></h2>',
    '<h2 class="section-title reveal d1">Platform<br><em>Capabilities</em></h2>',
    html, flags=re.DOTALL
)
html = re.sub(
    r'Empowering your financial journey with dynamic tools, diverse funds, and goal-oriented planning built into a seamless platform\.',
    'A complete ecosystem for wealth creation. Execute, track, and scale your investments with institutional efficiency.',
    html
)
html = re.sub(r'<div class="sol-card-title">Mutual Fund Investments</div>.*?<div class="sol-card-desc">Access top-performing funds across categories to build a diversified portfolio\.</div>', '<div class="sol-card-title">Curated Mutual Funds</div>\n            <div class="sol-card-desc">Direct access to top-percentile funds across equity, debt, and hybrid classes, rigorously vetted for structural integrity.</div>', html, flags=re.DOTALL)
html = re.sub(r'<div class="sol-card-title">SIP Investments</div>.*?<div class="sol-card-desc">Create wealth consistently through disciplined monthly investments\.</div>', '<div class="sol-card-title">Systematic Wealth Engines</div>\n            <div class="sol-card-desc">Automate your wealth creation with disciplined structures, leveraging compounding and cost-averaging mechanics.</div>', html, flags=re.DOTALL)
html = re.sub(r'<div class="sol-card-title">Goal Planning</div>.*?<div class="sol-card-desc">Plan for life goals like retirement, education, or wealth creation with clarity\.</div>', '<div class="sol-card-title">Lifecycle Financial Engineering</div>\n            <div class="sol-card-desc">Mathematical frameworks designed to fund milestone objectives—from generational wealth to strategic acquisitions.</div>', html, flags=re.DOTALL)
html = re.sub(r'<div class="sol-card-title">Portfolio Tracking</div>.*?<div class="sol-card-desc">Monitor all your investments in one place with detailed insights\.</div>', '<div class="sol-card-title">Unified Wealth Dashboard</div>\n            <div class="sol-card-desc">Consolidated tracking of all assets, delivering instant analytical insights and performance telemetry.</div>', html, flags=re.DOTALL)

# 4. HOW IT WORKS
html = re.sub(r'>How It Works<', '>The Investment Framework<', html)
html = re.sub(r'>Your Investment Journey <em>Simplified</em><', '>The Investment <em>Framework</em><', html)
html = re.sub(r'<div class="journey-title">Define Your Goals</div>.*?<div class="journey-desc">Set clear financial goals — from short-term needs to long-term wealth creation\.</div>', '<div class="journey-title">Define Objectives</div>\n        <div class="journey-desc">Establish clear timelines and liquidity requirements for strategic capital deployment.</div>', html, flags=re.DOTALL)
html = re.sub(r'<div class="journey-title">Build Your Strategy</div>.*?<div class="journey-desc">Choose the right investment mix based on your time horizon and comfort level\.</div>', '<div class="journey-title">Construct the Framework</div>\n        <div class="journey-desc">Design a resilient asset allocation model precisely weighted for risk-adjusted returns.</div>', html, flags=re.DOTALL)
html = re.sub(r'<div class="journey-title">Invest Smartly</div>.*?<div class="journey-desc">Start investing seamlessly with a structured and disciplined approach\.</div>', '<div class="journey-title">Execute Strategy</div>\n        <div class="journey-desc">Deploy capital systematically and seamlessly through our streamlined digital architecture.</div>', html, flags=re.DOTALL)
html = re.sub(r'<div class="journey-title">Track &amp; Grow</div>.*?<div class="journey-desc">Monitor progress and stay on track to achieve your financial goals\.</div>', '<div class="journey-title">Monitor &amp; Scale</div>\n        <div class="journey-desc">Track performance telemetry and compound growth through continuous, disciplined oversight.</div>', html, flags=re.DOTALL)
html = re.sub(r'<div class="journey-title">Track & Grow</div>.*?<div class="journey-desc">Monitor progress and stay on track to achieve your financial goals\.</div>', '<div class="journey-title">Monitor & Scale</div>\n        <div class="journey-desc">Track performance telemetry and compound growth through continuous, disciplined oversight.</div>', html, flags=re.DOTALL)

# 5. SIP / POWER SECTION
html = re.sub(r'>The Power Set<', '>The Mechanics of Compounding<', html)
html = re.sub(r'>Start Small\. <em>Grow Big\.</em><', '>The Mechanics of <em>Compounding</em><', html)
html = re.sub(r'Consistent investing through SIP helps you benefit from compounding and market averaging — turning small investments into long-term wealth\.', 'Time is the ultimate multiplier. Systematic Investment Plans (SIPs) transform incremental contributions into compounding wealth structures, systematically neutralizing market volatility through intelligent cost-averaging.', html)

# 6. FINANCIAL GOALS SECTION
html = re.sub(r'>Financial Goals<', '>Strategic Wealth Objectives<', html)
html = re.sub(r'>Plan for What <em>Matters Most</em><', '>Strategic Wealth <em>Objectives</em><', html)
html = re.sub(r'<div class="diff-title">Child Education</div>.*?<div class="diff-desc">Secure your child’s future with structured investments\.</div>', '<div class="diff-title">Next-Generation Funding</div>\n        <div class="diff-desc">Secure uninterrupted access to global education with inflation-adjusted capital reserves.</div>', html, flags=re.DOTALL)
html = re.sub(r'<div class="diff-title">Retirement Planning</div>.*?<div class="diff-desc">Build a strong financial foundation for a stress-free retirement\.</div>', '<div class="diff-title">Financial Independence</div>\n        <div class="diff-desc">Engineered portfolios designed to entirely replace active income and sustain your lifestyle indefinitely.</div>', html, flags=re.DOTALL)
html = re.sub(r'<div class="diff-title">Wealth Creation</div>.*?<div class="diff-desc">Grow your money steadily over time with smart investments\.</div>', '<div class="diff-title">Capital Accumulation</div>\n        <div class="diff-desc">Aggressive, structured growth strategies optimized for maximum compounding over extended horizons.</div>', html, flags=re.DOTALL)
html = re.sub(r'<div class="diff-title">Tax Saving</div>.*?<div class="diff-desc">Optimize your investments while reducing tax liability\.</div>', '<div class="diff-title">Tax-Optimized Growth</div>\n        <div class="diff-desc">Intelligent deployment into ELSS and tax-efficient structures to maximize your retained alpha.</div>', html, flags=re.DOTALL)

# 7. PLATFORM / MARKET SECTION
html = re.sub(r'>Premium Platform<', '>Command Your Portfolio<', html)
html = re.sub(r'>Everything You Need,<br><em>In One Place</em><', '>Command Your<br><em>Portfolio</em><', html)
html = re.sub(r'Explore top-performing funds, invest in new opportunities, track market updates, and access powerful financial tools — all from a single platform\.', 'An institutional-grade digital interface designed for absolute control. Access top-tier funds, execute strategic adjustments, and monitor global market indices—all integrated into a single, high-performance ecosystem.', html)

# 8. TRUST / STATS SECTION remains mostly unchanged, but we can change labels slightly if requested, but plan said stats remain same. Let's make sure it matches.
html = re.sub(r'<div class="stat-label">Families Served</div>', '<div class="stat-label">Elite Families</div>', html)

# 9. CALCULATOR SECTION
html = re.sub(r'>Smart Financial Tools<', '>Financial Telemetry<', html)
html = re.sub(r'>Calculators for your <em>Goals</em><', '>Financial Telemetry &amp; <em>Projections</em><', html)
html = re.sub(r'>Calculators for your <em>Goals</em><', '>Financial Telemetry & <em>Projections</em><', html)
html = re.sub(r'Plan better with easy-to-use calculators designed for your financial goals\.', 'Quantify your future. Use our analytical models to forecast compounding trajectories and capital requirements.', html)

# 10. FINAL CTA SECTION (TRUST / CLOSING)
html = re.sub(r'>Invest &amp; Prosper Financial Services<', '>Initiate Your Wealth Strategy<', html)
html = re.sub(r'>Invest & Prosper Financial Services<', '>Initiate Your Wealth Strategy<', html)
html = re.sub(r'>Plan Today for a <em>Better Tomorrow</em><', '>Initiate Your <em>Wealth Strategy</em><', html)
html = re.sub(r'A well-planned financial journey today ensures a secure and stress-free future\. Start early, stay consistent, and achieve your goals with confidence\.', 'Transition to a platform engineered for disciplined growth, institutional logic, and intergenerational wealth. Stop navigating the markets alone.', html)

# 11. FOOTER TEXT
html = re.sub(
    r'Investments in Mutual Funds are subject to market risks\. Please read all scheme-related documents carefully before investing\.',
    'Investments in Mutual Funds are subject to market risks. Please read all scheme-related documents carefully before investing. IPFS is an AMFI-Registered Mutual Fund Distributor (ARN-24216).',
    html
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
