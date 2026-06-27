import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Contact from "@/lib/db/models/Contact";

export async function GET() {
  try {
    await dbConnect();
    const contact = await Contact.findOne().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
