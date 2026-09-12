import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Leading and coordinating all corporate prayer activities of the Union.',
  'Organizing prayer meetings, keshas (all-night prayers), and prayer retreats.',
  'Building and maintaining prayer chains and intercession networks.',
  'Fostering a culture of personal and corporate prayer among members.',
  'Coordinating prayer for the Union\'s leadership, programs, and members.',
  'Organizing revival and spiritual awakening programs.',
  'Training members in the discipline and practice of prayer.',
  'Interceding for the university community and the nation.',
]

const DESCRIPTION = [
  "The Prayer Ministry Coordinator leads MUTCU's most vital spiritual discipline — prayer. This office is responsible for cultivating a deep culture of prayer within the Union, from personal devotion to corporate intercession.",
  "The Prayer Coordinator organizes all prayer-related activities including weekly prayer meetings, all-night prayers (keshas), prayer retreats, and revival programs, ensuring that MUTCU remains a praying community.",
]

export default function PrayerCoordPage() {
  return (
    <CommitteePage
      roleSlug="prayer"
      heroImage="/assets/images/MARTHA.jpeg"
      officeTitle="Prayer Ministry Coordinator"
      officeSubtitle="Leading the Union in a Culture of Prayer"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      fallback={{ name: 'Martha Thuku', role: 'Prayer Ministry Coordinator', photo_url: '/assets/images/MARTHA.jpeg' }}
    />
  )
}