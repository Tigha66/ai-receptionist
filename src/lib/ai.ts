import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const summarizeConversation = async (messages: { role: string; content: string }[]) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Summarize this conversation concisely, capturing the main topic, customer intent, and any important details.',
      },
      ...messages,
    ],
  });

  return response.choices[0]?.message?.content || '';
};

export const qualifyLead = async (conversation: string): Promise<{
  score: 1 | 2 | 3 | 4 | 5;
  reason: string;
}> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Analyze this conversation and rate the lead quality from 1-5:
        1 = Not interested, low intent
        2 = Some interest but not ready
        3 = Moderately interested, needs nurturing
        4 = High interest, ready to engage
        5 = Very high intent, ready to convert
        
        Respond in JSON format: { "score": <1-5>, "reason": "<brief explanation>" }`,
      },
      { role: 'user', content: conversation },
    ],
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(response.choices[0]?.message?.content || '{}');
  return {
    score: Math.min(5, Math.max(1, result.score)) as 1 | 2 | 3 | 4 | 5,
    reason: result.reason || '',
  };
};

export const detectSentiment = async (text: string): Promise<'positive' | 'neutral' | 'negative'> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Analyze the sentiment of this message. Respond with just "positive", "neutral", or "negative".',
      },
      { role: 'user', content: text },
    ],
  });

  const sentiment = response.choices[0]?.message?.content?.toLowerCase() || 'neutral';
  if (sentiment.includes('positive')) return 'positive';
  if (sentiment.includes('negative')) return 'negative';
  return 'neutral';
};

export const generateAutoResponse = async (
  context: string,
  customerMessage: string,
  businessInfo?: { name: string; hours?: string; services?: string[] }
): Promise<string> => {
  const systemPrompt = businessInfo
    ? `You are a helpful receptionist for ${businessInfo.name}. 
       Business hours: ${businessInfo.hours || 'Not specified'}
       Services: ${businessInfo.services?.join(', ') || 'Not specified'}
       
       Be polite, concise, and helpful. If you need to schedule something, mention that you can help with appointment booking.`
    : 'You are a helpful AI receptionist. Be polite and concise.';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: customerMessage },
    ],
  });

  return response.choices[0]?.message?.content || 'Thank you for your message. Someone will be with you shortly.';
};
