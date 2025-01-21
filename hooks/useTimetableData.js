'use client'

import { useState, useEffect } from 'react'
import { defaultTimetableData } from '@/data/timetable'
import { useToast } from "@/hooks/use-toast"

export function useTimetableData() {
  const [timetableData, setTimetableData] = useState(defaultTimetableData)
  const [isLoading, setIsLoading] = useState(true)

  const { toast } = useToast()

  // Fetch initial data
  useEffect(() => {
    fetchTimetableData()
  }, [])

  const fetchTimetableData = async () => {
    try {
      const response = await fetch('/api/timetable')
      if (!response.ok) throw new Error('Failed to fetch data')
      const data = await response.json()
      setTimetableData(data)
    } catch (error) {
      console.error('Error loading timetable:', error)
      toast({
        title: "Error loading timetable",
        description: "Failed to load the latest timetable data.",
        variant: "destructive",
      })
      // Fallback to default data
      setTimetableData(defaultTimetableData)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSession = async (day, sessionIndex, updatedSession) => {
    // Optimistically update UI
    const newData = {
      ...timetableData,
      [day]: timetableData[day].map((session, index) => 
        index === sessionIndex ? updatedSession : session
      )
    }
    setTimetableData(newData)

    // Send update to API
    try {
      const response = await fetch('/api/timetable', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData)
      })

      if (!response.ok) throw new Error('Failed to save changes')

      toast({
        title: "Changes saved",
        description: "Timetable has been updated successfully.",
      })
    } catch (error) {
      console.error('Error saving changes:', error)
      // Revert changes on error
      fetchTimetableData()
      toast({
        title: "Error saving changes",
        description: "Failed to save your changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetToDefault = async () => {
    try {
      const response = await fetch('/api/timetable', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(defaultTimetableData)
      })

      if (!response.ok) throw new Error('Failed to reset data')

      setTimetableData(defaultTimetableData)
      toast({
        title: "Reset successful",
        description: "Timetable has been reset to default.",
      })
    } catch (error) {
      console.error('Error resetting data:', error)
      toast({
        title: "Error resetting data",
        description: "Failed to reset the timetable. Please try again.",
        variant: "destructive",
      })
    }
  }

  return {
    timetableData,
    isLoading,
    updateSession,
    resetToDefault
  }
}