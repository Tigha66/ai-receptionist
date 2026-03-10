import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db';
import { generateAutoResponse, detectSentiment } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, businessId, message, customerId } = body;

    if (!message || !businessId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = createServerClient();

    // Save user message
    const { data: userMsg, error: userError } = await db
      .from('messages')
      .insert({
        session_id: sessionId,
        business_id: businessId,
        customer_id: customerId,
        role: 'user',
        content: message,
      })
      .select()
      .single();

    if (userError) {
      console.error('Error saving user message:', userError);
      return NextResponse.json(
        { error: 'Failed to save message' },
        { status: 500 }
      );
    }

    // Detect sentiment
    const sentiment = await detectSentiment(message);

    // Check if this is a booking request
    const isBookingRequest = /book|appointment|schedule|meeting/i.test(message);

    let responseContent = '';
    let aiResponse: { content: string } | null = null;

    if (isBookingRequest) {
      responseContent = "I'd be happy to help you book an appointment! Please let me know what service you're interested in and what times work best for you.";
    } else {
      // Generate AI response
      responseContent = await generateAutoResponse('', message, {
        name: 'Your Business',
        hours: '9 AM - 5 PM',
      });
    }

    // Save assistant response
    const { data: assistantMsg, error: assistantError } = await db
      .from('messages')
      .insert({
        session_id: sessionId,
        business_id: businessId,
        customer_id: customerId,
        role: 'assistant',
        content: responseContent,
      })
      .select()
      .single();

    if (assistantError) {
      console.error('Error saving assistant message:', assistantError);
    }

    // Log interaction
    await db.from('interactions').insert({
      business_id: businessId,
      customer_id: customerId,
      channel: 'chat',
      type: 'inbound',
      direction: 'incoming',
      transcript: message,
      sentiment,
      metadata: { sessionId, messageId: userMsg?.id },
    });

    return NextResponse.json({
      message: assistantMsg,
      suggestions: isBookingRequest ? ['View Available Times', 'Book for Later This Week'] : [],
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID required' },
      { status: 400 }
    );
  }

  const db = createServerClient();
  const { data: messages, error } = await db
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }

  return NextResponse.json({ messages: messages || [] });
}
