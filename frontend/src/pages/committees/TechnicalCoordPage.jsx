import CommitteePage from '../../components/CommitteePage'

// Exact duties from Leadership Manual Part 2.12
const RESPONSIBILITIES = [
  'Shall provide executive oversight and technical direction for the Technical and Media Ministry Committee and all its sub-ministries.',
  'Shall be responsible for ensuring all technical aspects of CU services and events (including sound, visuals, and media production) are executed with excellence.',
  'Shall oversee the CU\'s digital footprint and brand identity across all platforms, ensuring a consistent and positive online presence.',
  'Shall oversee the four sub-ministries: Sound Ministry, Livestream & Video, Projection & Visuals, and Publicity & Design.',
  'Shall ensure seamless technical and media support for all CU activities.',
  'Shall manage the Union\'s social media platforms (Facebook, Instagram, TikTok, YouTube).',
  'Shall collaborate with the Music Ministry for recording and production of music content.',
  'Shall maintain high technical quality in all productions and events.',
]

const DESCRIPTION = [
  "The Technical & Media Ministry Coordinator oversees all technical and digital operations of MUTCU. This office ensures that every service, fellowship, and event is supported by excellent sound, visuals, and media coverage.",
  "From sound engineering and livestreaming to social media management and graphic design, the Technical Coordinator ensures that MUTCU's message reaches both those present and those following online.",
  "As per the MUTCU Leadership Manual 2025, the Technical & Media Ministry's mandate is 'To provide excellent and seamless technical and media support for all CU activities and to manage the Union's digital presence effectively.' The committee comprises four sub-ministries: Sound Ministry, Livestream & Video, Projection & Visuals, and Publicity & Design.",
]

export default function TechnicalCoordPage() {
  return (
    <CommitteePage
      roleSlug="technical"
      heroImage="/assets/images/JOHN.jpeg"
      officeTitle="Technical & Media Ministry Coordinator"
      officeSubtitle="Amplifying the Message Through Technology and Digital Excellence"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.1(xii), MUTCU Constitution 2025"
      leadershipManualRef="Parts 2.12 & 3.7, MUTCU Leadership Manual 2025"
      seoTitle="Technical & Media Ministry Coordinator | MUTCU Executive Council"
      seoDescription="Learn about the Technical & Media Ministry Coordinator of MUTCU — overseeing sound, livestream, projection, publicity, and digital presence."
      fallback={{ name: 'John Mwanthi', role: 'Technical & Media Ministry Coordinator', photo_url: '/assets/images/JOHN.jpeg' }}
    />
  )
}