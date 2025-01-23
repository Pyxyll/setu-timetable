import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from '@/components/theme-provider'
import { TimetableProvider } from '@/contexts/TimetableContext'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TimetableProvider>
            {children}
          </TimetableProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'SETU Timetable',
  description: 'SETU Timetable Application',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'SETU Timetable',
    statusBarStyle: 'default',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

