import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Category from '@/lib/db/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 }).select('name slug icon').lean();
    return NextResponse.json({ data: categories });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
