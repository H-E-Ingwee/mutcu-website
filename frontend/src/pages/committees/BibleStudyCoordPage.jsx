import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Coordinating all Bible study sessions, trainings, and equipping programs.',
  'Overseeing the Discipleship Committee and its programs.',
  'Developing curriculum and study materials for Bible study groups.',
  'Training and equipping Bible study leaders and facilitators.',
  'Organizing special teaching sessions, seminars, and conferences.',
  'Fostering a culture of Scripture engagement among all members.',
  'Coordinating with FOCUS Kenya for training resources and programs.',
  'Mentoring members toward spiritual maturity and doctrinal soundness.',
]

const DESCRIPTION = [
  "The Bible Study & Training / Discipleship Coordinator oversees one of MUTCU's most foundational ministries — grounding members in the Word of God and nurturing them toward Christ-like maturity.",
  "This office coordinates all Bible study sessions, training programs, and discipleship initiatives, working to ensure that every member of MUTCU is rooted in Scripture and growing in their faith.",
]

export default function BibleStudyCoordPage() {
  return (
    <CommitteePage
      roleSlug="bible-study"
      heroImage="/assets/images/CALEB.jpg"
      officeTitle="Bible Study & Training / Discipleship Coordinator"
      officeSubtitle="Grounding Members in the Word of God"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      fallback={{ name: 'Caleb Esere', role: 'Bible Study & Training / Discipleship Chair', photo_url: '/assets/images/CALEB.jpg' }}
    />
  )
}