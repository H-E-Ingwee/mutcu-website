import CommitteePage from '../../components/CommitteePage'

// Exact duties from Art. 12.9(B)(b) + Leadership Manual Part 2.3
const RESPONSIBILITIES = [
  'Shall assist the Chairperson in the absence of the First Vice-Chairperson.',
  'Shall provide executive oversight for the Gents\' Ministry, fostering spiritual growth, brotherhood, and accountability among male members.',
  'Shall serve as the Chairperson of the Welfare Committee, providing strategic direction and oversight to all its functions.',
  'Shall be the custodian of the Leadership Manual, ensuring their provisions are understood and upheld by all leaders.',
  'Shall draft and coordinate the programs for Friday and Sunday services, working with all relevant ministries to ensure services are impactful, edifying, and well-managed.',
  'Shall organize leadership development forums and trainings for The Union\'s leaders.',
  'Shall be in charge of the special activities of The Christian Union.',
  'Shall be in charge of the gents\' discipline.',
  'Shall be a member of the Associates Committee.',
]

const DESCRIPTION = [
  "The 2nd Vice Chairperson's office is a key leadership position within MUTCU's Executive Council. As constitutionally required, this position is held by a male member when the 1st Vice Chair is female — complementing the gender-balanced leadership structure.",
  "The 2nd Vice Chair focuses particularly on the welfare and spiritual development of male members, championing brotherhood, accountability, and Christ-centred masculinity within the Union. He also serves as the Chairperson of the Welfare Committee and is the custodian of the Leadership Manual.",
  "As per Article 12.9(B)(b) of the MUTCU Constitution 2025, the 2nd Vice Chair shall draft and/or oversee and coordinate the Friday and Sunday service programs to ensure effective time management.",
]

export default function ViceChair2Page() {
  return (
    <CommitteePage
      roleSlug="vice-chair2"
      heroImage="/assets/images/DAVID.jpeg"
      officeTitle="2nd Vice Chairperson's Office"
      officeSubtitle="Championing Brotherhood, Accountability & Service Programs"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.9(B)(b), MUTCU Constitution 2025"
      leadershipManualRef="Part 2.3, MUTCU Leadership Manual 2025"
      seoTitle="2nd Vice Chairperson's Office | MUTCU Executive Council"
      seoDescription="Learn about the 2nd Vice Chairperson's office of MUTCU — constitutional duties including Gents' Ministry, Welfare Committee, and service program coordination."
      fallback={{ name: 'David Kimani', role: '2nd Vice Chairperson', photo_url: '/assets/images/DAVID.jpeg' }}
    />
  )
}