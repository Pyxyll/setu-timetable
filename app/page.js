import { Suspense } from 'react'
import TimetableApp from '@/components/TimetableApp'

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <TimetableApp />
      </Suspense>
    </main>
  )
}