import { createGroq } from '@ai-sdk/groq';
import { generateText, streamText } from 'ai';

const groq = createGroq({
  apiKey: process.env.XAI_API_KEY, // Reading the provided 'gsk_' key
});

export const grokModel = groq('llama-3.3-70b-versatile'); // Using Meta's top Llama 3.3 model on Groq

/**
 * Utility to generate text from Grok
 */
export async function askGrok(prompt: string, system?: string) {
  console.log('--- Grok Analysis Request ---');
  console.log('System:', system?.slice(0, 50) + '...');
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: system || "You are MindLedger AI, a decision intelligence assistant." },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      throw new Error(`Groq API Error: ${response.status} ${errData}`);
    }

    const data: any = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    console.log('Grok-3: Success (Response length:', text.length, ')');
    return text;
  } catch (err: any) {
    console.error('Grok-3 API Error:', err.message || err);
    throw err;
  }
}

/**
 * Utility for streaming responses (good for chat)
 */
export function streamGrok(messages: any[], system: string) {
  return streamText({
    model: grokModel as any,
    system,
    messages,
  });
}
