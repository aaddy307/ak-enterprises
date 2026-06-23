import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
} else {
  require('dotenv').config({ path: envPath });
}

// Dynamically import dbConnect and models to ensure env is loaded first
const { default: dbConnect } = await import("../lib/db/connect.js");
const { default: Category } = await import("../lib/db/models/Category.js");
const { default: Property } = await import("../lib/db/models/Property.js");
const { default: Contact } = await import("../lib/db/models/Contact.js");
const { default: SocialMedia } = await import("../lib/db/models/SocialMedia.js");

const propertiesData = require("../data/properties.json");

function parseFeatures(featuresObj) {
  if (!featuresObj) return [];
  const featureStrings = [];
  if (featuresObj.bedrooms) featureStrings.push(`${featuresObj.bedrooms} Bedrooms`);
  if (featuresObj.bathrooms) featureStrings.push(`${featuresObj.bathrooms} Bathrooms`);
  if (featuresObj.balconies) featureStrings.push(`${featuresObj.balconies} Balconies`);
  if (featuresObj.parking) featureStrings.push(`${featuresObj.parking} Parking`);
  if (featuresObj.floors) featureStrings.push(`${featuresObj.floors} Floors`);
  return featureStrings;
}

async function migrateData() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    console.log("\n--- Seeding Categories ---");
    const defaultCategories = [
      { name: "Residential", slug: "residential", description: "Residential properties", icon: "Home" },
      { name: "Commercial", slug: "commercial", description: "Commercial properties", icon: "Building2" },
      { name: "Industrial", slug: "industrial", description: "Industrial properties", icon: "Factory" },
    ];

    const categories = [];
    for (const cat of defaultCategories) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        const created = await Category.create(cat);
        categories.push(created);
        console.log(`Created category: ${cat.name}`);
      } else {
        categories.push(existing);
        console.log(`Category already exists: ${cat.name}`);
      }
    }

    const categoryMap = {};
    categories.forEach((c) => {
      categoryMap[c.slug] = c._id.toString();
    });

    console.log("\n--- Migrating Properties ---");
    const properties = propertiesData.properties || [];

    let migratedCount = 0;
    let skippedCount = 0;

    for (const prop of properties) {
      const title = prop.name || prop.title;
      if (!title) {
        skippedCount++;
        continue;
      }

      const existing = await Property.findOne({ title });
      if (!existing) {
        let categoryId = categories[0]._id;
        if (prop.type) {
          const catSlug = prop.type.toLowerCase();
          if (categoryMap[catSlug]) {
            categoryId = categoryMap[catSlug];
          }
        }

        const locationStr = prop.location?.full || prop.location?.area || prop.location || "";
        const features = parseFeatures(prop.features);

        await Property.create({
          title,
          description: prop.description || "",
          price: prop.price || 0,
          location: typeof locationStr === 'string' ? locationStr : JSON.stringify(locationStr),
          category: categoryId,
          images: prop.images || [],
          status: "active",
          features,
          area: prop.area ? `${prop.area} ${prop.areaUnit || 'sq.ft'}` : "",
          bedrooms: prop.features?.bedrooms || 0,
          bathrooms: prop.features?.bathrooms || 0,
        });
        migratedCount++;
      }
    }
    console.log(`Migrated ${migratedCount} properties`);
    if (skippedCount > 0) console.log(`Skipped ${skippedCount} properties (no title)`);

    console.log("\n--- Creating Default Contact ---");
    const existingContact = await Contact.findOne();
    if (!existingContact) {
      await Contact.create({
        phone: ["+91 98765 43210"],
        email: ["info@akenterprises.com"],
        address: "123 Business Street, City, State 123456",
        workingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
        mapUrl: "",
      });
      console.log("Created default contact info");
    } else {
      console.log("Contact info already exists");
    }

    console.log("\n--- Creating Default Social Media ---");
    const defaultSocialMedia = [
      { platform: "Facebook", url: "https://facebook.com/akenterprises", isActive: true, icon: "Facebook" },
      { platform: "Instagram", url: "https://instagram.com/akenterprises", isActive: true, icon: "Instagram" },
      { platform: "WhatsApp", url: "https://wa.me/919876543210", isActive: true, icon: "WhatsApp" },
    ];

    for (const social of defaultSocialMedia) {
      const existing = await SocialMedia.findOne({ platform: social.platform });
      if (!existing) {
        await SocialMedia.create(social);
        console.log(`Created social media: ${social.platform}`);
      }
    }

    console.log("\n--- Migration Complete ---");
    console.log("Run 'npm run seed-admin' to create the admin user if not already done.");

    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrateData();
