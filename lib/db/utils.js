import Category from './models/Category';

export function mapDbPropertyToPublic(dbProp) {
  if (!dbProp) return null;

  // Extract ID
  const idStr = dbProp._id.toString();

  // Map category slug to type
  let type = "residential";
  if (dbProp.category) {
    if (typeof dbProp.category === "object" && dbProp.category.slug) {
      type = dbProp.category.slug.toLowerCase();
    } else if (typeof dbProp.category === "string") {
      type = dbProp.category.toLowerCase();
    }
  }

  // Parse area number and unit
  let areaVal = 0;
  let areaUnit = "sq.ft";
  if (dbProp.area) {
    const areaStr = String(dbProp.area);
    const numMatch = areaStr.match(/^(\d+)/);
    if (numMatch) {
      areaVal = parseInt(numMatch[1]);
    }
    if (areaStr.includes("sq.ft") || areaStr.includes("sqft")) {
      areaUnit = "sq.ft";
    } else if (areaStr.includes("sq.mt") || areaStr.includes("sqmt")) {
      areaUnit = "sq.mt";
    }
  }

  // Generate price display
  let priceDisplay = `₹${dbProp.price}`;
  if (dbProp.price >= 10000000) {
    priceDisplay = `₹${(dbProp.price / 10000000).toFixed(1).replace(/\.0$/, "")} Cr`;
  } else if (dbProp.price >= 100000) {
    priceDisplay = `₹${(dbProp.price / 100000).toFixed(1).replace(/\.0$/, "")} L`;
  }

  // Parse location
  const locationStr = dbProp.location || "Ambernath, MH";
  const locationParts = locationStr.split(",");
  const areaName = locationParts[0]?.trim() || "Ambernath";

  // Determine configuration
  let configuration = "";
  if (type === "commercial") {
    configuration = dbProp.bedrooms > 0 ? "Office Space" : "Retail Space";
  } else {
    configuration = dbProp.bedrooms ? `${dbProp.bedrooms} BHK` : "1 BHK";
  }

  // Determine tag & tagType
  let tag = "Featured";
  let tagType = "primary";
  if (dbProp.price >= 15000000) {
    tag = "Premium";
    tagType = "primary";
  } else if (dbProp.price >= 10000000) {
    tag = "Luxury";
    tagType = "primary";
  } else if (dbProp.status === "new-launch") {
    tag = "New Launch";
    tagType = "secondary";
  } else if (type === "commercial") {
    tag = "Commercial";
    tagType = "tertiary";
  }

  // Parse features
  const featuresObj = {
    bedrooms: dbProp.bedrooms || 0,
    bathrooms: dbProp.bathrooms || 0,
    balconies: 1,
    parking: dbProp.parking !== undefined ? dbProp.parking : 0
  };

  let parsedParking = null;
  if (Array.isArray(dbProp.features)) {
    dbProp.features.forEach(f => {
      const lower = f.toLowerCase();
      if (lower.includes("balcon")) {
        const m = f.match(/(\d+)/);
        if (m) featuresObj.balconies = parseInt(m[1]);
      }
      if (lower.includes("park")) {
        const m = f.match(/(\d+)/);
        if (m) parsedParking = parseInt(m[1]);
      }
    });
  }

  if (dbProp.parking === undefined && parsedParking !== null) {
    featuresObj.parking = parsedParking;
  }

  // Determine possession & rera
  const isReady = dbProp.status !== "new-launch";

  return {
    id: idStr,
    name: dbProp.title,
    tag,
    tagType,
    price: dbProp.price,
    priceDisplay,
    location: {
      area: areaName,
      state: "MH",
      full: locationStr
    },
    type,
    subtype: type === "commercial" ? (dbProp.bedrooms > 0 ? "office" : "retail") : "apartment",
    configuration,
    area: areaVal || 1000,
    areaUnit,
    images: dbProp.images && dbProp.images.length > 0 ? dbProp.images : ["https://lh3.googleusercontent.com/aida-public/AB6AXuBWSwGNtOYvoOYAIot9rVIsPqX3tUlSjkymHtuIpafhKQxuig3UMYIYxmTSw963vLlVudywtnMGtDibHXuK7cYRq0T3C47joUK2qmSNZzve_xRo1ehDSXqEA-0Lf5Wtv7HBcCu9fjMCb2ZxeSBvMz9rKmjjWwkEJnVhADmet1X_O1MUBVX35nMBu2YRWR8aR1radQq1xqV8wX44klSeJTFaDhfUCutHQ_Qrr57fa10IxuFpaF-SZesawbP8ZW_NIWlYZIx3-hpfvzuR"],
    description: dbProp.description,
    features: featuresObj,
    amenities: dbProp.features || [],
    status: dbProp.status === "active" ? "available" : dbProp.status,
    featured: dbProp.price >= 9500000,
    reraRegistered: true,
    possession: isReady ? "Ready to Move" : "Under Construction"
  };
}
