import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Coordinating all creative arts activities including drama, dance, and spoken word.',
  'Leading and overseeing the Creative Arts Ministry (CREAM).',
  'Recruiting and training members in various creative arts disciplines.',
  'Organizing creative arts performances for services and special events.',
  'Ensuring that all creative expressions are Christ-centred and edifying.',
  'Coordinating film, modelling, and other creative media productions.',
  'Fostering creativity and artistic excellence within the Union.',
  'Collaborating with the Technical Ministry for productions and events.',
]

const DESCRIPTION = [
  "The Creative Arts Ministry Coordinator leads MUTCU's Creative Arts Ministry (CREAM) — a vibrant community of artists, dancers, dramatists, and spoken word artists who communicate the Gospel through creative expression.",
  "This office ensures that creativity is harnessed for the glory of God, using drama, dance, spoken word, film, and other art forms to reach hearts and communicate the transforming message of Christ.",
]

export default function CreativeCoordPage() {
  return (
    <CommitteePage
      roleSlug="creative"
      heroImage="/assets/images/ESTHER.jpeg"
      officeTitle="Creative Arts Ministry Coordinator"
      officeSubtitle="Communicating the Gospel Through Creative Expression"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      fallback={{ name: 'Esther Karimeri', role: 'Creative Arts Ministry Coordinator', photo_url: '/assets/images/ESTHER.jpeg' }}
    />
  )
}