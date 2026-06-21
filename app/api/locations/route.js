import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Location from '@/lib/db/models/Location';

export async function GET() {
  try {
    await dbConnect();
    const locations = await Location.find().sort({ name: 1 }).select('name slug').lean();
    return NextResponse.json({ data: locations });
  } catch (error) {
    console.error('GET /api/locations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
