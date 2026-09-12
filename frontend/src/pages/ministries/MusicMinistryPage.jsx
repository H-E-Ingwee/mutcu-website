import { useState } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../../components/SEO'
import MinistryPage from '../../components/MinistryPage'
import SectionTitle from '../../components/SectionTitle'
import toast from 'react-hot-toast'

const SUB_MINISTRIES = [
  {
    icon: 'fa-users',
    title: 'Choir',
    image: '/assets/images/music2.jpg',
    description: 'The MUTCU Choir leads congregational singing and presents special hymns and contemporary worship songs. They are dedicated to vocal excellence and harmonious praise, enhancing our services.',
    activities: [
      'Weekly rehearsals for Sunday services and special events.',
      'Learning new songs and arrangements.',
      'Performing during weekly fellowships and major Union events.',
    ],
    meeting: 'Saturdays, 2:00 PM – 4:00 PM (Room 7) — Other times confirmed weekly.',
  },
  {
    icon: 'fa-microphone-alt',
    title: 'Praise & Worship',
    image: '/assets/images/music2.jpg',
    description: 'The team leads the congregation in contemporary worship songs, cultivating an energetic and intimate atmosphere of praise.',
    activities: [
      'Vocal practice and harmony training sessions.',
      'Leading praise and worship during weekly fellowships and Sunday services.',
      'Preparing worship sets for special events like MULEWO and Praise Fests.',
    ],
    meeting: 'Tuesday, 7:00 PM – 9:00 PM (Tuition Block).',
  },
  {
    icon: 'fa-drum',
    title: 'Band',
    image: '/assets/images/band1.jpg',
    description: 'The Band forms the core instrumental support, providing the primary rhythm and melodic foundation for corporate worship.',
    activities: [
      'Regular practice sessions for band members.',
      'Providing instrumental backing for the Praise and Worship team.',
      'Performing during weekly fellowships and special events.',
    ],
    meeting: 'Wednesday, 7:00 PM – 9:00 PM (Confirmed weekly).',
  },
  {
    icon: 'fa-broadcast-tower',
    title: 'Outreach & Production',
    image: '/assets/images/music2.jpg',
    description: 'This ministry supervises music-related responsibilities outside the main music ministry, handles recording and production of music content, and nurtures emerging musical talents through auditions and mentorship.',
    activities: [
      'Conducting singing auditions to identify and train talent.',
      'Recording and producing music content in collaboration with Technical & Media Ministry.',
      'Mentoring aspiring musicians in the Union.',
      'Managing music-related outreach activities.',
    ],
    meeting: 'As scheduled with Technical & Media Ministry.',
  },
]

const FEATURED_EVENTS = [
  { icon: 'fa-star', title: 'Praise Fest', description: 'A special service dedicated to high-energy praise and worship, featuring ministrations from all Music Ministry teams.', when: 'Friday services' },
  { icon: 'fa-holly-berry', title: 'Christmas Cantata', description: 'A collaborative worship experience with the Creative Arts Ministry, celebrating the birth of Jesus through a blend of music and drama.', when: 'December' },
  { icon: 'fa-hand-holding-heart', title: 'Worship Experiences', description: 'Special worship services held throughout the semester, providing opportunities for deep spiritual worship.', when: 'Weekly (Friday Services)' },
  { icon: 'fa-music', title: 'MULEWO', description: 'An all-night worship experience that draws the entire Union together in extended praise, prayer, and musical ministry.', when: 'Semester highlight' },
]

const KEY_RESPONSIBILITIES = [
  { icon: 'fa-cross', title: 'Spiritual Direction', desc: 'Providing spiritual and artistic leadership for the entire music ministry.' },
  { icon: 'fa-check-circle', title: 'Quality Assurance', desc: 'Ensuring overall quality, theological depth, and doctrinal soundness of worship.' },
  { icon: 'fa-users', title: 'Team Mentoring', desc: 'Mentoring and supporting music team leaders for effective ministry.' },
  { icon: 'fa-calendar-check', title: 'Coordination', desc: 'Coordinating the overall music schedule and serving as the link to Executive Council.' },
]

export default function MusicMinistryPage() {
  const [form, setForm] = useState({ name: '', email: '', interest: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.interest) return toast.error('Please fill in all required fields')
    setSubmitting(true)
    // Simulate submission (connect to backend if needed)
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setSubmitting(false)
    toast.success('Thank you for your interest! We will be in touch soon.')
  }

  return (
    <>
      <SEO title="Music Ministry" description="MUTCU Music Ministry" />
      <MinistryPage>
        <div>
          {/* page content */}
        </div>
      </MinistryPage>
    </>
  )
}