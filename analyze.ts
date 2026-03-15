import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { poseDescription, shotType, gripType, proEmulate } = req.body

  const emulateSection = proEmulate
    ? `\n\nThe golfer wants to emulate **${proEmulate}'s** swing. Include specific comparisons and what adjustments would help them achieve that swing pattern.`
    : ''

  const prompt = `You are an expert PGA-certified golf coach with 20+ years of teaching experience. Analyze this golf swing data and provide clear, encouraging coaching.

**Shot Type:** ${shotType}
**Grip Type:** ${gripType}${emulateSection}

**Swing Analysis Data:**
${poseDescription}

Respond with these exact sections using markdown:

## 🏌️ Swing Overview
2-3 sentence summary of the overall swing.

## ✅ What's Working
2-3 positive elements to reinforce.

## 🎯 Key Improvements
3-4 specific, prioritized improvements with clear WHY explanations.

## 💪 Drills to Try
2-3 specific practice drills with step-by-step instructions.

## 📐 Setup Tips
Specific advice for stance, ball position, alignment for this shot type.

## 🎬 Watch & Learn
Suggest 2-3 specific YouTube search terms to find helpful videos.

Keep language encouraging, accessible to all skill levels. Assume the user may be a complete beginner.`

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
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || 'Unable to generate analysis. Please try again.'
    res.status(200).json({ result: text })
  } catch (err) {
    res.status(500).json({ result: 'Connection error. Please check your internet and try again.' })
  }
}
