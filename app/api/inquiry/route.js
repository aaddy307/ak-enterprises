import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Enquiry from "@/lib/db/models/Enquiry";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, phone, email, interest, message, property, propertyId } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required fields." },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message: (message ? message.trim() : "") || (interest ? `Interested in: ${interest}` : "") || (property ? `Requested callback for property: ${property}` : "General Inquiry callback request"),
      propertyId: propertyId || null,
      propertyTitle: property || "",
      status: "new",
    });

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    console.error("Error in inquiry submission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry. Please try again later." },
      { status: 500 }
    );
  }
}
