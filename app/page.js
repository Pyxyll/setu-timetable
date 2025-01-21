import { Suspense } from 'react'
import TimetableApp from '@/components/TimetableApp'

export default function Home() {
  return (
    <main>
      <Suspense fallback={
        <div className="w-full mx-auto p-4">
          <div className="h-screen flex items-center justify-center">
            <div className="text-lg">Loading schedule...</div>
          </div>
        </div>
      }>
        <TimetableApp />
      </Suspense>
    </main>
  )
}