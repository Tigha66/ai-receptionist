# AI Receptionist for SMBs - Technical Specification

## Project Overview
- **Name**: SMB AI Receptionist
- **Type**: Multi-channel customer interaction platform
- **Core Functionality**: Automate customer interactions via voice, chat, and email with calendar sync, lead capture, and analytics
- **Target Users**: Small and medium-sized businesses

---

## Architecture

### Tech Stack
- **Backend**: Next.js 14 (App Router) with TypeScript
- **Database**: PostgreSQL via Supabase (easy setup, built-in auth)
- **Real-time**: WebSocket for chat
- **Voice**: Twilio (for phone integration)
- **Calendar**: Google Calendar API
- **Email**: Gmail API or Resend

### Data Model

```
Business
├── id, name, timezone, settings
├── calendarConnection (google|outlook|none)
├── phoneConnection (twilio|none)
└── emailSettings

Customer
├── id, businessId, name, email, phone
├── source (chat|voice|email)
├── tags, notes
└── createdAt

Lead
├── id, businessId, customerId
├── status (new|contacted|qualified|converted|lost)
├── sourceInquiry
├── interestLevel (1-5)
├── notes
└── createdAt, updatedAt

Appointment
├── id, businessId, customerId
├── title, startTime, endTime
├── status (pending|confirmed|cancelled|completed)
├── channel (chat|voice|email)
├── notes
└── createdAt

Interaction
├── id, businessId, customerId, appointmentId?
├── channel (chat|voice|email)
├── type (inbound|outbound)
├── direction (incoming|outgoing)
├── transcript
├── sentiment (positive|neutral|negative)
├── duration (seconds, for voice)
├── metadata (JSON)
└── timestamp
```

### API Structure

```
/api
├── /auth          # Authentication
├── /business      # Business settings
├── /customers     # Customer CRUD
├── /leads         # Lead management
├── /appointments  # Calendar scheduling
├── /interactions  # Interaction logging
├── /analytics     # Reporting & insights
├── /webhooks
│   ├── /twilio    # Voice phone events
│   ├── /google    # Calendar sync
│   └── /email     # Incoming email
└── /chat
    ├── /socket    # WebSocket for real-time chat
    └── /history   # Chat transcript storage
```

---

## MVP Scope (Phase 1)

### Goal: Get something working in 1-2 days

**Channels**: Web chat only (easiest to build and test)
**Integration**: Google Calendar (most common for SMBs)
**Features**:
1. Widget snippet for business websites
2. Real-time chat with customers
3. Calendar availability checking
4. Basic appointment booking
5. Simple lead capture (save customer info)

### MVP Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  SMB Website │────▶│  Chat Widget │────▶│  Next.js    │
│  (iframe)   │     │  (frontend)  │     │  Backend    │
└─────────────┘     └──────────────┘     └─────────────┘
                                               │
                    ┌──────────────────────────┼──────────┐
                    │                          │          │
              ┌─────▼─────┐           ┌────────▼────┐   ┌─▼────────┐
              │  Google    │           │  Supabase   │   │  OpenAI  │
              │  Calendar  │           │  (DB/Auth)  │   │  (LLM)   │
              └───────────┘           └─────────────┘   └──────────┘
```

### MVP File Structure

```
/ai-receptionist
├── README.md
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── /src
│   ├── /app
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── /api
│   │   │   ├── /chat
│   │   │   │   └── route.ts
│   │   │   ├── /appointments
│   │   │   │   └── route.ts
│   │   │   ├── /calendar
│   │   │   │   └── route.ts
│   │   │   └── /leads
│   │   │       └── route.ts
│   │   │   └── /auth
│   │   │       └── [...nextauth]/route.ts
│   │   ├── /dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── /customers/page.tsx
│   │   │   ├── /appointments/page.tsx
│   │   │   └── /analytics/page.tsx
│   │   └── /embed
│   │       └── /widget.tsx    # The chat widget
│   ├── /components
│   │   ├── /ui                # shadcn components
│   │   ├── ChatWidget.tsx
│   │   ├── BookingCalendar.tsx
│   │   └── LeadForm.tsx
│   ├── /lib
│   │   ├── db.ts              # Supabase client
│   │   ├── google.ts          # Google Calendar API
│   │   └── ai.ts              # OpenAI helpers
│   ├── /hooks
│   │   └── useChat.ts
│   └── /types
│       └── index.ts
├── /public
│   └── widget.js              # Embeddable script
└── /scripts
    └── setup-db.ts            # Database migration
```

---

## Phase 2+ (Future)

### Phase 2: Voice (Twilio)
- Incoming call handling
- IVR menu
- Call recording & transcription
- Voicemail to text

### Phase 3: Email
- Inbound email processing
- Auto-responses
- Email-to-lead capture

### Phase 4: Advanced
- CRM integration (HubSpot, Pipedrive)
- SMS notifications
- Advanced analytics dashboard
- Multi-business support (SaaS)

---

## Key Integrations

### Google Calendar
- OAuth2 flow for business connection
- Read free/busy slots
- Create/update/delete events
- Send calendar invites to customers

### Twilio (Voice)
- Phone number provisioning
- Webhook for incoming calls
- Recording storage
- Transcription via OpenAI Whisper

### OpenAI
- Conversation summary
- Lead qualification scoring
- Sentiment analysis
- Auto-responses (optional)

---

## Security Considerations

- All API routes protected by authentication
- Customer data encrypted at rest
- Calendar OAuth tokens secured
- Webhook signature verification (Twilio)
- Rate limiting on API endpoints
- PII handling compliant with GDPR (configurable)

---

## Success Metrics (MVP)

1. ✅ Chat widget loads on test page
2. ✅ Messages sent/received in real-time
3. ✅ Calendar availability displayed
4. ✅ Appointment created in Google Calendar
5. ✅ Lead saved to database
6. ✅ Dashboard shows basic metrics
