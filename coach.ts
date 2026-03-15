import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { question, skillLevel } = req.body

  const prompt = `You are a friendly, expert golf coach. The user is a ${skillLevel || 'beginner'} golfer asking:

"${question}"

Give a warm, encouraging, practical answer. Use simple language. No jargon without explanation. Include one thing they can try immediately. Under 250 words. Use occasional emojis to keep it friendly.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || 'Unable to answer right now. Please try again.'
    res.status(200).json({ result: text })
  } catch (err) {
    res.status(500).json({ result: 'Connection error. Please try again.' })
  }
}
