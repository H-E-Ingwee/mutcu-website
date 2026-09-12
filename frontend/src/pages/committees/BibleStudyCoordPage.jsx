import CommitteePage from '../../components/CommitteePage'

// Exact duties from Leadership Manual Part 2.10 + 2.11
const RESPONSIBILITIES = [
  'Shall provide oversight and educational leadership for the Bible Study and Training Committee.',
  'Shall be responsible for the overall strategy and health of the CU\'s small group Bible studies.',
  'Shall oversee the BEST-P (Bible Exposition Self Training Program) and ensure its effective administration.',
  'Shall champion a culture of consistent, personal Bible reading among members.',
  'Shall be the link between the Executive Council and the Bible Study and Training Committee.',
  'Shall provide oversight and spiritual direction for the Discipleship Committee.',
  'Shall be responsible for developing and maintaining a comprehensive spiritual growth pathway for all members, from new believers to mature disciples.',
  'Shall oversee the Nurturing classes for new believers, ensuring they are effectively integrated into the CU.',
  'Shall provide guidance and support to the Years\' Fellowships and Accountability groups.',
  'Shall be the link between the Executive Council and the Discipleship Committee.',
]

const DESCRIPTION = [
  "The Bible Study & Training / Discipleship Coordinator oversees two of MUTCU's most foundational ministries — grounding members in the Word of God and nurturing them toward Christ-like maturity.",
  "This office coordinates all Bible study sessions, training programs, and discipleship initiatives, working to ensure that every member of MUTCU is rooted in Scripture and growing in their faith. A key program under this office is the BEST-P (Bible Exposition Self Training Program).",
  "As per the MUTCU Leadership Manual 2025, this coordinator is responsible for developing a comprehensive spiritual growth pathway for all members — from new believers through Nurturing classes to mature disciples in Accountability groups.",
]

export default function BibleStudyCoordPage() {
  return (
    <CommitteePage
      roleSlug="bible-study"
      heroImage="/assets/images/CALEB.jpg"
      officeTitle="Bible Study & Training / Discipleship Coordinator"
      officeSubtitle="Grounding Members in the Word and Nurturing Spiritual Growth"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.1(x)(xi), MUTCU Constitution 2025"
      leadershipManualRef="Parts 2.10 & 2.11, MUTCU Leadership Manual 2025"
      seoTitle="Bible Study & Discipleship Coordinator | MUTCU Executive Council"
      seoDescription="Learn about the Bible Study, Training and Discipleship Coordinator of MUTCU — overseeing BEST-P, small groups, nurturing classes, and spiritual growth programs."
      fallback={{ name: 'Caleb Esere', role: 'Bible Study & Training / Discipleship Chair', photo_url: '/assets/images/CALEB.jpg' }}
    />
  )
}