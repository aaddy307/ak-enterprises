import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Property from "@/lib/db/models/Property";
import Category from "@/lib/db/models/Category";
import { mapDbPropertyToPublic } from "@/lib/db/utils";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    // Support both `category` (slug from filter sidebar) and legacy `type` param
    const categorySlug = searchParams.get("category") || searchParams.get("type") || null;
    const location = searchParams.get("location") || null;
    const bhk = searchParams.get("bhk") || null;
    const minPrice = searchParams.get("minPrice")
      ? parseInt(searchParams.get("minPrice"))
      : null;
    const maxPrice = searchParams.get("maxPrice")
      ? parseInt(searchParams.get("maxPrice"))
      : null;
    const status = searchParams.get("status") || null;

    // Build DB query
    const query = { status: "active" };

    if (categorySlug) {
      const category = await Category.findOne({
        slug: new RegExp(`^${categorySlug}$`, "i"),
      });
      if (category) {
        query.category = category._id;
      }
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (bhk) {
      const bhkNum = parseInt(bhk);
      if (bhk === "4+") {
        query.bedrooms = { $gte: 4 };
      } else if (!isNaN(bhkNum)) {
        query.bedrooms = bhkNum;
      }
    }

    if (minPrice !== null && maxPrice !== null) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== null) {
      query.price = { $gte: minPrice };
    } else if (maxPrice !== null) {
      query.price = { $lte: maxPrice };
    }

    const properties = await Property.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = properties.map(mapDbPropertyToPublic);

    return NextResponse.json({
      success: true,
      data: mapped,
      meta: {
        total: mapped.length,
      },
    });
  } catch (error) {
    console.error("GET /api/properties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
