import MinistryPage from '../../components/MinistryPage'

const ACTIVITIES = [
  { icon: 'fa-user-friends', title: 'One-on-One Mentorship', description: 'Intentional mentoring relationships pairing mature believers with newer members for spiritual growth.' },
  { icon: 'fa-users', title: 'Small Discipleship Groups', description: 'Small groups focused on accountability, prayer, and mutual encouragement in the faith.' },
  { icon: 'fa-phone', title: 'Follow-Up Ministry', description: 'Following up on new believers and visitors to ensure they are integrated into the community.' },
  { icon: 'fa-book', title: 'Discipleship Resources', description: 'Providing study materials, devotionals, and resources to support personal spiritual growth.' },
  { icon: 'fa-graduation-cap', title: 'Leadership Pipeline', description: 'Identifying and developing future leaders through intentional discipleship and mentorship.' },
  { icon: 'fa-heart', title: 'Spiritual Formation', description: 'Programs focused on developing spiritual disciplines including prayer, fasting, and Scripture study.' },
]

export default function DiscipleshipPage() {
  return (
    <MinistryPage
      slug="discipleship"
      heroImage="/assets/images/BS3.jpg"
      title="Discipleship Ministry"
      subtitle="Nurturing Christ-like maturity through mentorship, follow-up, small groups, and intentional spiritual formation."
      icon="fa-user-friends"
      description={[
        "The Discipleship Ministry is committed to the long-term spiritual growth of every MUTCU member. We believe that becoming like Christ is a lifelong journey that requires intentional relationships, accountability, and consistent spiritual formation.",
        "Through one-on-one mentorship, small discipleship groups, follow-up ministry, and leadership development, we walk alongside members at every stage of their spiritual journey — from new believers to mature leaders.",
      ]}
      activities={ACTIVITIES}
      coordinatorSlug="bible-study"
    />
  )
}