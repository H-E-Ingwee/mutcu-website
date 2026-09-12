import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Assisting the Secretary in all administrative duties and record-keeping.',
  'Recording minutes in the absence of the Secretary.',
  'Supporting the management of official Union correspondence.',
  'Helping maintain the membership register and Union documents.',
  'Coordinating logistics for meetings and Union events.',
  'Assisting in the preparation and distribution of meeting notices.',
  'Supporting the Secretary in membership registration processes.',
  'Ensuring continuity of administrative functions when the Secretary is unavailable.',
]

const DESCRIPTION = [
  "The Vice Secretary's office supports the Secretary in all administrative functions of the Union. This role ensures continuity and efficiency in the Union's administrative operations.",
  "The Vice Secretary works closely with the Secretary to maintain accurate records, coordinate correspondence, and ensure that all administrative processes run smoothly in service of the Union's mission.",
]

export default function ViceSecretaryPage() {
  return (
    <CommitteePage
      roleSlug="vice-secretary"
      heroImage="/assets/images/AMANI.jpeg"
      officeTitle="The Vice Secretary's Office"
      officeSubtitle="Supporting Administrative Excellence"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      fallback={{ name: 'Natasha Amani', role: 'Vice Secretary', photo_url: '/assets/images/AMANI.jpeg' }}
    />
  )
}