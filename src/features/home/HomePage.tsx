import { Architecture } from './components/Architecture'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'

export function HomePage() {
  return (
    <div className="min-w-0 space-y-9 md:space-y-0">
      <Hero />
      <HowItWorks />
      <Architecture />
    </div>
  )
}
