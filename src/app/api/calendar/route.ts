import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db';
import { getAuthUrl, getTokens, setCredentials } from '@/lib/google';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const businessId = searchParams.get('businessId');
  const code = searchParams.get('code');

  // OAuth flow - get auth URL
  if (action === 'authorize' && businessId) {
    const authUrl = getAuthUrl(businessId);
    return NextResponse.json({ authUrl });
  }

  // OAuth callback - exchange code for tokens
  if (action === 'callback' && code && businessId) {
    try {
      const tokens = await getTokens(code);
      
      const db = createServerClient();
      
      // Save tokens (in production, encrypt these!)
      const { error } = await db
        .from('businesses')
        .update({
          calendar_connected: true,
          calendar_tokens: tokens,
        })
        .eq('id', businessId);

      if (error) {
        console.error('Error saving calendar tokens:', error);
        return NextResponse.json(
          { error: 'Failed to connect calendar' },
          { status: 500 }
        );
      }

      return NextResponse.redirect(new URL('/dashboard/settings?calendar=connected', request.url));
    } catch (error) {
      console.error('Calendar auth error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  }

  // Check connection status
  if (action === 'status' && businessId) {
    const db = createServerClient();
    
    const { data: business, error } = await db
      .from('businesses')
      .select('calendar_connected, calendar_id')
      .eq('id', businessId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to check status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      connected: business?.calendar_connected || false,
      calendarId: business?.calendar_id || 'primary'
    });
  }

  return NextResponse.json(
    { error: 'Invalid action' },
    { status: 400 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, calendarId, tokens } = body;

    if (!businessId || !calendarId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = createServerClient();

    // Set credentials and verify access
    if (tokens) {
      setCredentials(tokens);
    }

    // Save calendar settings
    const { error } = await db
      .from('businesses')
      .update({
        calendar_id: calendarId,
        calendar_connected: true,
      })
      .eq('id', businessId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save calendar settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Calendar setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');

  if (!businessId) {
    return NextResponse.json(
      { error: 'Business ID required' },
      { status: 400 }
    );
  }

  const db = createServerClient();

  const { error } = await db
    .from('businesses')
    .update({
      calendar_connected: false,
      calendar_tokens: null,
    })
    .eq('id', businessId);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to disconnect calendar' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
