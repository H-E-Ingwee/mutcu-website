import MinistryPage from '../../components/MinistryPage'

const ACTIVITIES = [
  { icon: 'fa-heart', title: 'Member Care', description: 'Checking on members\' wellbeing and providing support during difficult times.' },
  { icon: 'fa-hand-holding-heart', title: 'Practical Support', description: 'Organizing practical assistance for members facing financial or material challenges.' },
  { icon: 'fa-birthday-cake', title: 'Celebrations', description: 'Celebrating members\' milestones including birthdays, graduations, and achievements.' },
  { icon: 'fa-hospital', title: 'Sick Visits', description: 'Visiting and supporting members who are unwell or going through difficult circumstances.' },
  { icon: 'fa-users', title: 'Fellowship Building', description: 'Organizing fellowship activities that strengthen bonds and build community among members.' },
  { icon: 'fa-pray', title: 'Intercessory Support', description: 'Praying for members\' personal needs and connecting them with the Prayer Ministry.' },
]

export default function WelfarePage() {
  return (
    <MinistryPage
      slug="welfare-committee"
      heroImage="/assets/images/welfare11.jpg"
      title="Welfare Committee"
      subtitle="Member care, encouragement, support in times of need, and strengthening fellowship as a family."
      icon="fa-hand-holding-heart"
      description={[
        "The Welfare Committee is MUTCU's expression of care and community. We believe that the Church is a family, and families look out for one another — especially in times of need.",
        "From practical support and sick visits to celebrations and fellowship activities, the Welfare Committee ensures that no member of MUTCU feels alone or unsupported. We are committed to building a community where everyone belongs and is cared for.",
      ]}
      activities={ACTIVITIES}
    />
  )
}