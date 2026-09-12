import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Coordinating all evangelism and outreach activities on campus and beyond.',
  'Organizing missions trips, community outreach, and hope ministry visits.',
  'Training members in personal evangelism and witnessing.',
  'Building partnerships with other Christian organizations for outreach.',
  'Coordinating the Union\'s involvement in FOCUS Kenya missions programs.',
  'Mobilizing members for practical involvement in mission work.',
  'Organizing campus evangelism drives and open-air meetings.',
  'Tracking and following up on individuals reached through outreach.',
]

const DESCRIPTION = [
  "The Missions & Evangelism Coordinator leads MUTCU's mandate to proclaim the Gospel of Jesus Christ both on campus and beyond. This office mobilizes members for evangelism, outreach, and mission work.",
  "From campus evangelism drives to community outreach and missions trips, this coordinator ensures that MUTCU fulfills its calling to be a witnessing community — sharing the love of Christ in word and deed.",
]

export default function MissionsCoordPage() {
  return (
    <CommitteePage
      roleSlug="missions"
      heroImage="/assets/images/MUTUKU.jpeg"
      officeTitle="Missions & Evangelism Coordinator"
      officeSubtitle="Mobilizing Members to Proclaim the Gospel"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      fallback={{ name: 'Mercy Mutuku', role: 'Missions & Evangelism Coordinator', photo_url: '/assets/images/MUTUKU.jpeg' }}
    />
  )
}