import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
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
    startupImage: [
      '/apple-splash-2048-2732.png',
      '/apple-splash-1668-2224.png',
      '/apple-splash-1536-2048.png',
      '/apple-splash-1125-2436.png',
      '/apple-splash-1242-2208.png',
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}