import MinistryPage from '../../components/MinistryPage'

const ACTIVITIES = [
  { icon: 'fa-praying-hands', title: 'Weekly Prayer Meetings', description: 'Regular corporate prayer sessions where members gather to intercede for the Union, campus, and nation.' },
  { icon: 'fa-moon', title: 'Keshas (All-Night Prayers)', description: 'Powerful all-night prayer sessions that seek God\'s face and invite His presence and revival.' },
  { icon: 'fa-mountain', title: 'Prayer Retreats', description: 'Dedicated retreats for extended prayer, fasting, and seeking God\'s direction for the Union.' },
  { icon: 'fa-link', title: 'Prayer Chains', description: 'Organized prayer chains ensuring continuous intercession for specific needs and requests.' },
  { icon: 'fa-fire', title: 'Revival Programs', description: 'Organizing and participating in revival meetings and spiritual awakening programs.' },
  { icon: 'fa-heart', title: 'Intercessory Prayer', description: 'Dedicated intercession for members\' personal needs, the university, and the nation of Kenya.' },
]

export default function PrayerMinistryPage() {
  return (
    <MinistryPage
      slug="prayer-ministry"
      heroImage="/assets/images/prayer1.jpg"
      title="Prayer Ministry"
      subtitle="Leading the Union into a deep culture of prayer — personal devotion, corporate intercession, and spiritual revival."
      icon="fa-praying-hands"
      description={[
        "The Prayer Ministry is the spiritual engine of MUTCU. We believe that everything we do as a Union must be bathed in prayer, and this ministry leads the way in cultivating a deep, consistent culture of prayer among all members.",
        "From weekly prayer meetings and all-night keshas to prayer retreats and intercession chains, the Prayer Ministry ensures that MUTCU remains a praying community — dependent on God for every step.",
      ]}
      activities={ACTIVITIES}
      coordinatorSlug="prayer"
    />
  )
}