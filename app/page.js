import TimetableApp from '@/components/TimetableApp'

export const metadata = {
  title: 'College Timetable',
  description: 'A simple timetable application for college students',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <TimetableApp />
    </main>
  )
}