import MinistryPage from '../../components/MinistryPage'

const ACTIVITIES = [
  { icon: 'fa-door-open', title: 'Guest Welcoming', description: 'Warmly welcoming visitors and new members to all MUTCU services and events.' },
  { icon: 'fa-chair', title: 'Seating & Ushering', description: 'Coordinating seating arrangements and ushering for all Union gatherings.' },
  { icon: 'fa-mug-hot', title: 'Refreshments', description: 'Organizing and serving refreshments at fellowship events and special occasions.' },
  { icon: 'fa-hands-helping', title: 'Member Care', description: 'Ensuring that all members and guests feel welcomed, valued, and at home.' },
  { icon: 'fa-calendar-check', title: 'Event Logistics', description: 'Supporting the logistics and coordination of Union events and programs.' },
  { icon: 'fa-heart', title: 'Fellowship Building', description: 'Creating an atmosphere of warmth and belonging that strengthens community bonds.' },
]

export default function HospitalityPage() {
  return (
    <MinistryPage
      slug="hospitality-ministry"
      heroImage="/assets/images/guest-welcome.jfif"
      title="Hospitality Ministry"
      subtitle="Welcoming guests, coordinating seating and hosting, and ensuring visitors and members feel at home."
      icon="fa-mug-hot"
      description={[
        "The Hospitality Ministry is the welcoming face of MUTCU. We believe that every person who walks through our doors should feel genuinely welcomed, valued, and at home — reflecting the love and warmth of Christ.",
        "From ushering and seating to refreshments and member care, the Hospitality Ministry ensures that every MUTCU gathering is characterized by warmth, order, and genuine Christian fellowship.",
      ]}
      activities={ACTIVITIES}
    />
  )
}