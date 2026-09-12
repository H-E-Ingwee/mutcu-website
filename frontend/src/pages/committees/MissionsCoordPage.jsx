import CommitteePage from '../../components/CommitteePage'

// Exact duties from Leadership Manual Part 2.9
const RESPONSIBILITIES = [
  'Shall provide executive oversight and strategic direction for the Missions and Evangelism Committee.',
  'Shall develop, implement, and evaluate the CU\'s overall strategy for outreach, both on and off campus.',
  'Shall ensure all outreach teams are well-trained, adequately resourced, and firmly aligned with the CU\'s doctrinal basis.',
  'Shall oversee the planning and execution of the annual mission and major evangelistic events in collaboration with the sub-committees.',
  'Shall mentor the leaders of the Evangelism, Hope Ministry, and Integral Ministry sub-committees.',
  'Shall equip and mobilize the CU to faithfully proclaim the gospel in word and deed, both on campus and beyond.',
  'Shall ensure that every member is engaged in the Great Commission.',
  'Shall coordinate campus-wide and community evangelistic efforts.',
]

const DESCRIPTION = [
  "The Missions & Evangelism Coordinator leads MUTCU's mandate to proclaim the Gospel of Jesus Christ both on campus and beyond. This office mobilizes members for evangelism, outreach, and mission work.",
  "From campus evangelism drives to community outreach and missions trips, this coordinator ensures that MUTCU fulfills its calling to be a witnessing community — sharing the love of Christ in word and deed.",
  "As per the MUTCU Leadership Manual 2025, the Missions & Evangelism Committee operates through three specialized sub-committees: the Evangelism Sub-Committee (campus and off-campus evangelism), the Hope Ministry (compassionate outreach to vulnerable groups), and the Integral Ministry (strategic outreach to high schools and community service).",
]

export default function MissionsCoordPage() {
  return (
    <CommitteePage
      roleSlug="missions"
      heroImage="/assets/images/MUTUKU.jpeg"
      officeTitle="Missions & Evangelism Coordinator"
      officeSubtitle="Mobilizing Members to Faithfully Proclaim the Gospel"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.1(ix), MUTCU Constitution 2025"
      leadershipManualRef="Parts 2.9 & 3.5, MUTCU Leadership Manual 2025"
      seoTitle="Missions & Evangelism Coordinator | MUTCU Executive Council"
      seoDescription="Learn about the Missions & Evangelism Coordinator of MUTCU — leading campus outreach, Hope Ministry, Integral Ministry, and the Great Commission."
      fallback={{ name: 'Mercy Mutuku', role: 'Missions & Evangelism Coordinator', photo_url: '/assets/images/MUTUKU.jpeg' }}
    />
  )
}