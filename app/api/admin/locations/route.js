import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Location from '@/lib/db/models/Location';

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const locations = await Location.find().sort({ name: 1 });

    return NextResponse.json({ data: locations });
  } catch (error) {
    console.error('GET /api/admin/locations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    if (!body.slug) {
      body.slug = generateSlug(body.name);
    }

    const location = await Location.create(body);

    return NextResponse.json({ data: location }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/locations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
