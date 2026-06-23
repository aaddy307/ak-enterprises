import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import SocialMedia from '@/lib/db/models/SocialMedia';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const socialMedia = await SocialMedia.findById(id);

    if (!socialMedia) {
      return NextResponse.json({ error: 'Social media not found' }, { status: 404 });
    }

    return NextResponse.json({ data: socialMedia });
  } catch (error) {
    console.error('GET /api/admin/social-media/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    const socialMedia = await SocialMedia.findByIdAndUpdate(
      id,
      body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!socialMedia) {
      return NextResponse.json({ error: 'Social media not found' }, { status: 404 });
    }

    return NextResponse.json({ data: socialMedia });
  } catch (error) {
    console.error('PUT /api/admin/social-media/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const socialMedia = await SocialMedia.findByIdAndDelete(id);

    if (!socialMedia) {
      return NextResponse.json({ error: 'Social media not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Social media deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/admin/social-media/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
