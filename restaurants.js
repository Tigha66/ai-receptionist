// AI RECEPTIONIST - RESTAURANTS
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
<p>Quick question — do you ever miss booking calls when the restaurant is busy?</p>
<p>Most restaurants miss 10+ calls per day from people wanting to book tables. Each missed booking could be £50-200 in revenue.</p>
<p><strong>What we offer:</strong></p>
<ul>
<li>AI receptionist answers every call — 24/7</li>
<li>Books tables automatically</li>
<li>Handles takeout orders</li>
<li>Answers menu questions</li>
</ul>
<p><strong>Pricing:</strong> $149-499/mo. No contracts.</p>
<p><a href="${DEMO_LINK}" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Book Free Demo</a></p>
<p>Cheers,<br>Abdelhak</p>
</div>
</body>
</html>`;
  return { subject: `Never miss another booking - AI Receptionist`, html };
}

const businesses = [
  { name: "The Warehouse Cafe", email: 'cafe@wearebrig.co.uk', city: 'Birmingham' },
  { name: "Chai & Crumbs", email: 'info@chaiandcrumbs.co.uk', city: 'Birmingham' },
  { name: "Cherry Reds", email: 'people@cherryreds.com', city: 'Birmingham' },
  { name: "Boston Tea Party", email: 'info@bostonteaparty.co.uk', city: 'Birmingham' },
  { name: "Rising Cafe", email: 'info@risingcafe.co.uk', city: 'Birmingham' },
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
  console.log('\n📧 AI RECEPTIONIST - RESTAURANTS\n');
  let sent = 0;
  for (const b of businesses) {
    if (await send(b)) sent++;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`\n✅ DONE: ${sent}/${businesses.length}`);
}
run();
