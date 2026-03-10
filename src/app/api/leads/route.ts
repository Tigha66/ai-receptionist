import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db';
import { qualifyLead } from '@/lib/ai';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  const status = searchParams.get('status');

  if (!businessId) {
    return NextResponse.json(
      { error: 'Business ID required' },
      { status: 400 }
    );
  }

  const db = createServerClient();
  
  let query = db
    .from('leads')
    .select(`
      *,
      customer:customers(*)
    `)
    .eq('business_id', businessId);

  if (status) {
    query = query.eq('status', status);
  }

  const { data: leads, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }

  return NextResponse.json({ leads: leads || [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, customerId, sourceInquiry } = body;

    if (!businessId || !sourceInquiry) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = createServerClient();

    // Get recent conversation for qualification
    const { data: messages } = await db
      .from('messages')
      .select('content')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(5);

    const conversation = messages?.map(m => m.content).join('\n') || sourceInquiry;

    // Qualify lead with AI
    const qualification = await qualifyLead(conversation);

    // Create lead
    const { data: lead, error } = await db
      .from('leads')
      .insert({
        business_id: businessId,
        customer_id: customerId,
        source_inquiry: sourceInquiry,
        status: 'new',
        interest_level: qualification.score,
        notes: qualification.reason,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead, qualification });
  } catch (error) {
    console.error('Lead error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, status, notes } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID required' },
        { status: 400 }
      );
    }

    const db = createServerClient();

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    updateData.updated_at = new Date().toISOString();

    const { data: lead, error } = await db
      .from('leads')
      .update(updateData)
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
