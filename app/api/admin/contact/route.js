import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Contact from '@/lib/db/models/Contact';

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    let contact = await Contact.findOne().sort({ createdAt: -1 });

    if (!contact) {
      contact = await Contact.create({
        phone: [],
        email: [],
        address: '',
        workingHours: '',
        mapUrl: '',
      });
    }

    return NextResponse.json({ data: contact });
  } catch (error) {
    console.error('GET /api/admin/contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    let contact = await Contact.findOne().sort({ createdAt: -1 });

    if (!contact) {
      contact = await Contact.create(body);
    } else {
      contact = await Contact.findByIdAndUpdate(
        contact._id,
        body,
        { returnDocument: 'after', runValidators: true }
      );
    }

    return NextResponse.json({ data: contact });
  } catch (error) {
    console.error('PUT /api/admin/contact error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
