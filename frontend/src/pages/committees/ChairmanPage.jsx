import CommitteePage from '../../components/CommitteePage'

// Exact duties from Art. 12.9(A) MUTCU Constitution 2025 + Leadership Manual Part 2.1
const RESPONSIBILITIES = [
  'Shall provide spiritual oversight and strategic direction to the Christian Union, ensuring all activities align with the vision and mission.',
  'Shall convene and preside over all Executive Council, Annual General, and Special General Meetings with fairness and order.',
  'Shall be the official spokesperson and primary representative of the CU to the university administration, FOCUS Kenya, and other external bodies.',
  'Shall serve as a mandatory signatory to the Union\'s bank account(s), ensuring financial accountability.',
  'Shall oversee leadership development initiatives, ensuring all leaders are equipped and mentored for their roles.',
  'Shall act as the Secretary to the CU\'s Advisory Committee, facilitating effective communication and meetings.',
  'Shall dissolve the Nomination College 21 days after the AGM.',
  'Shall disband the acting Executive Council upon handing over to the initial office bearers.',
  'Shall be the custodian of the MUTCU Constitution.',
  'Shall oversee to ensure harmonious coordination of all ministries of The Christian Union.',
  'Shall chair all AGMs and SGMs.',
  'Shall together with the Secretary attend all internal or external Christian Union meetings.',
]

const DESCRIPTION = [
  "The Chairperson's office is the highest executive position within the Murang'a University of Technology Christian Union. It is responsible for the overall leadership, strategic direction, and spiritual oversight of the Union.",
  "The Chairperson ensures that all activities align with MUTCU's motto, vision, and mission, fostering a Christ-centered environment for all members. He/she presides over Executive Council meetings, represents MUTCU in various forums, and works closely with all dockets and ministries.",
  "As per Article 12.9(A) of the MUTCU Constitution 2025, the Chairperson and the First Vice Chairperson shall not be of the same gender.",
]

export default function ChairmanPage() {
  return (
    <CommitteePage
      roleSlug="chairman"
      heroImage="/assets/images/PADRI.jpeg"
      officeTitle="The Chairperson's Office"
      officeSubtitle="Leading MUTCU with Vision, Faith, and Dedication"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.9(A), MUTCU Constitution 2025"
      leadershipManualRef="Part 2.1, MUTCU Leadership Manual 2025"
      seoTitle="The Chairperson's Office | MUTCU Executive Council"
      seoDescription="Learn about the Chairperson's office of Murang'a University of Technology Christian Union — constitutional duties, responsibilities, and leadership role."
      fallback={{ name: 'Purdri Kihika', role: 'Chairperson', photo_url: '/assets/images/PADRI.jpeg' }}
    />
  )
}