import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Overseeing all technical operations including sound, lighting, and projection.',
  'Managing livestreaming and video coverage of Union events and services.',
  'Coordinating photography and videography for Union activities.',
  'Managing the Union\'s digital platforms, social media, and website.',
  'Designing graphics, posters, and digital content for Union communications.',
  'Maintaining and managing all technical equipment of the Union.',
  'Training members in technical skills and media production.',
  'Ensuring high-quality technical support for all Union programs.',
]

const DESCRIPTION = [
  "The Technical and Media Ministry Coordinator oversees all technical and digital operations of MUTCU. This office ensures that every service, fellowship, and event is supported by excellent sound, visuals, and media coverage.",
  "From sound engineering and livestreaming to social media management and graphic design, the Technical Coordinator ensures that MUTCU's message reaches both those present and those following online.",
]

export default function TechnicalCoordPage() {
  return (
    <CommitteePage
      roleSlug="technical"
      heroImage="/assets/images/JOHN.jpeg"
      officeTitle="Technical & Media Ministry Coordinator"
      officeSubtitle="Amplifying the Message Through Technology"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      fallback={{ name: 'John Mwanthi', role: 'Technical and Media Ministry Coordinator', photo_url: '/assets/images/JOHN.jpeg' }}
    />
  )
}