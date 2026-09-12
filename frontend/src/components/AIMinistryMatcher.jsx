import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import toast from 'react-hot-toast'

const MINISTRY_LINKS = {
  'Prayer Ministry': '/ministries/prayer-ministry',
  'Music Ministry': '/ministries/music-ministry',
  'Missions & Evangelism': '/ministries/missions-evangelism',
  'Bible Study & Training': '/ministries/bible-study',
  'Discipleship Ministry': '/ministries/discipleship',
  'Creative Arts (CREAM)': '/ministries/creative-arts',
  'Technical & Media': '/ministries/technical-department',
  'Hospitality Ministry': '/ministries/hospitality-ministry',
  'Welfare Committee': '/ministries/welfare-committee',
  'Resource Mobilization Committee': '/ministries/rmc',
}

const MINISTRY_ICONS = {
  'Prayer Ministry': 'fa-praying-hands',
  'Music Ministry': 'fa-music',
  'Missions & Evangelism': 'fa-globe',
  'Bible Study & Training': 'fa-book-open',
  'Discipleship Ministry': 'fa-user-friends',
  'Creative Arts (CREAM)': 'fa-theater-masks',
  'Technical & Media': 'fa-photo-video',
  'Hospitality Ministry': 'fa-mug-hot',
  'Welfare Committee': 'fa-hand-holding-heart',
  'Resource Mobilization Committee': 'fa-donate',
}

const QUESTIONS = [
  {
    id: 'passion',
    question: 'What are you most passionate about?',
    icon: 'fa-heart',
    options: [
      'Praying and interceding for others',
      'Worshipping God through music',
      'Sharing the Gospel and reaching the lost',
      'Teaching and studying the Bible',
      'Mentoring and discipling others',
      'Creative expression — drama, dance, art',
      'Technology, media, and digital content',
      'Welcoming and caring for people',
      'Supporting members in need',
      'Mobilizing resources for ministry',
    ],
  },
  {
    id: 'gifts',
    question: 'What are your main gifts or skills?',
    icon: 'fa-star',
    options: [
      'Intercession and spiritual sensitivity',
      'Musical talent (singing, instruments, production)',
      'Evangelism and communication',
      'Teaching, research, and biblical knowledge',
      'Mentorship and pastoral care',
      'Acting, dancing, writing, or creative arts',
      'Sound engineering, design, or IT',
      'Hospitality, organization, and people skills',
      'Counselling and emotional support',
      'Fundraising, networking, and administration',
    ],
  },
  {
    id: 'activity',
    question: 'Which activity excites you most?',
    icon: 'fa-bolt',
    options: [
      'Leading a prayer meeting or kesha',
      'Performing in a worship service or concert',
      'Going on an outreach or mission trip',
      'Facilitating a Bible study group',
      'Walking with a new believer through nurturing',
      'Performing in a drama, dance, or spoken word',
      'Managing sound, livestream, or social media',
      'Welcoming guests and making people feel at home',
      'Visiting a sick member or organizing welfare support',
      'Planning a fundraising event for the CU',
    ],
  },
  {
    id: 'personality',
    question: 'How would you describe yourself?',
    icon: 'fa-user',
    options: [
      'Deeply spiritual and prayerful',
      'Creative and musically gifted',
      'Bold, outgoing, and evangelistic',
      'Studious, analytical, and Word-focused',
      'Patient, nurturing, and relational',
      'Artistic, expressive, and imaginative',
      'Technical, detail-oriented, and innovative',
      'Warm, welcoming, and hospitable',
      'Compassionate, empathetic, and caring',
      'Strategic, organized, and resourceful',
    ],
  },
  {
    id: 'time',
    question: 'How much time can you commit weekly?',
    icon: 'fa-clock',
    options: [
      '1-2 hours (minimal commitment)',
      '3-5 hours (moderate commitment)',
      '6-10 hours (significant commitment)',
      'As much as needed (full commitment)',
    ],
  },
]

export default function AIMinistryMatcher() {
  const [step, setStep] = useState(0) // 0 = intro, 1-5 = questions, 6 = loading, 7 = result
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const currentQ = QUESTIONS[step - 1]
  const progress = step === 0 ? 0 : Math.round((step / QUESTIONS.length) * 100)

  const selectAnswer = (value) => {
    const newAnswers = { ...answers, [currentQ.id]: value }
    setAnswers(newAnswers)

    if (step < QUESTIONS.length) {
      setStep(step + 1)
    } else {
      submitQuiz(newAnswers)
    }
  }

  const submitQuiz = async (finalAnswers) => {
    setStep(QUESTIONS.length + 1) // loading
    setLoading(true)
    try {
      const res = await api.post('/ai/ministry-match', finalAnswers)
      setResult(res.match)
      setStep(QUESTIONS.length + 2) // result
    } catch (err) {
      toast.error('Failed to get recommendation. Please try again.')
      setStep(QUESTIONS.length)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStep(0)
    setAnswers({})
    setResult(null)
  }

  // Intro
  if (step === 0) {
    return (
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-orange/20 flex items-center justify-center mx-auto mb-5">
          <i className="fas fa-robot text-orange text-3xl" />
        </div>
        <h3 className="font-montserrat font-black text-navy text-2xl mb-3">Find Your Ministry</h3>
        <p className="text-gray-500 leading-relaxed mb-6 max-w-md mx-auto">
          Answer 5 quick questions and our AI will recommend the MUTCU ministry that best matches your gifts, passion, and personality.
        </p>
        
        <button onClick={() => setStep(1)} className="btn-primary btn-lg mx-auto">
          <i className="fas fa-play" /> Start the Quiz
        </button>
      </div>
    )
  }

  // Loading
  if (step === QUESTIONS.length + 1) {
    return (
      <div className="text-center py-10">
        <div className="relative w-20 h-20 mx-auto mb-5">
          <div className="w-20 h-20 rounded-full border-4 border-orange/20 border-t-orange animate-spin" />
          <i className="fas fa-robot text-orange text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="font-montserrat font-bold text-navy text-lg mb-2">Analysing your answers...</h3>
        <p className="text-gray-400 text-sm">Gemini AI is finding your perfect ministry match</p>
      </div>
    )
  }

  // Result
  if (step === QUESTIONS.length + 2 && result) {
    const primaryLink = Object.entries(MINISTRY_LINKS).find(([k]) => result.primary?.includes(k.split(' ')[0]))?.[1] || '/ministries'
    const secondaryLink = Object.entries(MINISTRY_LINKS).find(([k]) => result.secondary?.includes(k.split(' ')[0]))?.[1] || '/ministries'
    const primaryIcon = Object.entries(MINISTRY_ICONS).find(([k]) => result.primary?.includes(k.split(' ')[0]))?.[1] || 'fa-star'
    const secondaryIcon = Object.entries(MINISTRY_ICONS).find(([k]) => result.secondary?.includes(k.split(' ')[0]))?.[1] || 'fa-star'

    return (
      <div>
        

        {/* Primary Match */}
        <div className="bg-navy rounded-2xl p-6 mb-4" data-aos="zoom-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center flex-shrink-0">
              <i className={`fas ${primaryIcon} text-orange text-xl`} />
            </div>
            <div>
              <div className="text-orange text-xs font-montserrat font-bold uppercase tracking-wider">Best Match</div>
              <h4 className="font-montserrat font-black text-white text-xl">{result.primary}</h4>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">{result.reason}</p>
          <Link to={primaryLink} className="btn-primary btn-sm">
            <i className="fas fa-arrow-right" /> Explore {result.primary}
          </Link>
        </div>

        {/* Secondary Match */}
        {result.secondary && (
          <div className="bg-gray-50 rounded-2xl p-5 mb-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                <i className={`fas ${secondaryIcon} text-teal`} />
              </div>
              <div>
                <div className="text-teal text-xs font-montserrat font-bold uppercase tracking-wider">Also Consider</div>
                <h5 className="font-montserrat font-bold text-navy">{result.secondary}</h5>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">{result.secondaryReason}</p>
            <Link to={secondaryLink} className="text-teal text-sm font-semibold hover:underline flex items-center gap-1">
              Learn more <i className="fas fa-arrow-right text-xs" />
            </Link>
          </div>
        )}

        {/* Encouragement */}
        {result.encouragement && (
          <div className="bg-orange/5 border border-orange/20 rounded-2xl p-4 mb-5">
            <p className="text-navy text-sm italic leading-relaxed">
              <i className="fas fa-quote-left text-orange mr-2 text-xs" />
              {result.encouragement}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={reset} className="btn-outline btn-sm flex-1 justify-center">
            <i className="fas fa-redo" /> Retake Quiz
          </button>
          <Link to="/register" className="btn-primary btn-sm flex-1 justify-center">
            <i className="fas fa-user-plus" /> Join MUTCU
          </Link>
        </div>

        
      </div>
    )
  }

  // Question
  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-xs font-montserrat font-semibold">Question {step} of {QUESTIONS.length}</span>
          <span className="text-orange text-xs font-montserrat font-bold">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-orange rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
            <i className={`fas ${currentQ.icon} text-orange text-sm`} />
          </div>
          <h4 className="font-montserrat font-bold text-navy text-lg">{currentQ.question}</h4>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {currentQ.options.map((option, i) => (
          <button key={i} onClick={() => selectAnswer(option)}
            className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-100 hover:border-orange hover:bg-orange/5 text-gray-700 text-sm font-medium transition-all hover:text-navy group">
            <span className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-orange flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-400 group-hover:text-orange transition-colors">
                {String.fromCharCode(65 + i)}
              </span>
              {option}
            </span>
          </button>
        ))}
      </div>

      {/* Back button */}
      {step > 1 && (
        <button onClick={() => setStep(step - 1)} className="mt-4 text-gray-400 text-sm hover:text-gray-600 flex items-center gap-1">
          <i className="fas fa-chevron-left text-xs" /> Back
        </button>
      )}
    </div>
  )
}