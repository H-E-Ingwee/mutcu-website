import CommitteePage from '../../components/CommitteePage'

// Exact duties from Leadership Manual Part 2.13
const RESPONSIBILITIES = [
  'Shall provide executive oversight and artistic direction for the Creative Arts Ministry Committee.',
  'Shall champion the use of creative arts as a powerful tool for worship, evangelism, and edification within the CU.',
  'Shall oversee and mentor all creative teams, including drama, dance, spoken word, and modelling, ensuring their ministrations are both excellent and biblically sound.',
  'Shall coordinate and oversee Transformation and Advocacy (TLA) campaigns in the Christian Union.',
  'Shall oversee the four sub-ministries: Drama Ministry, Dance Ministry, Spoken Word & Poetry, and Modelling & Fine Arts.',
  'Shall ensure all creative expressions are Christ-centred and communicate the Gospel effectively.',
  'Shall collaborate with the Technical & Media Ministry for productions and events.',
  'Shall develop artists as worshippers and witnesses for Christ.',
]

const DESCRIPTION = [
  "The Creative Arts Ministry Coordinator leads MUTCU's Creative Arts Ministry (CREAM) — a vibrant community of artists, dancers, dramatists, and spoken word artists who communicate the Gospel through creative expression.",
  "This office ensures that creativity is harnessed for the glory of God, using drama, dance, spoken word, film, and other art forms to reach hearts and communicate the transforming message of Christ.",
  "As per the MUTCU Leadership Manual 2025, the Creative Arts Ministry's mandate is 'To use diverse artistic gifts to glorify God, edify the church, and communicate the gospel in a compelling way.' The committee comprises four sub-ministries: Drama Ministry, Dance Ministry, Spoken Word & Poetry, and Modelling & Fine Arts. The coordinator also oversees Transformation and Advocacy (TLA) campaigns.",
]

export default function CreativeCoordPage() {
  return (
    <CommitteePage
      roleSlug="creative"
      heroImage="/assets/images/ESTHER.jpeg"
      officeTitle="Creative Arts Ministry Coordinator"
      officeSubtitle="Communicating the Gospel Through Artistic Excellence"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.1(xiii), MUTCU Constitution 2025"
      leadershipManualRef="Parts 2.13 & 3.6, MUTCU Leadership Manual 2025"
      seoTitle="Creative Arts Ministry Coordinator | MUTCU Executive Council"
      seoDescription="Learn about the Creative Arts Ministry Coordinator of MUTCU — overseeing drama, dance, spoken word, modelling, and Transformation & Advocacy campaigns."
      fallback={{ name: 'Esther Karimeri', role: 'Creative Arts Ministry Coordinator', photo_url: '/assets/images/ESTHER.jpeg' }}
    />
  )
}