import CommitteePage from '../../components/CommitteePage'

// Exact duties from Art. 12.9(C) + Leadership Manual Part 2.4
const RESPONSIBILITIES = [
  'Shall manage all official correspondence of the Christian Union, acting as the central point for internal and external communication.',
  'Shall be responsible for recording, distributing, and archiving the official minutes of all Executive Council and General Meetings.',
  'Shall maintain the official register of all CU members and other key institutional records, ensuring data accuracy and integrity.',
  'In case of urgent matters where the Executive Council cannot be consulted, the Secretary shall consult the Chairperson and/or the 1st Vice-Chairperson. The decisions reached shall be subject to ratification at the next Executive Council meeting.',
  'Shall coordinate with the Chairperson to officially invite and confirm guest speakers for fellowships and services.',
  'Shall serve as a mandatory signatory to the CU\'s bank account.',
  'Shall help the Vice Secretary on handling The Union\'s library as deemed necessary.',
  'Shall, in consultation with the Chairperson, issue notices conveying all Executive Council meetings and all general meetings of The CU.',
  'Shall together with the Chairperson attend all internal or external Christian Union meetings.',
]

const DESCRIPTION = [
  "The Secretary's office is the administrative backbone of MUTCU. The Secretary is responsible for maintaining the official membership register, recording meeting minutes, and managing all official correspondence of the Union.",
  "As per the MUTCU Constitution (Art. 12.9C), the Secretary is specifically responsible for keeping the register of all registered CU members and the preservation of all records — a mandate now supported by the MUTCU Digital Management System at portal.mutcu.org.",
  "The Secretary serves as a mandatory signatory to the CU's bank account and works closely with the Chairperson to ensure the smooth administrative functioning of the Union.",
]

export default function SecretaryPage() {
  return (
    <CommitteePage
      roleSlug="secretary"
      heroImage="/assets/images/FAITH.jpeg"
      officeTitle="The Secretary's Office"
      officeSubtitle="Ensuring Effective Communication and Record-Keeping"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.9(C), MUTCU Constitution 2025"
      leadershipManualRef="Part 2.4, MUTCU Leadership Manual 2025"
      seoTitle="The Secretary's Office | MUTCU Executive Council"
      seoDescription="Learn about the Secretary's office of MUTCU — constitutional duties including member register, meeting minutes, correspondence, and bank signatory."
      fallback={{ name: 'Faith Wavinya', role: 'CU Secretary', photo_url: '/assets/images/FAITH.jpeg' }}
    />
  )
}