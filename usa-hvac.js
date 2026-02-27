// AI RECEPTIONIST - USA HVAC & ELECTRICIANS
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
<p>Quick question — do you ever miss calls when you're on jobs?</p>
<p>Most ${business.type.toLowerCase()} businesses miss 3-5 calls per day.</p>
<p><strong>What we offer:</strong></p>
<ul>
<li>AI receptionist answers every call — 24/7</li>
<li>Books appointments automatically</li>
<li>Sends SMS confirmations</li>
<li>Captures lead details</li>
<li>Forwards urgent calls immediately</li>
</ul>
<p><strong>Pricing:</strong> $149-499/mo. No contracts.</p>
<p><a href="${DEMO_LINK}" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Book Free Demo</a></p>
<p>Cheers,<br>Abdelhak</p>
</div>
</body>
</html>`;
  return { subject: `Never miss another call - AI Receptionist`, html };
}

const businesses = [
  { name: "Brody Pennell HVAC", email: 'info@brodypennell.com', city: 'Los Angeles', type: 'HVAC' },
  { name: "Inland Mechanical", email: 'info@inlandmechanicalservices.com', city: 'Los Angeles', type: 'HVAC' },
  { name: "California AC", email: 'info@californiaac.com', city: 'Los Angeles', type: 'HVAC' },
  { name: "MightyServ HVAC", email: 'info@mightyservhvac.com', city: 'Los Angeles', type: 'HVAC' },
  { name: "Panther AC Miami", email: 'info@panthermiami.com', city: 'Miami', type: 'HVAC' },
  { name: "Advance Cool Air", email: 'myac@advancecoolair.com', city: 'Miami', type: 'HVAC' },
  { name: "HTS Austin", email: 'info@hts.com', city: 'Austin', type: 'HVAC' },
  { name: "Fox Service Company", email: 'info@foxservice.com', city: 'Austin', type: 'HVAC' },
  { name: "Friends HVAC", email: 'info@friends-hvac.com', city: 'Austin', type: 'HVAC' },
  { name: "Denver's Best HVAC", email: 'info@denversbestheatingandacrepair.com', city: 'Denver', type: 'HVAC' },
  { name: "Mountain Breeze", email: 'info@mountainbreezeheatingandair.com', city: 'Denver', type: 'HVAC' },
  { name: "Rabbit Heating", email: 'info@rabbitheating.com', city: 'Denver', type: 'HVAC' },
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
  console.log('\n📧 AI RECEPTIONIST - USA HVAC\n');
  let sent = 0;
  for (const b of businesses) {
    if (await send(b)) sent++;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`\n✅ DONE: ${sent}/${businesses.length}`);
}
run();
