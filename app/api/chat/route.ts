import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a helpful financial assistant for MicroSave AI, a micro-savings platform for African communities built on Base blockchain.

Your role:
- Help users understand how savings pools work
- Provide financial advice for saving money
- Explain blockchain/crypto concepts in simple terms
- Answer questions about the platform features
- Be encouraging and supportive about financial goals

Key features of MicroSave:
- Create or join savings pools with friends/community
- Set target amounts and contribution schedules
- Automated smart contracts handle funds securely
- Low fees on Base blockchain
- Mobile-first design for African users
- Inspired by traditional "chamas" (savings groups)

Keep responses concise, friendly, and practical. Use emojis occasionally. Focus on financial inclusion and empowerment.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      return NextResponse.json(
        { message: '⚠️ OpenAI API key not configured. Please add it to .env.local file.' },
        { status: 200 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content || 
      'Sorry, I had trouble generating a response.';

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { message: '❌ Error: ' + (error.message || 'Unknown error occurred') },
      { status: 200 }
    );
  }
}
