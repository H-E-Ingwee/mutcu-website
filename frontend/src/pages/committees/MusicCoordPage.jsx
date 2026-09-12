import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Coordinating all music and worship activities of the Union.',
  'Leading and overseeing the Choir, Band, and Praise & Worship teams.',
  'Recruiting, training, and developing musicians and worship leaders.',
  'Ensuring excellence and spiritual integrity in all worship expressions.',
  'Coordinating music for Sunday services, Friday fellowships, and special events.',
  'Managing rehearsal schedules and music ministry logistics.',
  'Fostering a culture of worship and musical excellence in the Union.',
  'Identifying and nurturing musical talent among MUTCU members.',
]

const DESCRIPTION = [
  "The Music Ministry Coordinator leads one of MUTCU's most visible and impactful ministries. This office oversees all music and worship activities, from the Choir and Band to Praise & Worship teams and instrumentalists.",
  "The Music Coordinator ensures that worship in MUTCU is both excellent and spiritually grounded — leading the Union into the presence of God through music that glorifies Christ and edifies the body.",
]

export default function MusicCoordPage() {
  return (
    <CommitteePage
      roleSlug="music"
      heroImage="/assets/images/PETER.jpg"
      officeTitle="Music Ministry Coordinator"
      officeSubtitle="Leading Worship with Excellence and Spirit"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      fallback={{ name: 'Peter Vaati', role: 'Music Ministry Coordinator', photo_url: '/assets/images/PETER.jpg' }}
    />
  )
}