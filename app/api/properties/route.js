import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Property from "@/lib/db/models/Property";
import Category from "@/lib/db/models/Category";
import { mapDbPropertyToPublic } from "@/lib/db/utils";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const categorySlug = searchParams.get("category") || searchParams.get("type") || null;
    const subtype = searchParams.get("subtype") || null;
    const location = searchParams.get("location") || null;
    const bhk = searchParams.get("bhk") || null;
    const minPrice = searchParams.get("minPrice")
      ? parseInt(searchParams.get("minPrice"))
      : null;
    const maxPrice = searchParams.get("maxPrice")
      ? parseInt(searchParams.get("maxPrice"))
      : null;

    const query = { status: "active" };

    if (categorySlug) {
      const category = await Category.findOne({
        slug: new RegExp(`^${categorySlug}$`, "i"),
      });
      if (category) {
        query.category = category._id;
      }
    }

    const bedroomConditions = [];

    if (subtype) {
      if (subtype === "villa") {
        bedroomConditions.push({ bedrooms: { $gte: 4 } });
      } else if (subtype === "office") {
        bedroomConditions.push({ bedrooms: { $gt: 0 } });
      } else if (subtype === "retail") {
        bedroomConditions.push({ bedrooms: 0 });
      }
    }

    if (bhk) {
      const bhkNum = parseInt(bhk);
      if (bhk === "4+") {
        bedroomConditions.push({ bedrooms: { $gte: 4 } });
      } else if (!isNaN(bhkNum)) {
        bedroomConditions.push({ bedrooms: bhkNum });
      }
    }

    if (bedroomConditions.length > 0) {
      query.$and = bedroomConditions;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
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
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
