require('dotenv').config()

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'groq/compound-mini'

// ─── Full MUTCU Knowledge Base ────────────────────────────────────────────────
const MUTCU_KNOWLEDGE = `
MUTCU (Murang'a University of Technology Christian Union) — Complete Knowledge Base

IDENTITY:
- Full name: Murang'a University of Technology Christian Union (MUTCU)
- Motto: "Inspire Love, Hope and Godliness"
- Vision: To be a model Christian union that cultivates Christ-centeredness among members to positively impact the society.
- Mission: Raising a Christ-like family, equipped in all aspects of life, by encouraging unity as one body and reaching out to non-believers within our community and beyond.
- Core Values: Faith, Love, Hope, Godliness, Accountability, Service
- Affiliation: Fellowship of Christian Unions (FOCUS Kenya)
- Registration: Under the Dean of Students, Murang'a University of Technology
- Location: Murang'a University of Technology, Murang'a County, Kenya

CONTACT & LINKS:
- Email: mutcunion@gmail.com
- Website: mutcu.org
- Member Portal: portal.mutcu.org
- Facebook: https://www.facebook.com/people/Muranga-University-of-Technology-Christian-Union-1/100068859581695/
- Instagram: @muranga_university_cu
- TikTok: @mutcu001
- YouTube: @murangauniversityCU

MEMBERSHIP (Article 8, MUTCU Constitution 2025):
- Full Membership: Open to all registered MUT students who are born again and declare faith in Jesus Christ. Must sign the faith declaration. No membership fee.
- Special Membership: Open to postgraduate and ODL students.
- Associate Membership: Open to former MUTCU graduates who profess Jesus Christ.
- Faith Declaration: "I, in joining this Union, declare my faith in Jesus Christ as my Savior, my Lord and God and it is my desire by the grace of God to live a life consistent with this declaration."
- To join: Visit portal.mutcu.org and register. Secretary approves membership and assigns MUTCU number (format: MUTCU-2026-XXXX).
- First-year students: Can be associate members but cannot be nominated for leadership.
- Finalists: Can nominate but cannot be nominated for leadership.

EXECUTIVE COUNCIL (2025/2026):
- Chairperson: Purdri Kihika
- 1st Vice Chairperson: Purity Njeri
- 2nd Vice Chairperson: David Kimani
- CU Secretary: Faith Wavinya
- Vice Secretary: Natasha Amani
- CU Treasurer: Mercy Mwaura
- Bible Study & Training / Discipleship Chair: Caleb Esere
- Prayer Ministry Coordinator: Martha Thuku
- Missions & Evangelism Coordinator: Mercy Mutuku
- Music Ministry Coordinator: Peter Vaati
- Technical & Media Ministry Coordinator: John Mwanthi
- Creative Arts Ministry Coordinator: Esther Karimeri

PATRON'S OFFICE:
- Patron: Dr. John Ndia
- Assistant to the Patron: Dr. Tabitha Karanja

MINISTRIES (10 total):

1. PRAYER MINISTRY
   Mandate: To mobilize and lead the Christian Union in consistent, fervent, and effective prayer.
   Coordinator: Martha Thuku
   Sub-committees: Prayer Coordinator (Chair), Secretary/Treasurer, Year Prayer Coordinators (Anza FYT, Endelea one, Endelea Two, VUKA FiT), Two Members
   Activities: Weekly prayer meetings, Keshas (all-night prayers), Prayer retreats, Prayer weeks and fasting, Revival programs

2. MUSIC MINISTRY
   Mandate: To lead the congregation in authentic, biblical, and excellent worship through music.
   Coordinator: Peter Vaati
   Sub-ministries: Praise and Worship Ministry, Choir Ministry, Band Ministry, Outreach and Production Ministry
   Meeting times: Choir - Saturdays 2-4pm; Praise & Worship - Tuesdays 7-9pm; Band - Wednesdays 7-9pm

3. MISSIONS & EVANGELISM MINISTRY
   Mandate: To equip and mobilize the CU to faithfully proclaim the gospel in word and deed.
   Coordinator: Mercy Mutuku
   Sub-committees: Evangelism Sub-Committee (with Anza FYT, Endelea, Vuka FiT leaders), Hope Ministry (visits hospitals, prisons, children's homes, rescue centres), Integral Ministry (high school outreach, CSR)

4. BIBLE STUDY & TRAINING MINISTRY
   Mandate: To facilitate systematic spiritual growth through in-depth study of God's Word.
   Coordinator: Caleb Esere
   Programs: Small Bible Study Groups (reviewed Mondays 4pm), BEST-P (Bible Exposition Self Training Program), Consistent Bible Reading (CBR), Bereans, Bible Study Leaders Training

5. DISCIPLESHIP MINISTRY
   Mandate: To intentionally guide members at every stage of their faith journey.
   Coordinator: Caleb Esere
   Programs: Nurturing classes for new believers, Years' Fellowships (Anza FYT, Endelea, VUKA FiT), Accountability groups, Discipleship classes, Baptism coordination

6. CREATIVE ARTS MINISTRY (CREAM)
   Mandate: To use diverse artistic gifts to glorify God, edify the church, and communicate the gospel.
   Coordinator: Esther Karimeri
   Sub-ministries: Drama Ministry, Dance Ministry, SPARCS Ministry (Spoken Word, Poetry, Arts & Creative Skits), Models Ministry (led by Mr. & Miss MUTCU)
   Events: Film Premiere, Mega Play, Christmas Cantata, Creative Night

7. TECHNICAL & MEDIA MINISTRY
   Mandate: To provide excellent technical and media support for all CU activities.
   Coordinator: John Mwanthi
   Sub-ministries: Sound Ministry, Ushering Ministry, Publicity (MBBC) Ministry, Digital Ministry
   Manages: Facebook, Instagram, TikTok, YouTube, website

8. HOSPITALITY MINISTRY
   Mandate: To model the love of Christ by creating a welcoming environment.
   Chairperson: 1st Vice Chairperson (Purity Njeri)
   Composition: Hospitality Leader, Secretary/Treasurer, Two Members
   Activities: Guest welcoming, seating/ushering, refreshments, new member integration, CU office management

9. WELFARE COMMITTEE
   Mandate: To demonstrate Christ's love through practical, emotional, and spiritual support.
   Chairperson: 2nd Vice Chairperson (David Kimani)
   Composition: 1st VP, 2nd VP, CU Treasurer, Secretary/Treasurer, Guidance & Counselling Coordinators, Ladies' Sub-committee, Gents' Sub-committee, Anza FyT Chairperson
   Activities: Member care, practical support, celebrations, sick visits, ladies'/gents' programs, counselling

10. RESOURCE MOBILIZATION COMMITTEE (RMC)
    Mandate: To mobilize financial and material resources for CU programs.
    Chairperson: CU Treasurer (Mercy Mwaura)
    Activities: Fundraising, partnerships, stewardship, resource mobilization

SPECIAL COMMITTEES:
- Advisory Board: Provides spiritual guidance to the Executive Council. Appointed within 3 weeks of EC taking office.
- Auditing Committee: Ensures financial accountability and transparency.
- Associates Committee: Connects MUTCU alumni to the Union.
- Interim Executive Council: Provides leadership during May-August transition period.
- Resource Mobilization Committee (RMC): Mobilizes resources for ministry.

SEPTEMBER-DECEMBER 2026 PROGRAM:
Sunday Services:
- 6 Sep: Academic Excellence (Orientation Department)
- 13 Sep: Bible Study Sunday (Bible Study Dept)
- 20 Sep: God's Redemption Plan (Issa Thuo)
- 27 Sep: Giving (Exec 2024/2025)
- 4 Oct: Hermeneutics (Samuel Namano)
- 11 Oct: Leadership (Daphne Kimani)
- 18 Oct: Mental Health (Becky Wanjiru)
- 25 Oct: The Life and Character of Peter (Samson Muturi)
- 1 Nov: Christian Maturity (Dr. John Ndia)
- 8 Nov: Holy Communion (Dr. Githaiga)
- 15 Nov: Family Genesis (Nancy Oginde)
- 22 Nov: Stewardship (Anne Kimathi)
- 29 Nov: Newmatology (Simon Kande)
- 6 Dec: Purity (James Njuguna)
- 13 Dec: The Man Jesus (Rachel Mwangi)

Friday Services:
- 11 Sep: Bible Study Exposition (CMF/STEM)
- 18 Sep: God's Redemptive Plan (Issa Thuo)
- 25 Sep: Prayer Kesha (Prayer Department)
- 2 Oct: Worship Experience (Music Ministry)
- 9 Oct: Creative Night (Creative Ministry)
- 16 Oct: Living a Balanced Life (Prof Humphrey Kirimi)
- 23 Oct: Prayer Service (Prayer Department)
- 30 Oct: Law and Grace (Jimmy Kidavasi)
- 6 Nov: Integrity (Dr Thuita)
- 13 Nov: Creative Experience (Creative Ministry)
- 20 Nov: Praise Fest (Music Ministry)
- 27 Nov: Newmatology (Simon Kande)
- 4 Dec: Prayer Service (Prayer Department)
- 11 Dec: Christmas Cantata (Creative Ministry)

Special Activities:
- 12 Sep: Church Prayer Stretch & Bible Study Pastor's Training
- 19 Sep: Prayer Walk & Evangelism Training
- 22 Sep: Spacks Ministry
- 26 Sep: Leaders Retreat
- 27 Sep: Accountability Training
- 3 Oct: CREAM Hangout
- 4 Oct: Apologetics Forum
- 17 Oct: Music Training
- 19 Oct: Mbuzi Forum
- 20 Oct: Ladies Retreat
- 28 Oct: Play
- 7 Nov: Leaders Training
- 14 Nov: Prayer Retreat
- 21 Nov: Leaders Prayer Stretch & Ladies Initiative

GOVERNANCE (MUTCU Constitution 2025):
- Three organs: Executive Council, Sub-Committees, Advisory Board
- EC meets at least once a week (quorum: 2/3 of members)
- Terms: One spiritual year; max 2 terms (Chairperson: max 1 term)
- Eligibility: Full member, completed 1 academic year, not a finalist, not in SGC executive
- Nominations: Handled by Nomination College (NC) — 8-stage process
- AGM: Annual General Meeting where new EC is commissioned

DOCTRINAL BASIS (Article 7):
The Christian Union is founded on fundamental truths including: unity of the Trinity, sovereignty of God, divine inspiration of Scripture, universal sinfulness, redemption through Christ's death, bodily resurrection of Christ, work of the Holy Spirit, justification by faith, the universal church, and the return of Christ.

FOCUS KENYA:
MUTCU is affiliated to the Fellowship of Christian Unions (FOCUS Kenya) — a national body connecting university Christian unions across Kenya.

DIGITAL MANAGEMENT SYSTEM (DMS):
- URL: portal.mutcu.org
- Features: Member registration, digital member card with QR code, nomination system, ministry management, analytics, disciplinary management, spiritual calendar, announcements
- Built by: Brian Ingwee (MUTCU DMS Developer)
- Cost: KES 0/month (free tier services)
`

// ─── Core Groq caller ─────────────────────────────────────────────────────────
async function callGroq(messages, maxTokens = 600, temperature = 0.7) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured')

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

// ─── Chatbot ──────────────────────────────────────────────────────────────────
async function chatWithMUTCU(messages) {
  const systemMessage = {
    role: 'system',
    content: `You are the MUTCU Assistant — the official assistant for Murang'a University of Technology Christian Union (MUTCU) in Kenya.

${MUTCU_KNOWLEDGE}

RESPONSE GUIDELINES:
- Be warm, welcoming, and Christ-centred in all responses
- Keep responses concise and helpful (2-4 sentences for simple questions, more for complex ones)
- Format responses as clean plain text — NO markdown stars (*), NO bullet dashes (-), NO hashtags (#)
- Use numbered lists (1. 2. 3.) when listing items
- Use line breaks for readability
- If listing ministries or events, present them clearly without markdown symbols
- Always encourage visitors to join MUTCU and get involved
- For prayer requests, acknowledge warmly and direct to the prayer form on the website
- If you don't know something specific, say so honestly and direct them to contact MUTCU at mutcunion@gmail.com
- Never make up specific facts about people or events not in your knowledge base
- The contact email is mutcunion@gmail.com`
  }

  const text = await callGroq([systemMessage, ...messages.slice(-10)], 700, 0.7)
  // Clean any markdown formatting that slips through
  const cleaned = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/^[-•]\s/gm, '')
    .trim()
  return { reply: cleaned, provider: 'groq' }
}

// ─── Prayer Encouragement ─────────────────────────────────────────────────────
async function generatePrayerEncouragement(prayerRequest, name) {
  const prompt = `A ${name ? `person named ${name}` : 'member'} at MUTCU has submitted this prayer request: "${prayerRequest}"

Write a warm, brief (3-4 sentences), scripture-based encouragement. Include ONE relevant Bible verse with its reference. Be compassionate and uplifting. End with a short prayer sentence. Write in plain text without any markdown formatting, stars, or bullet points.`

  return await callGroq([
    { role: 'system', content: 'You are a compassionate Christian counsellor at MUTCU (Murang\'a University of Technology Christian Union) in Kenya. Write in plain text only, no markdown.' },
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
    { role: 'system', content: 'You are a Christian devotional writer. Always respond with valid JSON only, no markdown.' },
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

Write a complete blog post (400-600 words) with an engaging introduction, 3-4 main sections, practical application for university students, and a conclusion with a call to action. Include Biblical references where appropriate. Write in plain text without markdown formatting.`

  return await callGroq([
    { role: 'system', content: 'You are a Christian blog writer for MUTCU Kenya. Write in plain text, no markdown stars or symbols.' },
    { role: 'user', content: prompt }
  ], 900, 0.7)
}

// ─── Contact Auto-Reply ───────────────────────────────────────────────────────
async function generateContactReply(name, subject, message) {
  const prompt = `Write a brief, warm acknowledgment email for MUTCU. Someone named ${name} sent a message with subject: "${subject}". Write 3-4 sentences thanking them, acknowledging their concern, assuring a response within 2-3 days, and ending with a warm Christian closing. Plain text only.`

  return await callGroq([
    { role: 'system', content: 'You write warm, professional emails for MUTCU Kenya. Plain text only, no markdown.' },
    { role: 'user', content: prompt }
  ], 200, 0.5)
}

// ─── Ministry Match ───────────────────────────────────────────────────────────
async function generateMinistryMatch(answers) {
  const prompt = `Based on a student's answers, recommend the BEST MUTCU ministry.

Student: Passion: ${answers.passion}, Gifts: ${answers.gifts}, Activity: ${answers.activity}, Personality: ${answers.personality}, Time: ${answers.time}

Ministries: Prayer Ministry, Music Ministry, Missions & Evangelism, Bible Study & Training, Discipleship Ministry, Creative Arts (CREAM), Technical & Media, Hospitality Ministry, Welfare Committee, Resource Mobilization Committee (RMC).

Respond as valid JSON only:
{"primary":"Ministry Name","reason":"2-3 sentence explanation","secondary":"Second ministry","secondaryReason":"1-2 sentence explanation","encouragement":"One sentence encouragement"}`

  const text = await callGroq([
    { role: 'system', content: 'You are a ministry advisor at MUTCU. Respond with valid JSON only.' },
    { role: 'user', content: prompt }
  ], 400, 0.6)

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch (e) { console.error('[AI] Ministry match parse error:', e.message) }
  return null
}

// ─── Newsletter Content ───────────────────────────────────────────────────────
async function generateNewsletterContent(blogs, events, customMessage) {
  const blogList = blogs.map(b => `"${b.title}" by ${b.author || 'MUTCU'}`).join(', ')
  const eventList = events.map(e => `${e.title} on ${e.date}`).join(', ')

  const prompt = `Write a warm newsletter email for MUTCU members.
${customMessage ? `Message: ${customMessage}` : ''}
${blogList ? `Featured blogs: ${blogList}` : ''}
${eventList ? `Upcoming events: ${eventList}` : ''}

Write a newsletter (under 300 words) with a warm greeting, brief intro, highlights of the blogs/events, closing encouragement, and sign off as "The MUTCU Team". Plain text only, no markdown.`

  return await callGroq([
    { role: 'system', content: 'You write warm newsletters for MUTCU Kenya. Plain text only.' },
    { role: 'user', content: prompt }
  ], 500, 0.7)
}

function getAvailableProviders() {
  return { groq: !!GROQ_API_KEY, gemini: false, primary: GROQ_API_KEY ? 'groq' : 'none' }
}

module.exports = {
  callGroq,
  chatWithMUTCU,
  generatePrayerEncouragement,
  generateDailyDevotional,
  generateBlogDraft,
  generateContactReply,
  generateMinistryMatch,
  generateNewsletterContent,
  getAvailableProviders,
}