import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Assisting the Chairman in the overall leadership and administration of the Union.',
  'Presiding over meetings in the absence of the Chairman.',
  'Overseeing the welfare and spiritual growth of female members.',
  'Coordinating with ministry coordinators to ensure effective ministry operations.',
  'Representing the Union in relevant external forums and engagements.',
  'Supporting the implementation of the Union\'s strategic plans and programs.',
  'Ensuring gender-sensitive leadership and inclusivity within the Union.',
  'Serving as a link between the Executive Council and the general membership.',
]

const DESCRIPTION = [
  "The 1st Vice Chairperson's office supports the Chairman in the overall leadership of the Union. As constitutionally required, this position is held by a female member, reflecting MUTCU's commitment to gender-balanced leadership.",
  "The 1st Vice Chair plays a vital role in ensuring the smooth running of the Union's activities, presiding over meetings when the Chairman is unavailable, and championing the welfare and spiritual development of all members.",
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
      fallback={{ name: 'Purity Njeri', role: '1st Vice Chairperson', photo_url: '/assets/images/PURITY.jpeg' }}
    />
  )
}