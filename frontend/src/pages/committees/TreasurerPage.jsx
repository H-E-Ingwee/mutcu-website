import CommitteePage from '../../components/CommitteePage'

// Exact duties from Art. 12.9(E) + Leadership Manual Part 2.6
const RESPONSIBILITIES = [
  'Shall be the chief financial officer of the Christian Union, providing oversight and ensuring the stewardship of all financial resources.',
  'Shall receive and disburse all funds under the direction of the Executive Council, adhering strictly to approved budgets and financial policies.',
  'Shall maintain accurate, transparent, and up-to-date books of accounts using proper accounting procedures.',
  'Shall prepare and present comprehensive semesterly and annual financial reports to the Executive Council and the AGM.',
  'Shall serve as a mandatory signatory to the CU\'s bank account.',
  'Shall maintain the CU\'s official asset register in collaboration with the Asset Manager.',
  'Shall serve as an ex-officio member of the Welfare and Resource Mobilization Committees to provide essential financial guidance.',
  'Shall be the link between the Auditing Committee and the Executive Council.',
  'Shall receive receipts for monies disbursed and preserve vouchers for all monies paid by The CU.',
  'Shall advise the Executive Council on the matters of financial status of The CU.',
]

const DESCRIPTION = [
  "The Treasurer's office is responsible for the financial stewardship of MUTCU. The Treasurer manages all Union funds, maintains financial records, and ensures that resources are used responsibly and transparently in service of the Union's mission.",
  "The Treasurer works closely with ministry coordinators and the Resource Mobilization Committee to ensure that all financial needs are met while maintaining strict accountability and proper documentation of all transactions.",
  "As per Article 12.9(E) of the MUTCU Constitution 2025, the Treasurer shall receive and disburse, under the direction of the Executive Council, all monies belonging to The CU, and shall ensure that proper books of account are always written up, preserved and available for inspection.",
]

export default function TreasurerPage() {
  return (
    <CommitteePage
      roleSlug="treasurer"
      heroImage="/assets/images/MERCY.jpeg"
      officeTitle="The Treasurer's Office"
      officeSubtitle="Faithful Stewardship of Union Resources"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.9(E), MUTCU Constitution 2025"
      leadershipManualRef="Part 2.6, MUTCU Leadership Manual 2025"
      seoTitle="The Treasurer's Office | MUTCU Executive Council"
      seoDescription="Learn about the Treasurer's office of MUTCU — constitutional duties including financial management, bank signatory, asset register, and auditing committee liaison."
      fallback={{ name: 'Mercy Mwaura', role: 'CU Treasurer', photo_url: '/assets/images/MERCY.jpeg' }}
    />
  )
}