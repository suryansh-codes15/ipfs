import os
import re

footer_content = """  <footer style="padding: 40px 0 20px;">
    <div class="max-w" style="text-align: center;">
      <img src="assets/logo.png" alt="IPFS Logo" style="height:45px; margin-bottom:15px;">
      <p style="font-size:14px; line-height:1.6; color:var(--text-3); max-width:800px; margin: 0 auto 5px;">
        Invest & Prosper Financial Services (IPFS) is helping elite Indian families build wealth since 2006.
      </p>
      <p style="font-size:11.5px; font-weight:600; color:var(--text-3); margin-bottom:25px; opacity:0.85;">
        AMFI Registered Mutual Fund Distributor | ARN-24216 | Date of initial Registration: 18.09.2006 | Current validity: 17.09.2027
      </p>
      
      <div class="footer-legal-integrated" style="text-align:left; font-size:11px; line-height:1.6; color:var(--text-4); max-width:1160px; margin: 0 auto;">
        <p style="margin-bottom:8px;"><strong>Risk Factors</strong> – Investments in Mutual Funds are subject to Market Risks. Read all scheme related documents carefully before investing. Mutual Fund Schemes do not assure or guarantee any returns. Past performances of any Mutual Fund Scheme may or may not be sustained in future. There is no guarantee that the investment objective of any suggested scheme shall be achieved. All existing and prospective investors are advised to check and evaluate the Exit loads and other cost structure (TER) applicable at the time of making the investment before finalizing on any investment decision for Mutual Funds schemes.</p>
        <p style="margin-bottom:20px;">We deal in Regular Plans only for Mutual Fund Schemes and earn a Trailing Commission on client investments. Disclosure For Commission earnings is made to clients at the time of investments. Option of Direct Plan for every Mutual Fund Scheme is available to investors offering advantage of lower expense ratio. We are not entitled to earn any commission on Direct plans. Hence we do not deal in Direct Plans.</p>
      </div>

      <div class="footer-legal-links" style="display:flex; justify-content:center; gap:28px; margin-bottom:20px; padding-top:20px; border-top:1px solid rgba(0,0,0,0.06);">
        <a href="disclaimer.html" style="font-size:13px; color:var(--text-2); text-decoration:none; font-weight:600; transition: color 0.2s;">Disclaimer</a>
        <a href="privacy-policy.html" style="font-size:13px; color:var(--text-2); text-decoration:none; font-weight:600; transition: color 0.2s;">Privacy Policy</a>
        <a href="disclosure.html" style="font-size:13px; color:var(--text-2); text-decoration:none; font-weight:600; transition: color 0.2s;">Disclosure</a>
      </div>
      
      <div style="padding-top:10px; font-size:10.5px; color:var(--text-4); opacity: 0.7;">
        © 2006–2026 www.ipfs-mfd.co.in · All Rights Reserved
      </div>
    </div>
  </footer>"""

files = [
    'index.html', 'about.html', 'blogs.html', 'why-us.html', 'services.html', 'calculator.html',
    'privacy-policy.html', 'disclaimer.html', 'disclosure.html'
]

for filename in files:
    if not os.path.exists(filename):
        print(f"Skipping {filename}")
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Clean up existing footer and any legal bar that followed it
    # We replace from the start of <footer ...> until either the end of </footer> OR the end of the legal bar
    # Using regex to find <footer.*?>.*?</footer> AND any optional following div.footer-legal-bar
    pattern = re.compile(r'<footer.*?>.*?</footer>(\s*<div class="footer-legal-bar">.*?</div>)?', re.DOTALL)
    
    if pattern.search(content):
        new_content = pattern.sub(footer_content, content)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
    else:
        print(f"Could not find standard footer pattern in {filename}")
