import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const db = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  console.log('Setting up database...');

  // Create tables
  const tables = [
    // Businesses
    `CREATE TABLE IF NOT EXISTS businesses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      timezone TEXT DEFAULT 'UTC',
      settings JSONB DEFAULT '{}',
      calendar_connected BOOLEAN DEFAULT false,
      calendar_id TEXT,
      calendar_tokens JSONB,
      phone_connected BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Customers
    `CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      source TEXT DEFAULT 'chat',
      tags TEXT[] DEFAULT '{}',
      notes TEXT DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Chat sessions
    `CREATE TABLE IF NOT EXISTS chat_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
      customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
      status TEXT DEFAULT 'active',
      started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      ended_at TIMESTAMP WITH TIME ZONE
    );`,

    // Messages
    `CREATE TABLE IF NOT EXISTS messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
      business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
      customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Leads
    `CREATE TABLE IF NOT EXISTS leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
      customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'new',
      source_inquiry TEXT,
      interest_level INTEGER DEFAULT 3,
      notes TEXT DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Appointments
    `CREATE TABLE IF NOT EXISTS appointments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
      customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      start_time TIMESTAMP WITH TIME ZONE NOT NULL,
      end_time TIMESTAMP WITH TIME ZONE NOT NULL,
      status TEXT DEFAULT 'pending',
      channel TEXT DEFAULT 'chat',
      notes TEXT DEFAULT '',
      google_event_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Interactions (for analytics)
    `CREATE TABLE IF NOT EXISTS interactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
      customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
      appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
      channel TEXT NOT NULL,
      type TEXT NOT NULL,
      direction TEXT NOT NULL,
      transcript TEXT,
      sentiment TEXT DEFAULT 'neutral',
      duration INTEGER,
      metadata JSONB DEFAULT '{}',
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,
  ];

  for (const sql of tables) {
    const { error } = await db.rpc('exec_sql', { sql });
    if (error) {
      console.log('Table creation (may already exist):', error.message);
    }
  }

  // Create indexes
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_customers_business ON customers(business_id);',
    'CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);',
    'CREATE INDEX IF NOT EXISTS idx_leads_business ON leads(business_id);',
    'CREATE INDEX IF NOT EXISTS idx_appointments_business ON appointments(business_id);',
    'CREATE INDEX IF NOT EXISTS idx_interactions_business ON interactions(business_id);',
  ];

  console.log('Database setup complete!');
  console.log('\nNext steps:');
  console.log('1. Create a .env.local file with your credentials');
  console.log('2. Run "npm run dev" to start the development server');
}

setupDatabase().catch(console.error);
