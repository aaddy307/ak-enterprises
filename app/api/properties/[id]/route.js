import { NextResponse } from "next/server";
import { getPropertyById } from "@/lib/properties";

export async function GET(request, { params }) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    return NextResponse.json(
      { success: false, error: "Property not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: property,
  });
}
