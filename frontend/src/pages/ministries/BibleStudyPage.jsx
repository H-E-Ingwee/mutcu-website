import SEO from '../../components/SEO'
import MinistryPage from '../../components/MinistryPage'

const ACTIVITIES = [
  { icon: 'fa-book-open', title: 'Weekly Bible Studies', description: 'Regular in-depth Bible study sessions covering books of the Bible, doctrine, and Christian living.' },
  { icon: 'fa-chalkboard-teacher', title: 'Trainings & Seminars', description: 'Equipping members through specialized training programs on leadership, evangelism, and spiritual disciplines.' },
  { icon: 'fa-users', title: 'Small Groups', description: 'Intimate small group Bible studies for deeper fellowship and accountability among members.' },
  { icon: 'fa-graduation-cap', title: 'FOCUS Programs', description: 'Participating in FOCUS Kenya training programs, camps, and equipping conferences.' },
  { icon: 'fa-bible', title: 'Scripture Memorization', description: 'Programs to encourage and support members in memorizing and meditating on Scripture.' },
  { icon: 'fa-hands-helping', title: 'Discipleship Integration', description: 'Connecting Bible study with practical discipleship and mentorship relationships.' },
]


      slug="bible-study"
      heroImage="/assets/images/bs1.jpg"
      title="Bible Study & Training Ministry"
      subtitle="Deepening spiritual growth through Bible study, doctrine, trainings, and equipping programs for all members."
      icon="fa-book-open"
      description={[
        "The Bible Study & Training Ministry is the doctrinal and educational heart of MUTCU. We believe that a strong foundation in Scripture is essential for every believer, and we are committed to providing rich, in-depth Bible teaching for all members.",
        "From weekly Bible studies and small groups to specialized training programs and FOCUS Kenya conferences, this ministry equips members to know God's Word, live by it, and share it with others.",
      ]}
      activities={ACTIVITIES}
      coordinatorSlug="bible-study"
    />
    </>
  )
}