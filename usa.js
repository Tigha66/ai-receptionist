// AI RECEPTIONIST OUTREACH - USA PLUMBERS
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
<p>Most plumbing businesses miss 3-5 calls per day. Each missed call could be a $300-500 job.</p>
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

// REAL USA PLUMBERS
const businesses = [
  { name: "Power Plumbing Chicago", email: 'power@powerplumbinginc.com', city: 'Chicago' },
  { name: "Burris & Sons Plumbing", email: 'greatburris@sbcglobal.net', city: 'Chicago' },
  { name: "Sound Plumbing", email: 'soundplumbing@gmail.com', city: 'Chicago' },
  { name: "Superior Plumbing", email: 'customerservice@superiorplumbing.com', city: 'Atlanta' },
  { name: "Plumb Works Inc", email: 'info@plumbworksinc.com', city: 'Atlanta' },
  { name: "The Original Plumber", email: 'office@theoriginalplumber.com', city: 'Atlanta' },
  { name: "Baker Brothers Plumbing", email: 'info@bakerbrothersplumbing.com', city: 'Dallas' },
  { name: "Tribeca Plumbing", email: 'info@tribecaplumbinginc.com', city: 'Dallas' },
  { name: "Legacy Plumbing", email: 'info@legacyplumbing.net', city: 'Dallas' },
  { name: "Abacus Plumbing", email: 'info@abacusplumbing.net', city: 'Houston' },
  { name: "1-Tom-Plumber Houston", email: 'houston@1tomplumber.com', city: 'Houston' },
  { name: "Texas Quality Plumbing", email: 'info@texasqualityplumbing.com', city: 'Houston' },
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
  console.log('\n📧 AI RECEPTIONIST - USA PLUMBERS\n');
  let sent = 0;
  for (const b of businesses) {
    if (await send(b)) sent++;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`\n✅ DONE: ${sent}/${businesses.length}`);
}
run();
