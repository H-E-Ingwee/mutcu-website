import CommitteePage from '../../components/CommitteePage'

// Exact duties from Leadership Manual Part 2.7
const RESPONSIBILITIES = [
  'Shall provide executive oversight and spiritual direction for the Prayer Committee.',
  'Shall be the lead champion for cultivating a culture of prayer throughout the entire Christian Union.',
  'Shall be responsible for the strategic planning and coordination of all corporate prayer meetings, prayer weeks, fasts, and other prayer-focused events.',
  'Shall plan and coordinate all corporate prayer meetings, prayer weeks, and fasting programs.',
  'Shall identify and communicate key prayer points for the CU.',
  'Shall organize prayer retreats, keshas (all-night prayers), and special prayer events.',
  'Shall mobilize and lead the Christian Union in consistent, fervent, and effective prayer.',
  'Shall oversee Year\'s Fellowship Prayer Coordinators (Anza FYT, Endelea One, Endelea Two, VUKA FiT).',
]

const DESCRIPTION = [
  "The Prayer Ministry Coordinator leads MUTCU's most vital spiritual discipline — prayer. This office is responsible for cultivating a deep culture of prayer within the Union, from personal devotion to corporate intercession.",
  "The Prayer Coordinator organizes all prayer-related activities including weekly prayer meetings, all-night prayers (keshas), prayer retreats, and revival programs, ensuring that MUTCU remains a praying community.",
  "As per the MUTCU Leadership Manual 2025, the Prayer Committee's mandate is 'To mobilize and lead the Christian Union in consistent, fervent, and effective prayer.' The committee includes Year's Fellowship Prayer Coordinators for each year group: Anza FYT, Endelea One, Endelea Two, and VUKA FiT.",
]

export default function PrayerCoordPage() {
  return (
    <CommitteePage
      roleSlug="prayer"
      heroImage="/assets/images/MARTHA.jpeg"
      officeTitle="Prayer Ministry Coordinator"
      officeSubtitle="Leading the Union in a Culture of Consistent, Fervent Prayer"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.1(vii), MUTCU Constitution 2025"
      leadershipManualRef="Parts 2.7 & 3.4, MUTCU Leadership Manual 2025"
      seoTitle="Prayer Ministry Coordinator | MUTCU Executive Council"
      seoDescription="Learn about the Prayer Ministry Coordinator of MUTCU — leading corporate prayer, keshas, prayer retreats, and cultivating a culture of intercession."
      fallback={{ name: 'Martha Thuku', role: 'Prayer Ministry Coordinator', photo_url: '/assets/images/MARTHA.jpeg' }}
    />
  )
}