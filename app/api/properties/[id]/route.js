import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Property from "@/lib/db/models/Property";
import { mapDbPropertyToPublic } from "@/lib/db/utils";
import { getPropertyById } from "@/lib/properties";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    if (isValidObjectId) {
      await dbConnect();
      const property = await Property.findById(id)
        .populate("category", "name slug")
        .lean();

      if (property) {
        return NextResponse.json({
          success: true,
          data: mapDbPropertyToPublic(property),
        });
      }
    }

    const staticProperty = getPropertyById(id);
    if (staticProperty) {
      return NextResponse.json({
        success: true,
        data: staticProperty,
      });
    }

    return NextResponse.json(
      { success: false, error: "Property not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("GET /api/properties/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
