import { Hero } from "@/components/sections/Hero";
import { PropertyGrid } from "@/components/sections/PropertyGrid";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Categories } from "@/components/sections/Categories";
import { getFeaturedProperties } from "@/lib/properties";
import dbConnect from "@/lib/db/connect";
import Property from "@/lib/db/models/Property";
import { mapDbPropertyToPublic } from "@/lib/db/utils";

export default async function HomePage() {
  let featuredProperties = [];
  try {
    await dbConnect();
    const dbFeatured = await Property.find({ status: "active" })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    const mapped = dbFeatured.map(mapDbPropertyToPublic);
    featuredProperties = mapped.filter(p => p.featured).slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch featured properties for homepage:", error);
  }

  if (featuredProperties.length === 0) {
    featuredProperties = getFeaturedProperties();
  }

  return (
    <>
      <Hero />
      <PropertyGrid
        properties={featuredProperties}
        title="Featured Residences"
        subtitle="Curated Collection"
      />
      <WhyChooseUs />
      <Categories />
    </>
  );
}
