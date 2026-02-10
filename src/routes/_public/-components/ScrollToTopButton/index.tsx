import { ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export const ScrollToTopButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!showScrollTop) return null

  return (
    <Button
      size="icon"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 rounded-full transition-transform hover:scale-110"
    >
      <ChevronUp className="size-5" />
    </Button>
  )
}
