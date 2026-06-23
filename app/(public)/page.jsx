import { Hero } from "@/components/sections/Hero";
import { PropertyGrid } from "@/components/sections/PropertyGrid";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Categories } from "@/components/sections/Categories";
import dbConnect from "@/lib/db/connect";
import Property from "@/lib/db/models/Property";
import { mapDbPropertyToPublic } from "@/lib/db/utils";

export default async function HomePage() {
  let featuredProperties = [];
  try {
    await dbConnect();
    const dbFeatured = await Property.find({ status: "active", isFeatured: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    featuredProperties = dbFeatured.map(mapDbPropertyToPublic);
  } catch (error) {
    console.error("Failed to fetch featured properties for homepage:", error);
    const { getFeaturedProperties } = await import("@/lib/properties");
    featuredProperties = getFeaturedProperties();
  }

  return (
    <>
      <Hero />
      {featuredProperties.length > 0 && (
        <PropertyGrid
          properties={featuredProperties}
          title="Featured Residences"
          subtitle="Curated Collection"
        />
      )}
      <WhyChooseUs />
      <Categories />
    </>
  );
}
