import CommitteePage from '../../components/CommitteePage'

// Exact duties from Art. 12.9(D) + Leadership Manual Part 2.5
const RESPONSIBILITIES = [
  'Shall be the principal assistant to the Secretary, performing their duties in their absence and supporting all secretarial functions.',
  'Shall be directly responsible for the management, development, and day-to-day operations of the CU Library.',
  'Shall assist the Secretary in handling the logistical aspects of coordinating with guest speakers, such as follow-ups and information sharing.',
  'Shall be responsible for coordinating the speakers for the mid-week fellowship and Sunday services in conjunction with the Secretary.',
  'Shall ensure continuity of administrative functions when the Secretary is unavailable.',
]

const DESCRIPTION = [
  "The Vice Secretary's office supports the Secretary in all administrative functions of the Union. This role ensures continuity and efficiency in the Union's administrative operations.",
  "The Vice Secretary works closely with the Secretary to maintain accurate records, coordinate correspondence, and ensure that all administrative processes run smoothly in service of the Union's mission.",
  "A key responsibility of the Vice Secretary is the management of the CU Library — ensuring members have access to spiritual resources, books, and study materials.",
]

export default function ViceSecretaryPage() {
  return (
    <CommitteePage
      roleSlug="vice-secretary"
      heroImage="/assets/images/AMANI.jpeg"
      officeTitle="The Vice Secretary's Office"
      officeSubtitle="Supporting Administrative Excellence and the CU Library"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.9(D), MUTCU Constitution 2025"
      leadershipManualRef="Part 2.5, MUTCU Leadership Manual 2025"
      seoTitle="The Vice Secretary's Office | MUTCU Executive Council"
      seoDescription="Learn about the Vice Secretary's office of MUTCU — constitutional duties including CU Library management, secretarial support, and speaker coordination."
      fallback={{ name: 'Natasha Amani', role: 'Vice Secretary', photo_url: '/assets/images/AMANI.jpeg' }}
    />
  )
}