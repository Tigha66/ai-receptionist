// AI RECEPTIONIST - REAL ESTATE
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
<p>Quick question — do you ever miss calls from potential buyers or tenants?</p>
<p>Most estate agents miss 10+ calls per day. Each missed call could be a property worth £500k+.</p>
<p><strong>What we offer:</strong></p>
<ul>
<li>AI receptionist answers every call — 24/7</li>
<li>Qualifies leads automatically</li>
<li>Books property viewings</li>
<li>Captures buyer/tenant details</li>
<li>Handles property inquiries</li>
</ul>
<p><strong>Pricing:</strong> $149-499/mo. No contracts.</p>
<p><a href="${DEMO_LINK}" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Book Free Demo</a></p>
<p>Cheers,<br>Abdelhak</p>
</div>
</body>
</html>`;
  return { subject: `Never miss another lead - AI Receptionist`, html };
}

const businesses = [
  { name: "The Manchester Estate Agent", email: 'info@themanchesteragent.co.uk', city: 'Manchester' },
  { name: "Normie & Co", email: 'sales@normie.co.uk', city: 'Manchester' },
  { name: "Savills Manchester", email: 'manchester@savills.com', city: 'Manchester' },
  { name: "Bridgfords Manchester", email: 'manchester@bridgfords.co.uk', city: 'Manchester' },
  { name: "Knight Frank", email: 'info@knightfrank.co.uk', city: 'London' },
  { name: "Bridgfords London", email: 'london@bridgfords.co.uk', city: 'London' },
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
  console.log('\n📧 AI RECEPTIONIST - REAL ESTATE\n');
  let sent = 0;
  for (const b of businesses) {
    if (await send(b)) sent++;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`\n✅ DONE: ${sent}/${businesses.length}`);
}
run();
