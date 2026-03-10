// AI Receptionist for SMBs
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());

// In-memory storage
const appointments = new Map();
const leads = new Map();
const conversations = new Map();
const customers = new Map();
const analytics = {
  totalInteractions: 0,
  byChannel: { voice: 0, chat: 0, email: 0 },
  peakHours: {},
  commonInquiries: {},
  responseTimes: [],
  conversions: { qualified: 0, converted: 0 }
};

// Business hours (configurable)
const businessHours = {
  start: 9,
  end: 18,
  timezone: 'UTC'
};

// Services offered (customizable per business)
const services = [
  { id: 'consultation', name: 'Consultation', duration: 30, price: 0 },
  { id: 'service-a', name: 'Service A', duration: 60, price: 100 },
  { id: 'service-b', name: 'Service B', duration: 90, price: 150 },
  { id: 'service-c', name: 'Service C', duration: 120, price: 200 }
];

// Helper functions
function generateId(prefix) {
  return prefix + '-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function isBusinessHours() {
  const hour = new Date().getHours();
  return hour >= businessHours.start && hour < businessHours.end;
}

function getTimeSlots(date, duration = 30) {
  const slots = [];
  for (let h = businessHours.start; h < businessHours.end; h++) {
    for (let m = 0; m < 60; m += duration) {
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return slots;
}

function qualifyLead(inquiry) {
  const lower = inquiry.toLowerCase();
  let score = 0;
  let category = 'general';
  
  // Urgency indicators
  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('today')) score += 30;
  if (lower.includes('this week') || lower.includes('soon')) score += 20;
  
  // Interest indicators
  if (lower.includes('book') || lower.includes('schedule') || lower.includes('appointment')) score += 25;
  if (lower.includes('price') || lower.includes('cost') || lower.includes('quote')) score += 20;
  if (lower.includes('service')) score += 15;
  
  // Category detection
  if (lower.includes('consultation')) category = 'consultation';
  else if (lower.includes('service a') || lower.includes('service-a')) category = 'service-a';
  else if (lower.includes('service b') || lower.includes('service-b')) category = 'service-b';
  else if (lower.includes('service c') || lower.includes('service-c')) category = 'service-c';
  
  return {
    score: Math.min(score, 100),
    category,
    qualified: score >= 40
  };
}

// Routes

app.get('/', (req, res) => {
  res.json({
    service: 'AI Receptionist',
    version: '1.0.0',
    status: isBusinessHours() ? 'open' : 'closed',
    businessHours: `${businessHours.start}:00 - ${businessHours.end}:00 ${businessHours.timezone}`,
    features: ['Multi-channel', 'Appointment Scheduling', 'Lead Capture', 'Analytics'],
    endpoints: {
      chat: '/api/chat',
      voice: '/api/voice',
      email: '/api/email',
      appointments: '/api/appointments',
      leads: '/api/leads',
      analytics: '/api/analytics'
    }
  });
});

// Multi-channel Chat
app.post('/api/chat', (req, res) => {
  const { message, customerId, channel } = req.body;
  const ch = channel || 'chat';
  
  analytics.totalInteractions++;
  analytics.byChannel[ch] = (analytics.byChannel[ch] || 0) + 1;
  
  // Track common inquiries
  const keywords = message.toLowerCase().split(' ').filter(w => w.length > 3);
  keywords.forEach(w => {
    analytics.commonInquiries[w] = (analytics.commonInquiries[w] || 0) + 1;
  });
  
  // Generate response
  let response = '';
  let action = null;
  const lower = message.toLowerCase();
  
  // Greeting
  if (lower.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    response = `Hello! 👋 Welcome to our business. I'm your AI receptionist.\n\nHow can I help you today?\n• Book an appointment\n• Get information about services\n• Ask a question`;
  }
  // Booking
  else if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule')) {
    response = `I'd be happy to help you book an appointment!\n\nOur services:\n${services.map(s => `• ${s.name} (${s.duration}min${s.price ? ' - $' + s.price : ''})`).join('\n')}\n\nWhich service would you like?`;
    action = { type: 'booking_start' };
  }
  // Services
  else if (lower.includes('service') || lower.includes('what do you offer')) {
    response = `Our services:\n\n${services.map(s => `**${s.name}**\nDuration: ${s.duration} minutes${s.price ? '\nPrice: $' + s.price : ''}`).join('\n\n')}\n\nWould you like to book any of these?`;
  }
  // Hours
  else if (lower.includes('hour') || lower.includes('open') || lower.includes('close')) {
    response = `Our business hours are ${businessHours.start}:00 AM to ${businessHours.end}:00 PM (${businessHours.timezone}).\n\n${isBusinessHours() ? '✅ We are currently open!' : '🔒 We are currently closed. Leave a message and we\'ll get back to you!'}`;
  }
  // Contact
  else if (lower.includes('contact') || lower.includes('phone') || lower.includes('email')) {
    response = `You can reach us at:\n📞 Phone: (555) 123-4567\n📧 Email: contact@business.com\n\nOr leave your message here and I'll make sure it gets to the right person!`;
  }
  // Default - capture as lead
  else {
    // Create/update lead
    const qualification = qualifyLead(message);
    const leadId = generateId('LEAD');
    const lead = {
      id: leadId,
      customerId,
      inquiry: message,
      score: qualification.score,
      category: qualification.category,
      qualified: qualification.qualified,
      status: 'new',
      channel: ch,
      createdAt: new Date().toISOString()
    };
    leads.set(leadId, lead);
    
    response = `Thank you for your message! I've recorded your inquiry and someone will get back to you ${isBusinessHours() ? 'shortly' : 'when we open'}.\n\nIs there anything else I can help you with?`;
    action = { type: 'lead_created', leadId, qualified: qualification.qualified };
    
    if (qualification.qualified) {
      analytics.conversions.qualified++;
    }
  }
  
  // Store conversation
  const convId = generateId('CONV');
  conversations.set(convId, {
    id: convId,
    customerId,
    channel: ch,
    messages: [
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    ],
    timestamp: new Date().toISOString()
  });
  
  res.json({ response, action });
});

// Voice Call Handler
app.post('/api/voice', (req, res) => {
  const { transcript, callerId } = req.body;
  
  analytics.totalInteractions++;
  analytics.byChannel.voice++;
  
  // Process voice transcript similar to chat
  const response = {
    message: isBusinessHours() 
      ? "Thank you for calling. How may I assist you today?"
      : "Thank you for calling. We are currently closed. Please leave a message after the beep.",
    actions: ['transfer', 'voicemail', 'booking']
  };
  
  res.json(response);
});

// Email Handler
app.post('/api/email', (req, res) => {
  const { from, subject, body } = req.body;
  
  analytics.totalInteractions++;
  analytics.byChannel.email++;
  
  // Qualify lead from email
  const qualification = qualifyLead(body + ' ' + subject);
  const leadId = generateId('LEAD');
  
  const lead = {
    id: leadId,
    email: from,
    subject,
    body,
    score: qualification.score,
    qualified: qualification.qualified,
    status: 'new',
    channel: 'email',
    createdAt: new Date().toISOString()
  };
  leads.set(leadId, lead);
  
  res.json({ 
    received: true, 
    leadId,
    autoReply: `Thank you for your email. We have received your message and will respond within 24 hours.`
  });
});

// Appointments
app.get('/api/appointments', (req, res) => {
  const { date, status } = req.query;
  let result = Array.from(appointments.values());
  if (date) result = result.filter(a => a.date === date);
  if (status) result = result.filter(a => a.status === status);
  res.json({ appointments: result });
});

app.get('/api/appointments/slots', (req, res) => {
  const { date, serviceId } = req.query;
  const service = services.find(s => s.id === serviceId) || services[0];
  const slots = getTimeSlots(date, service.duration);
  
  // Filter out booked slots
  const booked = Array.from(appointments.values())
    .filter(a => a.date === date)
    .map(a => a.time);
  
  const available = slots.filter(s => !booked.includes(s));
  
  res.json({ date, availableSlots: available, service: service.name });
});

app.post('/api/appointments', (req, res) => {
  const { customerId, customerName, customerEmail, customerPhone, serviceId, date, time, notes } = req.body;
  
  const service = services.find(s => s.id === serviceId) || services[0];
  
  const appointment = {
    id: generateId('APT'),
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    service: service.name,
    serviceId,
    date,
    time,
    duration: service.duration,
    notes,
    status: 'confirmed',
    reminderSent: false,
    createdAt: new Date().toISOString()
  };
  
  appointments.set(appointment.id, appointment);
  
  res.json({ 
    success: true, 
    appointment,
    message: `Appointment confirmed for ${date} at ${time} (${service.name})`
  });
});

app.patch('/api/appointments/:id', (req, res) => {
  const apt = appointments.get(req.params.id);
  if (!apt) return res.status(404).json({ error: 'Not found' });
  
  const { status, date, time } = req.body;
  if (status) apt.status = status;
  if (date) apt.date = date;
  if (time) apt.time = time;
  apt.updatedAt = new Date().toISOString();
  
  appointments.set(apt.id, apt);
  res.json({ success: true, appointment: apt });
});

app.delete('/api/appointments/:id', (req, res) => {
  const apt = appointments.get(req.params.id);
  if (!apt) return res.status(404).json({ error: 'Not found' });
  
  apt.status = 'cancelled';
  appointments.set(apt.id, apt);
  res.json({ success: true, message: 'Appointment cancelled' });
});

// Leads
app.get('/api/leads', (req, res) => {
  const { status, qualified } = req.query;
  let result = Array.from(leads.values());
  if (status) result = result.filter(l => l.status === status);
  if (qualified === 'true') result = result.filter(l => l.qualified);
  res.json({ leads: result });
});

app.get('/api/leads/:id', (req, res) => {
  const lead = leads.get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Not found' });
  res.json({ lead });
});

app.patch('/api/leads/:id', (req, res) => {
  const lead = leads.get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Not found' });
  
  const { status, notes, converted } = req.body;
  if (status) lead.status = status;
  if (notes) lead.notes = notes;
  if (converted) {
    lead.converted = true;
    analytics.conversions.converted++;
  }
  lead.updatedAt = new Date().toISOString();
  
  leads.set(lead.id, lead);
  res.json({ success: true, lead });
});

// Follow-up
app.post('/api/leads/:id/followup', (req, res) => {
  const lead = leads.get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Not found' });
  
  const { message, channel } = req.body;
  
  lead.followUps = lead.followUps || [];
  lead.followUps.push({
    message,
    channel,
    sentAt: new Date().toISOString()
  });
  lead.lastFollowUp = new Date().toISOString();
  
  leads.set(lead.id, lead);
  res.json({ success: true, message: 'Follow-up sent' });
});

// Analytics
app.get('/api/analytics', (req, res) => {
  const allLeads = Array.from(leads.values());
  const allAppointments = Array.from(appointments.values());
  
  // Peak hours analysis
  const hourCounts = {};
  allAppointments.forEach(a => {
    const hour = a.time.split(':')[0];
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  res.json({
    overview: {
      totalInteractions: analytics.totalInteractions,
      totalLeads: allLeads.length,
      totalAppointments: allAppointments.length,
      conversionRate: allLeads.length > 0 
        ? Math.round((analytics.conversions.converted / allLeads.length) * 100) 
        : 0
    },
    byChannel: analytics.byChannel,
    leads: {
      total: allLeads.length,
      qualified: allLeads.filter(l => l.qualified).length,
      converted: allLeads.filter(l => l.converted).length,
      byStatus: {
        new: allLeads.filter(l => l.status === 'new').length,
        contacted: allLeads.filter(l => l.status === 'contacted').length,
        closed: allLeads.filter(l => l.status === 'closed').length
      }
    },
    appointments: {
      total: allAppointments.length,
      confirmed: allAppointments.filter(a => a.status === 'confirmed').length,
      completed: allAppointments.filter(a => a.status === 'completed').length,
      cancelled: allAppointments.filter(a => a.status === 'cancelled').length
    },
    peakHours: hourCounts,
    commonInquiries: Object.entries(analytics.commonInquiries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  });
});

// Services
app.get('/api/services', (req, res) => {
  res.json({ services });
});

module.exports = app;