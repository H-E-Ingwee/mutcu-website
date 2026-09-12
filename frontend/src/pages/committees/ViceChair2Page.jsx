import CommitteePage from '../../components/CommitteePage'

const RESPONSIBILITIES = [
  'Assisting the Chairman and 1st Vice Chair in the leadership of the Union.',
  'Overseeing the welfare and spiritual growth of male members.',
  'Coordinating men\'s fellowship activities and discipleship programs.',
  'Supporting ministry coordinators in executing their mandates effectively.',
  'Presiding over meetings in the absence of both the Chairman and 1st Vice Chair.',
  'Championing accountability and integrity among male members.',
  'Representing the Union in relevant external engagements.',
  'Fostering brotherhood, mentorship, and spiritual accountability.',
]

const DESCRIPTION = [
  "The 2nd Vice Chairperson's office is a key leadership position within MUTCU's Executive Council. As constitutionally required, this position is held by a male member, complementing the gender-balanced leadership structure.",
  "The 2nd Vice Chair focuses particularly on the welfare and spiritual development of male members, championing brotherhood, accountability, and Christ-centred masculinity within the Union.",
]

export default function ViceChair2Page() {
  return (
    <CommitteePage
      roleSlug="vice-chair2"
      heroImage="/assets/images/DAVID.jpeg"
      officeTitle="2nd Vice Chairperson's Office"
      officeSubtitle="Championing Brotherhood and Accountability"
      description={DESCRIPTION}
      responsibilities={RESPONSIBILITIES}
      fallback={{ name: 'David Kimani', role: '2nd Vice Chairperson', photo_url: '/assets/images/DAVID.jpeg' }}
    />
  )
}