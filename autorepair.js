// AI RECEPTIONIST - AUTO REPAIR
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
<p>Quick question — do you ever miss calls from customers needing repairs?</p>
<p>Most auto repair shops miss 5-10 calls per day. Each missed call could be a $500-2000 job.</p>
<p><strong>What we offer:</strong></p>
<ul>
<li>AI receptionist answers every call — 24/7</li>
<li>Books service appointments</li>
<li>Sends SMS reminders</li>
<li>Captures vehicle & issue details</li>
<li>Handles cancellation inquiries</li>
</ul>
<p><strong>Pricing:</strong> $149-499/mo. No contracts.</p>
<p><a href="${DEMO_LINK}" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Book Free Demo</a></p>
<p>Cheers,<br>Abdelhak</p>
</div>
</body>
</html>`;
  return { subject: `Never miss another customer - AI Receptionist`, html };
}

const businesses = [
  { name: "Parkview Auto Repair", email: 'info@parkviewautochicago.com', city: 'Chicago' },
  { name: "Eliot's Complete Auto Repair", email: 'info@eliotscompleteautorepair.com', city: 'Chicago' },
  { name: "Aztek Automotive", email: 'info@aztekautomotive.com', city: 'Chicago' },
  { name: "AutoFix Garage", email: 'info@autofixla.com', city: 'Los Angeles' },
  { name: "LA Auto Repair", email: 'info@laautorepair.com', city: 'Los Angeles' },
  { name: "NYC Auto Repair", email: 'info@nycautorepair.com', city: 'New York' },
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
  console.log('\n📧 AI RECEPTIONIST - AUTO REPAIR\n');
  let sent = 0;
  for (const b of businesses) {
    if (await send(b)) sent++;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`\n✅ DONE: ${sent}/${businesses.length}`);
}
run();
