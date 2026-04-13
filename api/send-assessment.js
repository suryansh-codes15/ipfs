import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        fullName, email, phone, age, city, occupation,
        annualIncome, dependents, existingInvestments,
        riskProfile, primaryGoal, investmentHorizon,
        monthlyInvestment, currentSavings,
        lifeInsurance, healthInsurance, willPrepared,
        additionalNotes
    } = req.body;

    if (!fullName || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    const adminEmail = 'pghavri@gmail.com';

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPass
        }
    });

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f6f9f2; margin: 0; padding: 0; color: #1a3a26; }
    .wrapper { max-width: 680px; margin: 30px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 40px rgba(47,90,62,0.1); }
    .header { background: linear-gradient(135deg, #2F5A3E, #1a3a26); padding: 36px 40px; text-align: center; }
    .header img { height: 48px; margin-bottom: 16px; }
    .header h1 { color: #E8C96A; font-size: 22px; margin: 0; letter-spacing: 1px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.7); font-size: 13px; margin: 8px 0 0; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 18px; font-weight: 700; color: #2F5A3E; margin-bottom: 8px; }
    .intro { font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 28px; }
    .section { margin-bottom: 28px; }
    .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #A0C969; border-bottom: 2px solid #e8f5e0; padding-bottom: 8px; margin-bottom: 16px; }
    .field { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .field:last-child { border-bottom: none; }
    .field-label { color: #888; font-weight: 600; }
    .field-value { color: #1a3a26; font-weight: 700; text-align: right; max-width: 60%; }
    .notes-box { background: #f6f9f2; border-left: 4px solid #A0C969; padding: 16px; border-radius: 0 8px 8px 0; font-size: 14px; color: #333; line-height: 1.7; }
    .footer { background: #f6f9f2; padding: 24px 40px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #e8f5e0; }
    .footer strong { color: #2F5A3E; }
    .badge { display: inline-block; background: #2F5A3E; color: #E8C96A; font-size: 11px; font-weight: 800; letter-spacing: 1px; padding: 4px 14px; border-radius: 50px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="badge">IPFS · INVEST & PROSPER</div>
      <h1>Financial Assessment Report</h1>
      <p>Confidential Client Profile · ARN-24216</p>
    </div>
    <div class="body">
      <div class="greeting">Dear ${fullName},</div>
      <p class="intro">Thank you for completing the IPFS Financial Assessment. Your responses have been securely recorded and our wealth management team will review your profile to craft a personalized financial strategy for you.</p>

      <div class="section">
        <div class="section-title">Personal Details</div>
        <div class="field"><span class="field-label">Full Name</span><span class="field-value">${fullName}</span></div>
        <div class="field"><span class="field-label">Email</span><span class="field-value">${email}</span></div>
        <div class="field"><span class="field-label">Phone</span><span class="field-value">${phone || '—'}</span></div>
        <div class="field"><span class="field-label">Age</span><span class="field-value">${age || '—'}</span></div>
        <div class="field"><span class="field-label">City</span><span class="field-value">${city || '—'}</span></div>
        <div class="field"><span class="field-label">Occupation</span><span class="field-value">${occupation || '—'}</span></div>
      </div>

      <div class="section">
        <div class="section-title">Financial Profile</div>
        <div class="field"><span class="field-label">Annual Income</span><span class="field-value">${annualIncome || '—'}</span></div>
        <div class="field"><span class="field-label">Monthly Investment Capacity</span><span class="field-value">${monthlyInvestment || '—'}</span></div>
        <div class="field"><span class="field-label">Current Savings / Assets</span><span class="field-value">${currentSavings || '—'}</span></div>
        <div class="field"><span class="field-label">Number of Dependents</span><span class="field-value">${dependents || '—'}</span></div>
        <div class="field"><span class="field-label">Existing Investments</span><span class="field-value">${existingInvestments || '—'}</span></div>
      </div>

      <div class="section">
        <div class="section-title">Risk & Goals</div>
        <div class="field"><span class="field-label">Risk Profile</span><span class="field-value">${riskProfile || '—'}</span></div>
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
