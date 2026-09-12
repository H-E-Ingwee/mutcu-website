import SEO from '../../components/SEO'
import MinistryPage from '../../components/MinistryPage'

const ACTIVITIES = [
  { icon: 'fa-bullhorn', title: 'Campus Evangelism', description: 'Regular evangelism drives across the MUT campus, sharing the Gospel with students and staff.' },
  { icon: 'fa-hospital', title: 'Hope Ministry Visits', description: 'Outreach visits to hospitals, children\'s homes, and vulnerable communities around Murang\'a.' },
  { icon: 'fa-globe-africa', title: 'Missions Trips', description: 'Organized missions trips to communities beyond the campus for evangelism and service.' },
  { icon: 'fa-hands-helping', title: 'Community Service', description: 'Practical service projects that demonstrate the love of Christ in tangible ways.' },
  { icon: 'fa-user-plus', title: 'Evangelism Training', description: 'Training members in personal evangelism, witnessing, and sharing their faith effectively.' },
  { icon: 'fa-church', title: 'Church Partnerships', description: 'Collaborating with local churches and Christian organizations for joint outreach initiatives.' },
]

export default function MissionsPage() {
  return (
    <>
    <SEO title="Missions & Evangelism Ministry | MUTCU" description="MUTCU Missions & Evangelism Ministry — campus outreach, Hope Ministry, Integral Ministry, and proclaiming the Gospel at Murang'a University of Technology." url="/ministries/missions-evangelism" />
    <MinistryPage
      slug="missions-evangelism"
      heroImage="/assets/images/mission1.jpg"
      title="Missions & Evangelism Ministry"
      subtitle="Mobilizing members to proclaim the Gospel in word and deed — on campus and beyond — through evangelism and outreach."
      icon="fa-globe"
      description={[
        "The Missions & Evangelism Ministry is MUTCU's frontline for sharing the Gospel. We believe every member is called to be a witness for Christ, and this ministry equips and mobilizes members to fulfill that calling.",
        "From campus evangelism drives and hope ministry visits to organized missions trips and community service, we are committed to proclaiming the love of Christ in both word and deed — on campus and beyond.",
      ]}
      activities={ACTIVITIES}
      coordinatorSlug="missions"
    />
    </>
  )
}