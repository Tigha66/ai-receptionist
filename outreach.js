// AI RECEPTIONIST OUTREACH - PLUMBERS
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

<p>Here's the thing: most ${business.type.toLowerCase()} businesses miss 3-5 calls per day. Each missed call could be a $300-500 job.</p>

<p><strong>What we offer:</strong></p>
<ul>
<li>AI receptionist answers every call — 24/7</li>
<li>Books appointments automatically</li>
<li>Sends SMS confirmations to customers</li>
<li>Captures lead details (name, address, service needed)</li>
<li>Forwards urgent calls to you immediately</li>
</ul>

<p><strong>Pricing:</strong></p>
<ul>
<li>Starter: $149/mo (up to 100 calls)</li>
<li>Growth: $299/mo (up to 400 calls) — <strong>Most Popular</strong></li>
<li>Pro: $499/mo (up to 1,000 calls)</li>
</ul>

<p>No contracts. 14-day trial available.</p>

<p><a href="${DEMO_LINK}" style="background:#f97316;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Book a Free 10-Minute Demo</a></p>

<p>Cheers,<br>Abdelhak</p>
</div>
</body>
</html>`;
  return { subject: `Never miss another call - AI Receptionist for ${business.type}`, html };
}

// REAL UK PLUMBERS - VERIFIED
const businesses = [
  { name: "R. Perkins & Co", email: 'info@rperkins.co.uk', city: 'London', type: 'Plumbing' },
  { name: "Mr Plumber Birmingham", email: 'info@mrplumberbirmingham.co.uk', city: 'Birmingham', type: 'Plumbing' },
  { name: "Jack The Plumber", email: 'info@jacktheplumber.co.uk', city: 'Birmingham', type: 'Plumbing' },
  { name: "AB Plumbing & Heating", email: 'info@abplumbing-heating.co.uk', city: 'Birmingham', type: 'Plumbing' },
  { name: "Glasgow Plumbing Services", email: 'info@glasgowplumbingservices.co.uk', city: 'Glasgow', type: 'Plumbing' },
  { name: "The Glasgow Plumbers", email: 'contact@theglasgowplumbers.co.uk', city: 'Glasgow', type: 'Plumbing' },
  { name: "Mossley Hill Plumbers", email: 'info@mossleyhillplumbers.co.uk', city: 'Liverpool', type: 'Plumbing' },
  { name: "JWC Plumbing & Heating", email: 'info@jwcplumbingandheating.co.uk', city: 'Liverpool', type: 'Plumbing' },
  { name: "Cummings Plumbing", email: 'info@cummingsplumbing.co.uk', city: 'Edinburgh', type: 'Plumbing' },
  { name: "Albion Plumbing", email: 'info@albionplumbing.co.uk', city: 'Edinburgh', type: 'Plumbing' },
  { name: "BPS Plumbing", email: 'stu@bps-plumbing.co.uk', city: 'Newcastle', type: 'Plumbing' },
  { name: "Advance Installations", email: 'christine@advanceinstallations.co.uk', city: 'Newcastle', type: 'Plumbing' },
];

async function send(b) {
  const { subject, html } = createEmail(b);
  try {
    await transporter.sendMail({ 
      from: '"Abdelhak - AI Receptionist" <tirha66@gmail.com>', 
      to: b.email, 
      subject, 
      html 
    });
    console.log(`✅ ${b.name} - ${b.city} (${b.type})`);
    return true;
  } catch (e) { 
    console.log(`❌ ${b.name}: ${e.message}`); 
    return false; 
  }
}

async function run() {
  console.log('\n📧 AI RECEPTIONIST OUTREACH - PLUMBERS\n');
  let sent = 0;
  for (const b of businesses) {
    if (await send(b)) sent++;
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log(`\n✅ DONE: ${sent}/${businesses.length} sent`);
  console.log(`\n📺 Demo page: ${DEMO_LINK}`);
}
run();
