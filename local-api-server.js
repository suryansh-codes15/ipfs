import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/send-assessment', async (req, res) => {
  console.log('Received detailed assessment:', req.body.fullName);
  const data = req.body;
  const { fullName, email } = data;

  if (!fullName || !email) return res.status(400).json({ error: 'Name/Email required' });

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
        rows += `<tr><td style="padding:10px; border-bottom:1px solid #eee; width:180px; font-weight:700; color:#333;">${label}</td><td style="padding:10px; border-bottom:1px solid #eee; color:#1a3a26;">${value}</td></tr>`;
      }
    }
    if (!rows) return '';
    return `<div style="margin-bottom:30px;"><h3 style="color:#2F5A3E; border-bottom:2.5px solid #E8C96A; padding-bottom:6px; font-size:14px; text-transform:uppercase; letter-spacing:1.5px;">${title}</h3><table style="width:100%; border-collapse:collapse; font-size:13.5px;">${rows}</table></div>`;
  };

  const htmlBody = `
    <div style="font-family:'Segoe UI',Arial,sans-serif; background:#f0f4ec; padding:40px;">
        <div style="max-width:720px; margin:0 auto; background:#fff; border-radius:14px; overflow:hidden; box-shadow:0 12px 45px rgba(47,90,62,0.1);">
            <div style="background:#2F5A3E; color:#E8C96A; padding:35px; text-align:center;">
                <h1 style="margin:0; font-size:26px; text-transform:uppercase; letter-spacing:2px;">Institutional Assessment</h1>
                <p style="margin:6px 0 0; opacity:0.8; font-size:13px; font-weight:600;">[LOCAL TEST] Client Submission Report · IPFS</p>
            </div>
            <div style="padding:45px;">
                ${createSection('Client Identity', { 'Full Name': data.fullName, 'Email': data.email, 'Contact': data.mobile, 'Location': `${data.city || ''}, ${data.state || ''}` })}
                ${createSection('Family Matrix', { 'Self': `${data.fam_self_name} (${data.fam_self_age}y) - PAN: ${data.fam_self_pan}`, 'Spouse': `${data.fam_spouse_name} (${data.fam_spouse_age}y) - PAN: ${data.fam_spouse_pan}`, 'Anniversary': data.anniversary })}
                ${createSection('Retirement: Self', { 'Year': data.ret_self_year, 'Tenure': `${data.ret_self_tenure} Years`, 'Requirement (PM)': data.ret_self_pm, 'Corpus': data.ret_self_corpus })}
                ${createSection('Investments', { 'Latest 1': `${data.inv1_nat} - ${data.inv1_amt}`, 'Latest 2': `${data.inv2_nat} - ${data.inv2_amt}` })}
            </div>
            <div style="background:#f6f9f2; padding:25px; text-align:center; color:#777; font-size:12px; border-top:1px solid #e0eacc;">
                IPFS Institutional Telemetry Engine · Local Dev Mode
            </div>
        </div>
    </div>`;

  try {
    await transporter.sendMail({ from: `"IPFS Local Copy" <${gmailUser}>`, to: email, subject: `[COPY] Institutional Assessment - ${fullName}`, html: htmlBody });
    await transporter.sendMail({ from: `"IPFS Local Vault" <${gmailUser}>`, to: adminEmail, subject: `[NEW] Institutional Form - ${fullName}`, html: htmlBody });
    res.status(200).json({ success: true, message: 'Institutional Emails Sent (Local)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'SMTP Error', detail: err.message });
  }
});


app.listen(port, () => {
  console.log(`🚀 Assessment API running at http://localhost:${port}`);
});
