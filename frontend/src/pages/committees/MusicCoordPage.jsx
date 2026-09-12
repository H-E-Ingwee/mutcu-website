import CommitteePage from '../../components/CommitteePage'

// Exact duties from Leadership Manual Part 2.8
const RESPONSIBILITIES = [
  'Shall provide executive oversight and spiritual leadership for the Music Committee and all its sub-ministries.',
  'Shall be responsible for ensuring the overall quality, theological depth, and doctrinal soundness of musical worship in the CU.',
  'Shall act as the primary link between the music teams and the Executive Council, representing their needs and providing guidance.',
  'Shall provide spiritual and artistic direction for the entire music ministry.',
  'Shall chair all Music Committee meetings and coordinate the overall music schedule for CU services.',
  'Shall organize joint training and spiritual development sessions for all music teams.',
  'Shall oversee the four sub-ministries: Praise & Worship, Choir, Band, and Outreach & Production.',
  'Shall ensure all worship is theologically sound and glorifying to God.',
]

const DESCRIPTION = [
  "The Music Ministry Coordinator leads one of MUTCU's most visible and impactful ministries. This office oversees all music and worship activities, from the Choir and Band to Praise & Worship teams and the Outreach & Production ministry.",
  "The Music Coordinator ensures that worship in MUTCU is both excellent and spiritually grounded — leading the Union into the presence of God through music that glorifies Christ and edifies the body.",
  "As per the MUTCU Leadership Manual 2025, the Music Committee's mandate is 'To lead the congregation in authentic, biblical, and excellent worship through music.' The committee comprises four sub-ministries: Praise & Worship Ministry, Choir Ministry, Band Ministry, and Outreach & Production Ministry — each with a Coordinator and Assistant Coordinator.",
]

export default function MusicCoordPage() {
  return (
    <CommitteePage
      roleSlug="music"
      heroImage="/assets/images/PETER.jpg"
      officeTitle="Music Ministry Coordinator"
      officeSubtitle="Leading Worship with Excellence, Theological Depth, and Spirit"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.1(viii), MUTCU Constitution 2025"
      leadershipManualRef="Parts 2.8 & 3.3, MUTCU Leadership Manual 2025"
      seoTitle="Music Ministry Coordinator | MUTCU Executive Council"
      seoDescription="Learn about the Music Ministry Coordinator of MUTCU — overseeing Choir, Praise & Worship, Band, and Outreach & Production sub-ministries."
      fallback={{ name: 'Peter Vaati', role: 'Music Ministry Coordinator', photo_url: '/assets/images/PETER.jpg' }}
    />
  )
}