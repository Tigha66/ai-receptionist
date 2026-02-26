# AI Receptionist 🤖📞

> AI-powered phone receptionist that answers calls 24/7, books appointments, and handles FAQs - no voicemail ever!

## Features

### Core Features
- 📞 **24/7 Call Answering** - Never miss a call
- 📅 **Appointment Booking** - Calendar integration
- ❓ **FAQ Handling** - Answer common questions
- 🌙 **After-Hours AI** - No voicemail - always answered
- 📱 **Web Interface** - Book via website too

### Analytics & Feedback
- 📊 **Call Analytics** - Track calls, bookings, trends
- ⭐ **Feedback Collection** - Rate each interaction
- 📈 **Performance Reports** - Daily/Weekly/Monthly
- 🎯 **Intent Tracking** - Know what callers want

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Tigha66/ai-receptionist.git
cd ai-receptionist

# 2. Configure
cp config.json.example config.json
# Edit config.json with your business details

# 3. Install dependencies
npm install

# 4. Deploy to Vercel
vercel --prod
```

## Files

| File | Purpose |
|------|---------|
| `IMPLEMENTATION.md` | Complete technical guide |
| `receptionist.md` | OpenClaw AI prompt |
| `config.json` | Business configuration |
| `server.js` | Express server |
| `web-interface.html` | Booking website |
| `analytics.js` | Call tracking |
| `FEEDBACK.md` | Feedback system |

## Demo

**Try the web interface:**
1. Open `web-interface.html` in browser
2. Click "Book Appointment"
3. Fill form - saved to localStorage

## Configuration

Edit `config.json`:

```json
{
  "business": {
    "name": "My Business",
    "phone": "+447700000000",
    "address": "123 High St, London"
  },
  "hours": {
    "monday": {"start": "09:00", "end": "18:00"}
  },
  "pricing": {
    "consultation": 50
  }
}
```

## Tech Stack

| Component | Technology |
|-----------|-------------|
| Phone | Twilio |
| AI | OpenClaw (GPT-4) |
| Speech | Groq Whisper |
| Calendar | Google Calendar |
| Hosting | Vercel |

## Pricing for Your Clients

| Plan | Price | Features |
|------|-------|----------|
| Basic | £97/mo | Call answering + FAQ |
| Pro | £197/mo | + Appointments + SMS |
| Enterprise | £397/mo | + CRM + Multi-line |

## Call Flow

```
Incoming Call
     ↓
AI Greets + Menu
     ↓
┌────┴────┐
↓          ↓
Book     FAQ
↓          ↓
Calendar  Knowledge
↓          ↓
Confirm   Answer
     ↓
Collect Feedback
     ↓
Goodbye!
```

## Learn More

- [Implementation Guide](IMPLEMENTATION.md)
- [Feedback System](FEEDBACK.md)

## Support

📧 tigha66@gmail.com

---

**Built with OpenClaw** 🚀
