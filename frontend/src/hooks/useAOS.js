import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export function useAOS() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    })
  }, [])
}

export function useScrollTop() {
  const { pathname } = typeof window !== 'undefined' ? window.location : { pathname: '/' }
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}