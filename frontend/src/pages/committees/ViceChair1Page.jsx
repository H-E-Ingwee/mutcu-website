import CommitteePage from '../../components/CommitteePage'

// Exact duties from Art. 12.9(B)(a) + Leadership Manual Part 2.2
const RESPONSIBILITIES = [
  'Shall assist the Chairperson in their duties and act in their full capacity during their absence, ensuring seamless leadership continuity.',
  'Shall provide executive oversight for the Ladies\' Ministry, championing programs that cater to the unique spiritual, emotional, and social needs of female members.',
  'Shall provide executive oversight for the Hospitality Committee, cultivating a culture of genuine warmth, welcome, and care within the CU.',
  'Shall be directly responsible for the general welfare and pastoral care of all CU leaders, fostering unity and mutual support within the leadership team.',
  'Shall be in charge of the ladies\' discipline.',
  'Shall be a member of the Welfare Committee.',
  'Shall preside over meetings in the absence of the Chairperson.',
]

const DESCRIPTION = [
  "The 1st Vice Chairperson's office plays a crucial supportive role to the Chairperson, assisting in the overall leadership and administration of MUTCU. As constitutionally required, this position is held by a female member when the Chairperson is male, and vice versa — reflecting MUTCU's commitment to gender-balanced leadership.",
  "The 1st Vice Chair is dedicated to upholding the Union's values and actively contributes to the strategic planning and implementation of activities that build spiritual growth among members. She is also in charge of the Hospitality Ministry and Ladies' Ministry, overseeing the nurturing and development of ladies in the Union.",
  "As per Article 12.9(B) of the MUTCU Constitution 2025: 'If the chairperson is a male the first vice chair shall be female and if the chairperson is a female, then the first vice chairperson shall be a male. The first and second vice chairpersons shall not be of the same gender.'",
]

export default function ViceChair1Page() {
  return (
    <CommitteePage
      roleSlug="vice-chair1"
      heroImage="/assets/images/PURITY.jpeg"
      officeTitle="1st Vice Chairperson's Office"
      officeSubtitle="Supporting Leadership with Grace and Purpose"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      constitutionRef="Article 12.9(B)(a), MUTCU Constitution 2025"
      leadershipManualRef="Part 2.2, MUTCU Leadership Manual 2025"
      seoTitle="1st Vice Chairperson's Office | MUTCU Executive Council"
      seoDescription="Learn about the 1st Vice Chairperson's office of MUTCU — constitutional duties including Ladies' Ministry, Hospitality, and leadership welfare."
      fallback={{ name: 'Purity Njeri', role: '1st Vice Chairperson', photo_url: '/assets/images/PURITY.jpeg' }}
    />
  )
}