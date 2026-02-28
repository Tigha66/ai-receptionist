// AI RECEPTIONIST - GYMS
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
<p>Quick question — do you ever miss calls from potential members?</p>
<p>Most gyms miss 10+ calls per week from people wanting to join. Each missed call could be a £40-100/month membership.</p>
<p><strong>What we offer:</strong></p>
<ul>
<li>AI receptionist answers every call — 24/7</li>
<li>Answers membership questions</li>
<li>Books trial sessions</li>
<li>Sends follow-up info</li>
</ul>
<p><strong>Pricing:</strong> $149-499/mo. No contracts.</p>
<p><a href="${DEMO_LINK}" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Book Free Demo</a></p>
<p>Cheers,<br>Abdelhak</p>
</div>
</body>
</html>`;
  return { subject: `Never miss another member - AI Receptionist`, html };
}

const businesses = [
  { name: "Lifestyle Fitness", email: 'enquiries@lifestylefitness.co.uk', city: 'Manchester' },
  { name: "Anytime Fitness Manchester", email: 'info@anytimefitness.co.uk', city: 'Manchester' },
  { name: "The Gym Group", email: 'info@tggplc.com', city: 'London' },
  { name: "Nuffield Health Manchester", email: 'info@nuffieldhealth.com', city: 'Manchester' },
  { name: "Absolute Body Solutions", email: 'info@absolutebodysolutions.com', city: 'Manchester' },
  { name: "King Street Gym", email: 'info@kingstreetgym.co.uk', city: 'Manchester' },
  { name: "PureGym Manchester", email: 'info@puregym.com', city: 'Manchester' },
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
  console.log('\n📧 AI RECEPTIONIST - GYMS\n');
  let sent = 0;
  for (const b of businesses) {
    if (await send(b)) sent++;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`\n✅ DONE: ${sent}/${businesses.length}`);
}
run();
