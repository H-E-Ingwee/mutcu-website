import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Overall leadership and strategic direction of the Union.',
  'Ensuring adherence to the MUTCU Constitution and operational policies.',
  'Presiding over all Executive Council meetings and general Union meetings.',
  'Representing MUTCU in external engagements, FOCUS Regional and National Meetings.',
  'Fostering unity, spiritual growth, and accountability among all executive members and ministries.',
  'Signing official documents and correspondence on behalf of the Union.',
  'Casting the deciding vote in the event of a tie during meetings.',
  'Working closely with the Patron and Assistant Patron for guidance and oversight.',
]

const DESCRIPTION = [
  "The Chairman's office is the highest executive position within the Murang'a University of Technology Christian Union. It is responsible for the overall leadership, strategic direction, and spiritual oversight of the Union.",
  "The Chairman ensures that all activities align with MUTCU's motto, vision, and mission, fostering a Christ-centered environment for all members. He presides over Executive Council meetings, represents MUTCU in various forums, and works closely with all dockets and ministries.",
]

export default function ChairmanPage() {
  return (
    <CommitteePage
      roleSlug="chairman"
      heroImage="/assets/images/PADRI.jpeg"
      officeTitle="The Chairman's Office"
      officeSubtitle="Leading MUTCU with Vision, Faith, and Dedication"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      fallback={{ name: 'Purdri Kihika', role: 'Chairman', photo_url: '/assets/images/PADRI.jpeg' }}
    />
  )
}