// AI RECEPTIONIST - DENTAL CLINICS
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: 'tirha66@gmail.com', pass: 'kevf vilb qwdk vzrq' }
});

const DEMO_LINK = 'https://ai-receptionist-gilt-alpha.vercel.app/demo.html';

function createEmail(business) {
  const html = `<!DOCTYPE html>
<html>
<body style="font-family:Arial;max-width:600px;margin:0auto">
<div style="padding:20px">
<p>Hi there,</p>
<p>Quick question — do you ever miss patient calls when you're with another patient?</p>
<p>Most dental clinics miss 5-10 calls per day. Each missed call could be a new patient worth £500-2000.</p>
<p><strong>What we offer:</strong></p>
<ul>
<li>AI receptionist answers every call — 24/7</li>
<li>Books appointments automatically</li>
<li>Sends SMS reminders</li>
<li>Captures patient details</li>
<li>Handles cancellations & rescheduling</li>
</ul>
<p><strong>Pricing:</strong> $149-499/mo. No contracts.</p>
<p><a href="${DEMO_LINK}" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Book Free Demo</a></p>
<p>Cheers,<br>Abdelhak</p>
</div>
</body>
</html>`;
  return { subject: `Never miss another patient - AI Receptionist`, html };
}

const businesses = [
  { name: "St Johns Dental Practice", email: 'info@stjohnsdentalpractice.com', city: 'Birmingham' },
  { name: "Priory Dental Practice", email: 'info@priorydentalbirmingham.co.uk', city: 'Birmingham' },
  { name: "The Dental Centre", email: 'info@thedentalcentre.co.uk', city: 'Birmingham' },
  { name: "University Dental", email: 'info@universitydental.co.uk', city: 'Birmingham' },
  { name: "Hillbrook Dental", email: 'info@hillbrookdental.com', city: 'Birmingham' },
  { name: "Synergy Dental", email: 'info@synergydental.org.uk', city: 'Birmingham' },
];

async function send(b) {
  const { subject, html } = createEmail(b);
  try {
    await transporter.sendMail({ from: '"Abdelhak - AI Receptionist" <tirha66@gmail.com>', to: b.email, subject, html });
    console.log(`✅ ${b.name} - ${b.city}`);
    return true;
  } catch (e) { console.log(`❌ ${b.name}`); return false; }
}

async function run() {
  console.log('\n📧 AI RECEPTIONIST - DENTAL\n');
  let sent = 0;
  for (const b of businesses) {
    if (await send(b)) sent++;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`\n✅ DONE: ${sent}/${businesses.length}`);
}
run();
