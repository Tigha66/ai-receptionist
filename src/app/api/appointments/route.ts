import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db';
import { getAvailableSlots, createCalendarEvent } from '@/lib/google';
import { format, addDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  const date = searchParams.get('date');

  if (!businessId) {
    return NextResponse.json(
      { error: 'Business ID required' },
      { status: 400 }
    );
  }

  const db = createServerClient();

  // Get business settings (including calendar ID)
  const { data: business, error: businessError } = await db
    .from('businesses')
    .select('calendar_id, calendar_tokens')
    .eq('id', businessId)
    .single();

  if (businessError || !business?.calendar_id) {
    return NextResponse.json(
      { error: 'Calendar not connected' },
      { status: 400 }
    );
  }

  // Get available slots
  const targetDate = date ? new Date(date) : new Date();
  const slots = await getAvailableSlots(business.calendar_id, targetDate);

  return NextResponse.json({ slots });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, customerId, title, startTime, endTime, customerEmail, customerName } = body;

    if (!businessId || !title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = createServerClient();

    // Get business calendar info
    const { data: business, error: businessError } = await db
      .from('businesses')
      .select('calendar_id, calendar_tokens')
      .eq('id', businessId)
      .single();

    if (businessError || !business?.calendar_id) {
      return NextResponse.json(
        { error: 'Calendar not connected' },
        { status: 400 }
      );
    }

    // Create calendar event
    const event = await createCalendarEvent(business.calendar_id, {
      summary: title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      attendees: customerEmail ? [{ email: customerEmail }] : undefined,
    });

    // Save to database
    const { data: appointment, error: appointmentError } = await db
      .from('appointments')
      .insert({
        business_id: businessId,
        customer_id: customerId,
        title,
        start_time: startTime,
        end_time: endTime,
        status: 'confirmed',
        channel: 'chat',
        google_event_id: event.id,
      })
      .select()
      .single();

    if (appointmentError) {
      console.error('Error creating appointment:', appointmentError);
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ appointment, event });
  } catch (error) {
    console.error('Appointment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
