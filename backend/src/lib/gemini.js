require('dotenv').config()

// ─── API Keys ─────────────────────────────────────────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

// ─── MUTCU System Context ─────────────────────────────────────────────────────
const MUTCU_SYSTEM_CONTEXT = `You are an AI assistant for MUTCU (Murang'a University of Technology Christian Union) — a Christ-centred, student-led Christian fellowship at Murang'a University of Technology in Kenya, affiliated with FOCUS Kenya.

MUTCU's motto is "Inspire Love, Hope and Godliness."
Vision: To be a model Christian union that cultivates Christ-centeredness among members to positively impact the society.
Mission: Raising a Christ-like family, equipped in all aspects of life, by encouraging unity as one body and reaching out to non-believers within our community and beyond.

Core Values: Faith, Love, Hope, Godliness, Accountability, Service.

Ministries: Prayer Ministry, Music Ministry (Choir, Praise & Worship, Band, Outreach & Production), Missions & Evangelism (Evangelism, Hope Ministry, Integral Ministry), Bible Study & Training (BEST-P, Small Groups, CBR), Discipleship (Nurturing, Years Fellowships, Accountability), Creative Arts/CREAM (Drama, Dance, SPARCS, Models/Mr & Miss MUTCU), Technical & Media (Sound, Ushering, Publicity/MBBC, Digital), Hospitality, Welfare Committee, Resource Mobilization Committee (RMC).

Member Portal: portal.mutcu.org
Website: mutcu.org
Social: Facebook, Instagram (@muranga_university_cu), TikTok (@mutcu001), YouTube (@murangauniversityCU)

Always be warm, encouraging, and Christ-centred in your responses. Keep answers concise and helpful.`

// ─── Core: Call Groq (primary — fast, free) ───────────────────────────────────
async function callGroq(messages, maxTokens = 500, temperature = 0.7) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured')

  // Use compound-mini — clean, fast, no reasoning text
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'groq/compound-mini',
      messages,
      max_tokens: maxTokens,
      temperature,
      stream: false,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Groq API error: ${response.status}`)
  }

  const result = await response.json()
  return result.choices?.[0]?.message?.content || null
}

// ─── Core: Call Gemini (fallback) ─────────────────────────────────────────────
async function callGemini(prompt, maxTokens = 500, temperature = 0.7) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured')

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature, topP: 0.9 },
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

// ─── Smart caller: Groq first, Gemini fallback ────────────────────────────────
async function callAI(prompt, maxTokens = 500, temperature = 0.7, systemPrompt = null) {
  // Try Groq first (faster, more capable)
  if (GROQ_API_KEY) {
    try {
      const messages = []
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
      messages.push({ role: 'user', content: prompt })
      const result = await callGroq(messages, maxTokens, temperature)
      if (result) return { text: result, provider: 'groq' }
    } catch (e) {
      console.warn('[AI] Groq failed, trying Gemini:', e.message)
    }
  }

  // Fallback to Gemini
  if (GEMINI_API_KEY) {
    try {
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
      const result = await callGemini(fullPrompt, maxTokens, temperature)
      if (result) return { text: result, provider: 'gemini' }
    } catch (e) {
      console.warn('[AI] Gemini also failed:', e.message)
    }
  }

  return null
}

// ─── Chatbot: Multi-turn conversation ─────────────────────────────────────────
async function chatWithMUTCU(messages) {
  if (!GROQ_API_KEY && !GEMINI_API_KEY) throw new Error('No AI API key configured')

  const systemMessage = {
    role: 'system',
    content: `${MUTCU_SYSTEM_CONTEXT}

You are the MUTCU AI Assistant — a helpful, warm, and knowledgeable chatbot for the MUTCU website.

Your role:
- Answer questions about MUTCU, its ministries, events, leadership, and membership
- Help visitors find the right ministry for them
- Provide information about how to join MUTCU
- Share information about upcoming events and programs
- Offer encouragement and prayer support
- Direct people to the right resources (portal.mutcu.org for membership, specific ministry pages, etc.)

Guidelines:
- Keep responses concise (2-4 sentences for simple questions, more for complex ones)
- Be warm, welcoming, and Christ-centred
- If you don't know something specific (like exact dates or names), say so honestly and direct them to contact MUTCU
- Never make up specific facts about people or events
- Always encourage visitors to join MUTCU and get involved
- For prayer requests, acknowledge them warmly and encourage them to use the prayer form on the website`
  }

  // Try Groq first
  if (GROQ_API_KEY) {
    try {
      const result = await callGroq([systemMessage, ...messages], 600, 0.7)
      if (result) return { reply: result, provider: 'groq' }
    } catch (e) {
      console.warn('[CHATBOT] Groq failed:', e.message)
    }
  }

  // Fallback to Gemini (single turn with context)
  if (GEMINI_API_KEY) {
    try {
      const lastMessage = messages[messages.length - 1]?.content || ''
      const context = messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n')
      const prompt = `${systemMessage.content}\n\nConversation:\n${context}\n\nRespond as the MUTCU AI Assistant:`
      const result = await callGemini(prompt, 600, 0.7)
      if (result) return { reply: result, provider: 'gemini' }
    } catch (e) {
      console.warn('[CHATBOT] Gemini also failed:', e.message)
    }
  }

  throw new Error('All AI providers failed')
}

// ─── Prayer Encouragement ─────────────────────────────────────────────────────
async function generatePrayerEncouragement(prayerRequest, name) {
  const prompt = `A ${name ? `person named ${name}` : 'member'} at MUTCU (Murang'a University of Technology Christian Union) has submitted this prayer request: "${prayerRequest}"

Write a warm, brief (3-4 sentences), scripture-based encouragement response.
- Include ONE relevant Bible verse (with reference)
- Be compassionate, faith-filled, and uplifting
- Do not be preachy or lecture them
- End with a short prayer sentence
- Write in a warm, personal tone
- Do not repeat the prayer request back to them

Just the encouragement text, no headers or labels.`

  const result = await callAI(prompt, 250, 0.7, MUTCU_SYSTEM_CONTEXT)
  return result?.text || null
}

// ─── Daily Devotional ─────────────────────────────────────────────────────────
async function generateDailyDevotional(date) {
  const dayOfYear = Math.floor((new Date(date) - new Date(new Date(date).getFullYear(), 0, 0)) / 86400000)
  const themes = ['faith and trust in God', 'prayer and intercession', 'love and fellowship', 'hope in difficult times', 'godliness and holiness', 'service and giving', 'evangelism and mission', 'discipleship and growth', 'worship and praise', "God's word and Bible study", 'leadership and integrity', 'community and unity']
  const theme = themes[dayOfYear % themes.length]

  const prompt = `Write a short daily devotional for MUTCU (Murang'a University of Technology Christian Union) students in Kenya.
Theme: ${theme}

Format your response as valid JSON only:
{
  "title": "5-7 word inspiring title",
  "verse": "The exact Bible verse text",
  "reference": "Book Chapter:Verse",
  "reflection": "3-4 sentences practical reflection for university students",
  "prayer": "One sentence closing prayer"
}`

  const result = await callAI(prompt, 400, 0.6)
  if (!result?.text) return null

  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch (e) {
    console.error('[AI] Failed to parse devotional JSON:', e.message)
  }
  return null
}

// ─── Blog Draft ───────────────────────────────────────────────────────────────
async function generateBlogDraft(title, topic, tone = 'devotional') {
  const prompt = `Write a ${tone} blog post for MUTCU (Murang'a University of Technology Christian Union) in Kenya.

Title: "${title}"
Topic/Focus: ${topic || title}
Tone: ${tone}

Write a complete blog post (400-600 words):
- Engaging introduction (2-3 sentences)
- 3-4 main sections with clear points
- Practical application for university students
- Conclusion with a call to action
- Biblical references where appropriate

Write only the blog post body (no title needed):`

  const result = await callAI(prompt, 900, 0.7, MUTCU_SYSTEM_CONTEXT)
  return result?.text || null
}

// ─── Contact Auto-Reply ───────────────────────────────────────────────────────
async function generateContactReply(name, subject, message) {
  const prompt = `Write a brief, warm acknowledgment email for MUTCU (Murang'a University of Technology Christian Union).

Someone named ${name} sent a message with subject: "${subject}"
Their message: "${message.substring(0, 300)}"

Write 3-4 sentences that:
- Thank them by name
- Acknowledge their specific subject/concern
- Assure them someone will respond within 2-3 days
- End with a warm Christian closing

Just the email body text, no subject line.`

  const result = await callAI(prompt, 200, 0.5, MUTCU_SYSTEM_CONTEXT)
  return result?.text || null
}

// ─── Ministry Match ───────────────────────────────────────────────────────────
async function generateMinistryMatch(answers) {
  const prompt = `Based on a student's answers, recommend the BEST MUTCU ministry for them.

Student's answers:
- Passion: ${answers.passion}
- Gifts/Skills: ${answers.gifts}
- Preferred activity: ${answers.activity}
- Personality: ${answers.personality}
- Available time: ${answers.time}

Available MUTCU ministries:
1. Prayer Ministry — intercession, prayer meetings, keshas, prayer retreats
2. Music Ministry — choir, praise & worship, band, outreach & production
3. Missions & Evangelism — campus outreach, Hope Ministry (hospitals/prisons), Integral Ministry (high schools)
4. Bible Study & Training — small groups, BEST-P, Consistent Bible Reading
5. Discipleship Ministry — nurturing new believers, accountability groups, years' fellowships
6. Creative Arts (CREAM) — drama, dance, SPARCS (spoken word/poetry), Models Ministry (Mr & Miss MUTCU)
7. Technical & Media — sound, ushering, publicity (MBBC), digital ministry
8. Hospitality Ministry — welcoming guests, ushering, member care
9. Welfare Committee — member support, counselling, ladies/gents programs
10. Resource Mobilization Committee (RMC) — fundraising, partnerships, stewardship

Respond as valid JSON only:
{
  "primary": "Exact Ministry Name",
  "reason": "2-3 sentence explanation of why this ministry fits them",
  "secondary": "Second best ministry name",
  "secondaryReason": "1-2 sentence explanation",
  "encouragement": "One sentence of personal encouragement"
}`

  const result = await callAI(prompt, 500, 0.6, MUTCU_SYSTEM_CONTEXT)
  if (!result?.text) return null

  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch (e) {
    console.error('[AI] Failed to parse ministry match JSON:', e.message)
  }
  return null
}

// ─── Check which providers are available ──────────────────────────────────────
function getAvailableProviders() {
  return {
    groq: !!GROQ_API_KEY,
    gemini: !!GEMINI_API_KEY,
    primary: GROQ_API_KEY ? 'groq' : GEMINI_API_KEY ? 'gemini' : 'none',
  }
}

module.exports = {
  callAI,
  callGroq,
  callGemini,
  chatWithMUTCU,
  generatePrayerEncouragement,
  generateDailyDevotional,
  generateBlogDraft,
  generateContactReply,
  generateMinistryMatch,
  getAvailableProviders,
  MUTCU_SYSTEM_CONTEXT,
}