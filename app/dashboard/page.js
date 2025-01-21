'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useTimetableData } from '@/hooks/useTimetableData'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function Dashboard() {
  const { timetableData, isLoading, updateSession, resetToDefault } = useTimetableData()
  const [selectedDay, setSelectedDay] = useState('Monday')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const days = Object.keys(timetableData)

  return (
    <div className="w-full mx-auto p-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <ThemeToggle />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={resetToDefault}
          >
            Reset to Default
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">View Timetable</Link>
          </Button>
        </div>
      </div>

      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Changes are automatically saved to your browser&apos;s storage.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 mb-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Edit Timetable</CardTitle>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timetableData[selectedDay].map((session, index) => (
                <ClassEditor 
                  key={index}
                  session={session}
                  onUpdate={(updatedSession) => {
                    updateSession(selectedDay, index, updatedSession)
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ClassEditor({ session, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentSession, setCurrentSession] = useState(session)

  const handleStatusChange = (status) => {
    const updatedSession = {
      ...currentSession,
      status: status === 'none' ? undefined : status
    }
    setCurrentSession(updatedSession)
    onUpdate(updatedSession)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{session.module}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {session.startTime} - {session.endTime}
            </p>
          </div>
          <div className="flex gap-2">
            <Select 
              value={session.status || 'none'} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Normal</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="slack">Slack Class</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}