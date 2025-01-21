import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'timetable.json')

// GET endpoint to fetch timetable data
export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8')
    return NextResponse.json(JSON.parse(data))
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
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating timetable data:', error)
    return NextResponse.json(
      { error: 'Failed to update timetable data' },
      { status: 500 }
    )
  }
}