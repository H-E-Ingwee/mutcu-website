require('dotenv').config()

// ─── Groq API (Primary & Only) ────────────────────────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'groq/compound-mini'

// ─── MUTCU System Context ─────────────────────────────────────────────────────
const MUTCU_SYSTEM_CONTEXT = `You are a helpful assistant for MUTCU (Murang'a University of Technology Christian Union) — a Christ-centred, student-led Christian fellowship at Murang'a University of Technology in Kenya, affiliated with FOCUS Kenya.

MUTCU's motto: "Inspire Love, Hope and Godliness."
Vision: To be a model Christian union that cultivates Christ-centeredness among members to positively impact the society.
Mission: Raising a Christ-like family, equipped in all aspects of life, by encouraging unity as one body and reaching out to non-believers within our community and beyond.
Core Values: Faith, Love, Hope, Godliness, Accountability, Service.

Ministries: Prayer Ministry, Music Ministry (Choir, Praise & Worship, Band, Outreach & Production), Missions & Evangelism (Evangelism, Hope Ministry, Integral Ministry), Bible Study & Training (BEST-P, Small Groups, CBR), Discipleship (Nurturing, Years Fellowships, Accountability), Creative Arts/CREAM (Drama, Dance, SPARCS, Models/Mr & Miss MUTCU), Technical & Media (Sound, Ushering, Publicity/MBBC, Digital), Hospitality, Welfare Committee, Resource Mobilization Committee (RMC).

Member Portal: portal.mutcu.org | Website: mutcu.org
Social: Facebook, Instagram (@muranga_university_cu), TikTok (@mutcu001), YouTube (@murangauniversityCU)

Be warm, encouraging, and Christ-centred. Keep answers concise and helpful.`

// ─── Core Groq caller ─────────────────────────────────────────────────────────
async function callGroq(messages, maxTokens = 500, temperature = 0.7) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured on server')

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
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
  const text = result.choices?.[0]?.message?.content || null
  if (!text) throw new Error('Empty response from Groq')
  return text
}

// ─── Convenience wrapper ──────────────────────────────────────────────────────
async function callAI(prompt, maxTokens = 500, temperature = 0.7, systemPrompt = null) {
  const messages = []
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
  messages.push({ role: 'user', content: prompt })
  const text = await callGroq(messages, maxTokens, temperature)
  return { text, provider: 'groq' }
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────
async function chatWithMUTCU(messages) {
  const systemMessage = {
    role: 'system',
    content: `${MUTCU_SYSTEM_CONTEXT}

You are the MUTCU Assistant on the MUTCU website. Your role:
- Answer questions about MUTCU, its ministries, events, leadership, and membership
- Help visitors find the right ministry for them
- Provide information about how to join MUTCU (via portal.mutcu.org)
- Share information about upcoming events and programs
- Offer encouragement and prayer support
- Direct people to the right resources

Guidelines:
- Keep responses concise (2-4 sentences for simple questions)
- Be warm, welcoming, and Christ-centred
- If you don't know something specific, say so honestly and direct them to contact MUTCU at info@mutcu.org
- Never make up specific facts about people or events
- Always encourage visitors to join MUTCU and get involved`
  }

  const text = await callGroq([systemMessage, ...messages.slice(-10)], 600, 0.7)
  return { reply: text, provider: 'groq' }
}

// ─── Prayer Encouragement ─────────────────────────────────────────────────────
async function generatePrayerEncouragement(prayerRequest, name) {
  const prompt = `A ${name ? `person named ${name}` : 'member'} at MUTCU has submitted this prayer request: "${prayerRequest}"

Write a warm, brief (3-4 sentences), scripture-based encouragement.
- Include ONE relevant Bible verse with its reference
- Be compassionate, faith-filled, and uplifting
- End with a short prayer sentence
- Write in a warm, personal tone
- Do not repeat the prayer request back

Just the encouragement text, no headers or labels.`

  return await callGroq([
    { role: 'system', content: 'You are a compassionate Christian counsellor at MUTCU (Murang\'a University of Technology Christian Union) in Kenya.' },
    { role: 'user', content: prompt }
  ], 250, 0.7)
}

// ─── Daily Devotional ─────────────────────────────────────────────────────────
async function generateDailyDevotional(date) {
  const dayOfYear = Math.floor((new Date(date) - new Date(new Date(date).getFullYear(), 0, 0)) / 86400000)
  const themes = ['faith and trust in God', 'prayer and intercession', 'love and fellowship', 'hope in difficult times', 'godliness and holiness', 'service and giving', 'evangelism and mission', 'discipleship and growth', 'worship and praise', "God's word and Bible study", 'leadership and integrity', 'community and unity']
  const theme = themes[dayOfYear % themes.length]

  const prompt = `Write a short daily devotional for MUTCU university students in Kenya. Theme: ${theme}

Respond as valid JSON only (no markdown, no extra text):
{"title":"5-7 word inspiring title","verse":"The exact Bible verse text","reference":"Book Chapter:Verse","reflection":"3-4 sentences practical reflection for university students","prayer":"One sentence closing prayer"}`

  const text = await callGroq([
    { role: 'system', content: 'You are a Christian devotional writer. Always respond with valid JSON only, no markdown formatting.' },
    { role: 'user', content: prompt }
  ], 400, 0.6)

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
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

Write a complete blog post (400-600 words):
- Engaging introduction (2-3 sentences)
- 3-4 main sections with clear points
- Practical application for university students
- Conclusion with a call to action
- Biblical references where appropriate

Write only the blog post body (no title needed):`

  return await callGroq([
    { role: 'system', content: MUTCU_SYSTEM_CONTEXT },
    { role: 'user', content: prompt }
  ], 900, 0.7)
}

// ─── Contact Auto-Reply ───────────────────────────────────────────────────────
async function generateContactReply(name, subject, message) {
  const prompt = `Write a brief, warm acknowledgment email for MUTCU.

Someone named ${name} sent a message with subject: "${subject}"
Their message: "${message.substring(0, 300)}"

Write 3-4 sentences that thank them by name, acknowledge their concern, assure them of a response within 2-3 days, and end with a warm Christian closing. Just the email body text.`

  return await callGroq([
    { role: 'system', content: 'You write warm, professional emails on behalf of MUTCU (Murang\'a University of Technology Christian Union) in Kenya.' },
    { role: 'user', content: prompt }
  ], 200, 0.5)
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

Available MUTCU ministries: Prayer Ministry, Music Ministry, Missions & Evangelism, Bible Study & Training, Discipleship Ministry, Creative Arts (CREAM), Technical & Media, Hospitality Ministry, Welfare Committee, Resource Mobilization Committee (RMC).

Respond as valid JSON only (no markdown):
{"primary":"Exact Ministry Name","reason":"2-3 sentence explanation","secondary":"Second best ministry","secondaryReason":"1-2 sentence explanation","encouragement":"One sentence of personal encouragement"}`

  const text = await callGroq([
    { role: 'system', content: 'You are a ministry advisor at MUTCU. Always respond with valid JSON only, no markdown.' },
    { role: 'user', content: prompt }
  ], 400, 0.6)

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch (e) {
    console.error('[AI] Failed to parse ministry match JSON:', e.message)
  }
  return null
}

// ─── Newsletter Content Generator ─────────────────────────────────────────────
async function generateNewsletterContent(blogs, events, customMessage) {
  const blogList = blogs.map(b => `- "${b.title}" by ${b.author || 'MUTCU'}`).join('\n')
  const eventList = events.map(e => `- ${e.title} on ${e.date}`).join('\n')

  const prompt = `Write a warm, engaging newsletter email for MUTCU (Murang'a University of Technology Christian Union) members.

${customMessage ? `Custom message from admin: ${customMessage}\n` : ''}
${blogList ? `Featured blog posts:\n${blogList}\n` : ''}
${eventList ? `Upcoming events:\n${eventList}\n` : ''}

Write a newsletter with:
- Warm greeting
- Brief intro paragraph
- Highlight the blogs/events naturally
- Closing encouragement
- Sign off as "The MUTCU Team"

Keep it warm, Christ-centred, and under 300 words. Write only the email body.`

  return await callGroq([
    { role: 'system', content: MUTCU_SYSTEM_CONTEXT },
    { role: 'user', content: prompt }
  ], 500, 0.7)
}

// ─── Status check ─────────────────────────────────────────────────────────────
function getAvailableProviders() {
  return {
    groq: !!GROQ_API_KEY,
    gemini: false,
    primary: GROQ_API_KEY ? 'groq' : 'none',
  }
}

module.exports = {
  callAI,
  callGroq,
  chatWithMUTCU,
  generatePrayerEncouragement,
  generateDailyDevotional,
  generateBlogDraft,
  generateContactReply,
  generateMinistryMatch,
  generateNewsletterContent,
  getAvailableProviders,
  MUTCU_SYSTEM_CONTEXT,
}