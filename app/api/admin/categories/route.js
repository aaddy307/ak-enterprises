import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Category from '@/lib/db/models/Category';
import { generateSlug } from '@/lib/slug';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('GET /api/admin/categories error:', error);
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

    if (!body.slug) {
      body.slug = generateSlug(body.name);
    }

    const category = await Category.create(body);

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A category with this name already exists' },
        { status: 400 }
      );
    }
    console.error('POST /api/admin/categories error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
