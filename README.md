# AI Receptionist with OpenClaw

An intelligent phone receptionist that never misses a call.

## Features

### 1. 📞 Answer Missed Calls 24/7
- Auto-answer incoming calls
- Personalized greetings
- Route callers to services

### 2. 📅 Book Appointments
- Schedule new appointments
- Modify existing bookings
- Confirm appointments
- Calendar integration

### 3. ❓ Answer FAQs
- Common questions answered
- Dynamic responses based on context
- Easy to update

### 4. 🌙 After-Hours Routing
- AI handles after-hours calls
- No voicemail - always answered
- Alternative solutions offered

---

## Setup

### Prerequisites
- OpenClaw installed
- Twilio account (for phone)
- Google Calendar (for appointments)
- ngrok (for local development)

---

## OpenClaw Prompt

```
Build an AI receptionist system using OpenClaw that can:

1. Answer missed calls 24/7: Automatically pick up calls, providing personalized greetings, and guiding callers to their required services (appointments, FAQs, etc.).

2. Book Appointments: Interface with the calendar system to schedule, modify, and confirm appointments, all while interacting with callers smoothly.

3. Answer Frequently Asked Questions (FAQs): Understand and provide responses to common customer inquiries, dynamically adjusting answers based on context and database updates.

4. Route After-Hours Calls to AI: Automatically direct calls that come in after business hours to the AI, ensuring that no call goes unanswered. The AI should offer alternative solutions to voicemail (avoiding lost customer interactions).

The system should ensure:
- Real-time, human-like interactions using NLP (Natural Language Processing)
- Integration with a backend to manage customer records, appointments, and FAQs
- Easy to customize responses and workflows as the business evolves
```

---

## Configuration

### Business Hours
```json
{
  "businessHours": {
    "monday": {"start": "09:00", "end": "18:00"},
    "tuesday": {"start": "09:00", "end": "18:00"},
    "wednesday": {"start": "09:00", "end": "18:00"},
    "thursday": {"start": "09:00", "end": "18:00"},
    "friday": {"start": "09:00", "end": "18:00"},
    "saturday": {"start": "10:00", "end": "14:00"},
    "sunday": {"start": "00:00", "end": "00:00"}
  },
  "timezone": "Europe/London"
}
```

### FAQs Database
```json
{
  "faqs": [
    {
      "keywords": ["hours", "opening", "open"],
      "answer": "We're open Monday to Friday 9am-6pm, Saturday 10am-2pm, and closed Sunday."
    },
    {
      "keywords": ["price", "cost", "pricing"],
      "answer": "Our services start from £[MIN_PRICE]. Would you like me to book a consultation?"
    },
    {
      "keywords": ["location", "address", "where"],
      "answer": "We're located at [BUSINESS_ADDRESS]. Would you like directions?"
    }
  ]
}
```

---

## Twilio Setup

1. Create Twilio account
2. Get phone number
3. Set up webhook to OpenClaw

### TwiML Example
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Agent destination="OPENCLAW_WEBHOOK_URL"/>
  </Connect>
</Response>
```

---

## Calendar Integration

### Google Calendar
- Create service account
- Share calendar with service account
- Use Calendar API for bookings

### Booking Flow
1. Caller requests appointment
2. AI checks availability
3. AI proposes times
4. Caller confirms
5. Event created in calendar
6. Confirmation sent via SMS/email

---

## Pricing

| Feature | Description |
|---------|-------------|
| Basic | £97/mo - Call answering + FAQs |
| Pro | £197/mo - + Appointments + SMS |
| Enterprise | £397/mo - + Multiple lines + CRM |

---

## Example Responses

### Opening Hours
> "Our opening hours are Monday to Friday 9am to 6pm,am to 2pm. How and Saturday 10 can I help?"

### Book Appointment
> "I'd be happy to book you in! Let me check our availability. Would you prefer morning or afternoon?"

### After Hours
> "Thank you for calling! Our office is currently closed, but I'm here to help. What can I assist you with?"

---

## Files

| File | Purpose |
|------|---------|
| `config.json` | Business settings |
| `faqs.json` | FAQ database |
| `receptionist.md` | Main OpenClaw prompt |
| `calendar.js` | Calendar integration |
| `twilio.js` | Phone webhook handler |

---

## Next Steps

1. Configure business hours
2. Add FAQs
3. Connect Twilio
4. Set up calendar
5. Test!

---

**Ready to deploy your AI Receptionist? Let me know! 🚀**
