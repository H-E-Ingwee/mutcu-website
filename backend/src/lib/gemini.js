require('dotenv').config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

/**
 * Core Gemini API call
 */
async function callGemini(prompt, maxTokens = 400, temperature = 0.7) {
  if (!GEMINI_API_KEY) {
    console.warn('[GEMINI] API key not set')
    return null
  }

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
        topP: 0.9,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Gemini API error: ${response.status}`)
  }

  const result = await response.json()
  return result.candidates?.[0]?.content?.parts?.[0]?.text || null
}

/**
 * Generate a scripture-based prayer encouragement for a submitted prayer request
 */
async function generatePrayerEncouragement(prayerRequest, name) {
  const prompt = `You are a compassionate Christian counsellor at a university Christian Union in Kenya called MUTCU (Murang'a University of Technology Christian Union). 

A ${name ? `person named ${name}` : 'member'} has submitted the following prayer request:
"${prayerRequest}"

Write a warm, brief (3-4 sentences), scripture-based encouragement response. 
- Include ONE relevant Bible verse (with reference)
- Be compassionate, faith-filled, and uplifting
- Do not be preachy or lecture them
- End with a short prayer sentence
- Write in a warm, personal tone
- Do not repeat the prayer request back to them

Format: Just the encouragement text, no headers or labels.`

  return await callGemini(prompt, 250, 0.7)
}

/**
 * Generate a daily devotional for the homepage widget
 */
async function generateDailyDevotional(date) {
  const dayOfYear = Math.floor((new Date(date) - new Date(new Date(date).getFullYear(), 0, 0)) / 86400000)
  
  const themes = [
    'faith and trust in God', 'prayer and intercession', 'love and fellowship',
    'hope in difficult times', 'godliness and holiness', 'service and giving',
    'evangelism and mission', 'discipleship and growth', 'worship and praise',
    'God\'s word and Bible study', 'leadership and integrity', 'community and unity',
  ]
  const theme = themes[dayOfYear % themes.length]

  const prompt = `You are writing a short daily devotional for MUTCU (Murang'a University of Technology Christian Union) — a university Christian Union in Kenya.

Today's theme: ${theme}

Write a brief daily devotional with:
1. A title (5-7 words, inspiring)
2. A key Bible verse (with full reference)
3. A short reflection (3-4 sentences, practical and encouraging for university students)
4. A one-sentence prayer

Format your response EXACTLY as JSON:
{
  "title": "...",
  "verse": "...",
  "reference": "...",
  "reflection": "...",
  "prayer": "..."
}`

  const text = await callGemini(prompt, 350, 0.6)
  if (!text) return null

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch (e) {
    console.error('[GEMINI] Failed to parse devotional JSON:', e.message)
  }
  return null
}

/**
 * Generate a blog post draft from a title/topic
 */
async function generateBlogDraft(title, topic, tone = 'devotional') {
  const prompt = `You are writing a blog post for MUTCU (Murang'a University of Technology Christian Union) — a university Christian Union in Kenya.

Title: "${title}"
Topic/Focus: ${topic || title}
Tone: ${tone} (devotional/inspirational/educational)

Write a complete blog post with:
- An engaging introduction (2-3 sentences)
- 3-4 main sections with clear points
- Practical application for university students
- A conclusion with a call to action
- Biblical references where appropriate

The post should be 400-600 words, written in a warm, accessible style appropriate for Christian university students in Kenya.

Write the full blog post content (no title needed, just the body):` 

  return await callGemini(prompt, 800, 0.7)
}

/**
 * Generate a personalized contact form auto-reply
 */
async function generateContactReply(name, subject, message) {
  const prompt = `You are writing a brief, warm acknowledgment email on behalf of MUTCU (Murang'a University of Technology Christian Union) in Kenya.

Someone named ${name} sent a message with subject: "${subject}"
Their message: "${message.substring(0, 300)}..."

Write a brief (3-4 sentences) personalized acknowledgment that:
- Thanks them by name
- Acknowledges their specific subject/concern
- Assures them someone will respond within 2-3 days
- Ends with a warm Christian closing

Keep it professional but warm. Do not make promises you can't keep. Just the email body text, no subject line.`

  return await callGemini(prompt, 200, 0.5)
}

/**
 * Generate ministry recommendation based on quiz answers
 */
async function generateMinistryMatch(answers) {
  const prompt = `You are a ministry advisor at MUTCU (Murang'a University of Technology Christian Union) in Kenya.

Based on a student's quiz answers, recommend the BEST matching MUTCU ministry for them.

Student's answers:
- Passion: ${answers.passion}
- Gifts/Skills: ${answers.gifts}
- Preferred activity: ${answers.activity}
- Personality: ${answers.personality}
- Available time: ${answers.time}

Available MUTCU ministries:
1. Prayer Ministry — intercession, prayer meetings, keshas
2. Music Ministry — choir, praise & worship, band, outreach & production
3. Missions & Evangelism — campus outreach, Hope Ministry, Integral Ministry
4. Bible Study & Training — small groups, BEST-P, discipleship classes
5. Discipleship Ministry — nurturing, accountability groups, years' fellowships
6. Creative Arts (CREAM) — drama, dance, SPARCS (spoken word/poetry), Models Ministry
7. Technical & Media — sound, ushering, publicity (MBBC), digital ministry
8. Hospitality Ministry — welcoming, ushering, member care
9. Welfare Committee — member support, counselling, ladies/gents programs

Respond EXACTLY as JSON:
{
  "primary": "Ministry Name",
  "reason": "2-3 sentence explanation of why this ministry fits them",
  "secondary": "Second best ministry name",
  "secondaryReason": "1-2 sentence explanation",
  "encouragement": "One sentence of personal encouragement"
}`

  const text = await callGemini(prompt, 400, 0.6)
  if (!text) return null

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch (e) {
    console.error('[GEMINI] Failed to parse ministry match JSON:', e.message)
  }
  return null
}

module.exports = {
  callGemini,
  generatePrayerEncouragement,
  generateDailyDevotional,
  generateBlogDraft,
  generateContactReply,
  generateMinistryMatch,
}