/**
 * Groq API Client — Uses native fetch for zero-dependency AI calls.
 * Model: Meta LLaMA 3.3 70B Versatile via Groq Cloud
 */

export async function askGroq(prompt: string, system?: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: system || "You are MindLedger AI, a decision intelligence assistant." },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
    signal: AbortSignal.timeout(30000), // 30 second timeout
  });

  if (!response.ok) {
    const errData = await response.text();
    throw new Error(`Groq API Error: ${response.status} ${errData}`);
  }

  const data: any = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  return text;
}
