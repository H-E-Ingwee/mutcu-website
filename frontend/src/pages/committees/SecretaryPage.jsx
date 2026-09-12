import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Keeping and maintaining the official register of all MUTCU members.',
  'Recording accurate minutes of all Executive Council and general meetings.',
  'Managing official correspondence and communications of the Union.',
  'Maintaining and preserving all Union records and documents.',
  'Issuing notices for meetings and ensuring proper documentation.',
  'Coordinating the membership registration and approval process.',
  'Assigning and tracking MUTCU membership numbers.',
  'Liaising with the DMS administrator for digital record management.',
]

const DESCRIPTION = [
  "The Secretary's office is the administrative backbone of MUTCU. The Secretary is responsible for maintaining the official membership register, recording meeting minutes, and managing all official correspondence of the Union.",
  "As per the MUTCU Constitution (Art. 12.9C), the Secretary is specifically responsible for keeping the register of all registered CU members and the preservation of all records — a mandate now supported by the MUTCU Digital Management System.",
]

export default function SecretaryPage() {
  return (
    <CommitteePage
      roleSlug="secretary"
      heroImage="/assets/images/FAITH.jpeg"
      officeTitle="The Secretary's Office"
      officeSubtitle="The Administrative Backbone of MUTCU"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      fallback={{ name: 'Faith Wavinya', role: 'CU Secretary', photo_url: '/assets/images/FAITH.jpeg' }}
    />
  )
}