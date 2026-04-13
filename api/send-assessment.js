import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = req.body;
  const { fullName, email } = data;

  if (!fullName || !email) {
    return res.status(400).json({ error: 'Required identity fields missing' });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const adminEmail = 'pghavri@gmail.com';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass }
  });

  const createSection = (title, fields) => {
    let rows = '';
    for (const [label, value] of Object.entries(fields)) {
      if (value) {
        rows += `<tr><td style="padding:8px; border-bottom:1px solid #eee; width:180px; font-weight:600; color:#444;">${label}</td><td style="padding:8px; border-bottom:1px solid #eee; color:#1a3a26;">${value}</td></tr>`;
      }
    }
    if (!rows) return '';
    return `
        <div style="margin-bottom:30px;">
            <h3 style="color:#2F5A3E; border-bottom:2px solid #E8C96A; padding-bottom:5px; font-size:14px; text-transform:uppercase; letter-spacing:1px;">${title}</h3>
            <table style="width:100%; border-collapse:collapse; font-size:13px;">${rows}</table>
        </div>`;
  };

  const htmlBody = `
        <div class="field"><span class="field-label">Primary Goal</span><span class="field-value">${primaryGoal || '—'}</span></div>
        <div class="field"><span class="field-label">Investment Horizon</span><span class="field-value">${investmentHorizon || '—'}</span></div>
      </div>

      <div class="section">
        <div class="section-title">Protection & Planning</div>
        <div class="field"><span class="field-label">Life Insurance</span><span class="field-value">${lifeInsurance || '—'}</span></div>
        <div class="field"><span class="field-label">Health Insurance</span><span class="field-value">${healthInsurance || '—'}</span></div>
        <div class="field"><span class="field-label">Will Prepared</span><span class="field-value">${willPrepared || '—'}</span></div>
      </div>

      ${additionalNotes ? `
      <div class="section">
        <div class="section-title">Additional Notes</div>
        <div class="notes-box">${additionalNotes}</div>
      </div>` : ''}
    </div>
    <div class="footer">
      <strong>IPFS — Invest & Prosper Financial Services</strong><br>
      AMFI Registered Mutual Fund Distributor · ARN-24216<br>
      pghavri@gmail.com · Est. 2000
    </div>
  </div>
</body>
</html>`;

  try {
    // Email to the client
    await transporter.sendMail({
      from: `"IPFS Invest & Prosper" <${gmailUser}>`,
      to: email,
      subject: `Your IPFS Financial Assessment – ${fullName}`,
      html: htmlBody
    });

    // Email to admin
    await transporter.sendMail({
      from: `"IPFS Assessment Bot" <${gmailUser}>`,
      to: adminEmail,
      subject: `New Assessment Submission – ${fullName} (${email})`,
      html: htmlBody
    });

    return res.status(200).json({ success: true, message: 'Assessment submitted successfully.' });
  } catch (err) {
    console.error('SMTP Error:', err);
    return res.status(500).json({ error: 'Email sending failed. Please try again.', detail: err.message });
  }
}
