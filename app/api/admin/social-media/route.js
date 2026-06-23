import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import SocialMedia from '@/lib/db/models/SocialMedia';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const socialMedia = await SocialMedia.find().sort({ createdAt: -1 });

    return NextResponse.json({ data: socialMedia });
  } catch (error) {
    console.error('GET /api/admin/social-media error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    const socialMedia = await SocialMedia.create(body);

    return NextResponse.json({ data: socialMedia }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/social-media error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
