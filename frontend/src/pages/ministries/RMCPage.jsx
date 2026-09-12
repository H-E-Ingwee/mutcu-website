import MinistryPage from '../../components/MinistryPage'

const ACTIVITIES = [
  { icon: 'fa-donate', title: 'Resource Mobilization', description: 'Identifying and mobilizing financial and material resources to support Union programs and activities.' },
  { icon: 'fa-handshake', title: 'Partnership Development', description: 'Building relationships with donors, sponsors, and partners who support MUTCU\'s mission.' },
  { icon: 'fa-chart-line', title: 'Financial Planning', description: 'Supporting the Treasurer in financial planning and budgeting for Union activities.' },
  { icon: 'fa-box-open', title: 'Material Resources', description: 'Mobilizing equipment, materials, and other non-financial resources needed for ministry.' },
  { icon: 'fa-file-invoice', title: 'Fundraising', description: 'Organizing fundraising activities and events to support the Union\'s financial needs.' },
  { icon: 'fa-balance-scale', title: 'Stewardship', description: 'Promoting a culture of faithful stewardship and generosity among all MUTCU members.' },
]

export default function RMCPage() {
  return (
    <MinistryPage
      slug="rmc"
      heroImage="/assets/images/prayer1.jpg"
      title="Resource Mobilization Committee (RMC)"
      subtitle="Stewardship and mobilization of financial and material resources to support ministry work and programs."
      icon="fa-donate"
      description={[
        "The Resource Mobilization Committee (RMC) is responsible for ensuring that MUTCU has the financial and material resources needed to fulfill its mission. We believe that faithful stewardship is an act of worship.",
        "The RMC works to identify funding opportunities, build partnerships with donors and sponsors, and mobilize resources that enable the Union's ministries and programs to operate effectively and sustainably.",
      ]}
      activities={ACTIVITIES}
    />
  )
}