import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { defaultTimetableData } from '@/data/timetable'

const BLOB_PATH = 'timetable/data.json'

// GET endpoint to fetch timetable data
export async function GET() {
  try {
    const response = await fetch(process.env.BLOB_URL || '')
    
    if (!response.ok) {
      // If no blob exists or can't be fetched, create one with default data
      const json = JSON.stringify(defaultTimetableData)
      const { url } = await put(BLOB_PATH, json, { 
        access: 'public',
        contentType: 'application/json'
      })
      process.env.BLOB_URL = url
      return NextResponse.json(defaultTimetableData)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading timetable data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timetable data' },
      { status: 500 }
    )
  }
}

// PUT endpoint to update timetable data
export async function PUT(request) {
  try {
    const data = await request.json()
    const json = JSON.stringify(data)
    
    // Create new blob with updated data
    const { url } = await put(BLOB_PATH, json, {
      access: 'public',
      contentType: 'application/json'
    })
    
    // Update the URL for future GET requests
    process.env.BLOB_URL = url
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating timetable data:', error)
    return NextResponse.json(
      { error: 'Failed to update timetable data' },
      { status: 500 }
    )
  }
}