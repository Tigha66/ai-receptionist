# AI Receptionist for SMBs

A multi-channel AI receptionist that handles customer interactions, schedules appointments, and captures leads.

## Features

- **Multi-Channel Support**: Chat, voice (Twilio), and email
- **Smart Scheduling**: Google Calendar integration with real-time availability
- **Lead Capture**: Auto-qualify leads with AI
- **Analytics**: Track performance and customer insights
- **Embeddable Widget**: Add to any website

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Google Cloud project (for Calendar API)
- OpenAI API key (optional, for AI features)

### 1. Clone and Install

```bash
cd ai-receptionist
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Calendar OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar?action=callback

# OpenAI (optional)
OPENAI_API_KEY=sk-...

# NextAuth (optional for auth)
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Set up Supabase tables
npm run db:setup

# Or run the SQL manually (see scripts/setup-db.sql)
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/src
  /app              # Next.js App Router pages
    /api            # API routes
    /dashboard      # Business dashboard
  /components       # React components
  /lib              # Utilities (db, google, ai)
  /types            # TypeScript types
```

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send/receive chat messages |
| `/api/chat` | GET | Get chat history |
| `/api/appointments` | GET | Get available time slots |
| `/api/appointments` | POST | Create appointment |
| `/api/leads` | GET | List leads |
| `/api/leads` | POST | Create new lead |
| `/api/leads` | PATCH | Update lead status |
| `/api/calendar` | GET | OAuth flow / status |
| `/api/calendar` | POST | Connect calendar |

## Embed the Widget

Add this to any website:

```html
<script>
  (function(w,d,s,o,f,js,fjs){
    w['AIReceptionistWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','aiWidget','https://your-domain.com/widget.js'));
  aiWidget('init', { businessId: 'YOUR_BUSINESS_ID' });
</script>
```

## License

MIT
