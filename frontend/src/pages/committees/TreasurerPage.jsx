import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Managing and safeguarding all financial resources of the Union.',
  'Maintaining accurate financial records and accounts.',
  'Preparing and presenting financial reports to the Executive Council.',
  'Overseeing the budgeting process and ensuring fiscal discipline.',
  'Approving and processing requisitions from ministry secretaries.',
  'Coordinating with the Resource Mobilization Committee (RMC).',
  'Ensuring transparency and accountability in all financial transactions.',
  'Signing financial documents and cheques on behalf of the Union.',
]

const DESCRIPTION = [
  "The Treasurer's office is responsible for the financial stewardship of MUTCU. The Treasurer manages all Union funds, maintains financial records, and ensures that resources are used responsibly and transparently in service of the Union's mission.",
  "The Treasurer works closely with ministry coordinators and the Resource Mobilization Committee to ensure that all financial needs are met while maintaining strict accountability and proper documentation of all transactions.",
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
      fallback={{ name: 'Mercy Mwaura', role: 'CU Treasurer', photo_url: '/assets/images/MERCY.jpeg' }}
    />
  )
}