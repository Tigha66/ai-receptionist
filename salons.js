// AI RECEPTIONIST - SALONS & SPAS
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
<p>Quick question — do you ever miss calls when you're booked with clients?</p>
<p>Most salons miss 3-5 calls per day. Each missed call could be a $50-150 booking.</p>
<p><strong>What we offer:</strong></p>
<ul>
<li>AI receptionist answers every call — 24/7</li>
<li>Books appointments automatically</li>
<li>Sends SMS confirmations</li>
<li>Captures client details</li>
<li>Handles cancellations & rescheduling</li>
</ul>
<p><strong>Pricing:</strong> $149-499/mo. No contracts. 14-day trial.</p>
<p><a href="${DEMO_LINK}" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Book Free Demo</a></p>
<p>Cheers,<br>Abdelhak</p>
</div>
</body>
</html>`;
  return { subject: `Never miss another booking - AI Receptionist`, html };
}

const businesses = [
  { name: "Elegance Hair Salon", email: 'info@elegancehair.co.uk', city: 'Bradford' },
  { name: "Elise Luxury Hair", email: 'info@eliseluxuryhair.co.uk', city: 'Bradford' },
  { name: "Faye Louise Hair", email: 'info@fayelouisehair.co.uk', city: 'Bradford' },
  { name: "Millionhairs", email: 'info@millionhairs.co.uk', city: 'Bradford' },
  { name: "Cafe Italia", email: 'info@cafeitalia.co.uk', city: 'London' },
  { name: "Ciao Napoli", email: 'info@ciaonapoli.co.uk', city: 'Bolton' },
  { name: "Amico Cafe", email: 'info@amicocafe.co.uk', city: 'Bolton' },
  { name: "Stars Cafe", email: 'info@starscafe.co.uk', city: 'Manchester' },
  { name: "Local Foods", email: 'info@localfoods.co.uk', city: 'London' },
  { name: "Hestia", email: 'info@hestia.co.uk', city: 'London' },
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
  console.log('\n📧 AI RECEPTIONIST - SALONS & SPAS\n');
  let sent = 0;
  for (const b of businesses) {
    if (await send(b)) sent++;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`\n✅ DONE: ${sent}/${businesses.length}`);
}
run();
