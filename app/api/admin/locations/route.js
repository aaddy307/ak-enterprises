import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Location from '@/lib/db/models/Location';
import { generateSlug } from '@/lib/slug';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const locations = await Location.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: locations });
  } catch (error) {
    console.error('GET /api/admin/locations error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    if (!body.slug && body.name) {
      body.slug = generateSlug(body.name);
    }

    const location = await Location.create(body);

    return NextResponse.json({ data: location }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/locations error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
