import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

// GET - Retrieve the latest timetable data
export async function GET() {
  try {
    // List all blobs and get the most recent one
    const { blobs } = await list();
    const latestBlob = blobs
      .filter(blob => blob.pathname.startsWith('timetable'))
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];

    if (!latestBlob) {
      return NextResponse.json({ error: 'No timetable data found' }, { status: 404 });
    }

    const response = await fetch(latestBlob.url);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Save new timetable data
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Create a timestamp for versioning
    const timestamp = new Date().toISOString();
    const filename = `timetable-${timestamp}.json`;

    // Upload to Vercel Blob
    const { url } = await put(filename, JSON.stringify(data), {
      access: 'public',
    });

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}