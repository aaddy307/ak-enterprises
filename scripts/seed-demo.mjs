import { config } from 'dotenv';
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
  config({ path: envLocalPath });
} else {
  config({ path: envPath });
}

const { default: dbConnect } = await import("../lib/db/connect.js");
const { default: Admin } = await import("../lib/db/models/Admin.js");
const { default: Category } = await import("../lib/db/models/Category.js");
const { default: Property } = await import("../lib/db/models/Property.js");
const { default: Location } = await import("../lib/db/models/Location.js");
const { default: Contact } = await import("../lib/db/models/Contact.js");
const { default: SocialMedia } = await import("../lib/db/models/SocialMedia.js");
const { default: Enquiry } = await import("../lib/db/models/Enquiry.js");

const propertiesData = require("../data/properties.json");

async function seed() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB\n');

    // ── Admin ─────────────────────────────────────────────
    console.log('--- Seeding Admin ---');
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    const existingAdmin = await Admin.findOne({ email: adminEmail?.toLowerCase() });
    if (!existingAdmin) {
      await Admin.create({
        email: adminEmail?.toLowerCase(),
        password: adminPassword,
        name: adminName || 'Admin',
      });
      console.log(`Created admin: ${adminEmail}`);
    } else {
      console.log('Admin already exists');
    }

    // ── Categories ─────────────────────────────────────────
    console.log('\n--- Seeding Categories ---');
    const defaultCategories = [
      { name: 'Residential', slug: 'residential', description: 'Residential properties — apartments, villas, and independent houses for comfortable living.', icon: 'Home' },
      { name: 'Commercial', slug: 'commercial', description: 'Commercial spaces — retail shops, offices, and showrooms for your business needs.', icon: 'Building2' },
      { name: 'Industrial', slug: 'industrial', description: 'Industrial properties — warehouses, factories, and industrial sheds.', icon: 'Factory' },
      { name: 'Agricultural', slug: 'agricultural', description: 'Agricultural land — farms, plantations, and open plots for cultivation.', icon: 'Tractor' },
      { name: 'Plot/Land', slug: 'plot-land', description: 'Residential and commercial plots ready for construction.', icon: 'MapPin' },
    ];

    const categoryMap = {};
    for (const cat of defaultCategories) {
      let record = await Category.findOne({ slug: cat.slug });
      if (!record) {
        record = await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
      categoryMap[cat.slug] = record._id.toString();
    }

    // ── Locations ──────────────────────────────────────────
    console.log('\n--- Seeding Locations ---');
    const defaultLocations = [
      { name: 'Ambernath East', slug: 'ambernath-east', description: 'Prime residential area in eastern Ambernath with excellent connectivity.' },
      { name: 'Ambernath West', slug: 'ambernath-west', description: 'Well-developed western Ambernath with schools, hospitals, and markets.' },
      { name: 'Shiv Mandir Road', slug: 'shiv-mandir-road', description: 'Key commercial corridor with high foot traffic and retail potential.' },
      { name: 'Shivaji Nagar', slug: 'shivaji-nagar', description: 'Established neighbourhood with a mix of residential and commercial properties.' },
      { name: 'Morivali', slug: 'morivali', description: 'Upcoming area with new residential projects and affordable housing options.' },
      { name: 'Ulhasnagar', slug: 'ulhasnagar', description: 'Major township with diverse property options across all budget ranges.' },
      { name: 'Badlapur', slug: 'badlapur', description: 'Fast-growing suburb with scenic surroundings and new development projects.' },
    ];

    for (const loc of defaultLocations) {
      const existing = await Location.findOne({ slug: loc.slug });
      if (!existing) {
        await Location.create(loc);
        console.log(`Created location: ${loc.name}`);
      } else {
        console.log(`Location already exists: ${loc.name}`);
      }
    }

    // ── Properties ─────────────────────────────────────────
    console.log('\n--- Seeding Properties ---');
    const properties = propertiesData.properties || [];
    let propCreated = 0;
    let propSkipped = 0;

    for (const prop of properties) {
      const title = prop.name;
      if (!title) { propSkipped++; continue; }

      const existing = await Property.findOne({ title });
      if (existing) { propSkipped++; continue; }

      const catSlug = prop.type?.toLowerCase();
      const categoryId = categoryMap[catSlug] || categoryMap['residential'];
      const locationStr = prop.location?.full || prop.location?.area || '';
      const features = [];
      if (prop.features) {
        if (prop.features.bedrooms) features.push(`${prop.features.bedrooms} Bedrooms`);
        if (prop.features.bathrooms) features.push(`${prop.features.bathrooms} Bathrooms`);
        if (prop.features.balconies) features.push(`${prop.features.balconies} Balconies`);
        if (prop.features.parking) features.push(`${prop.features.parking} Parking`);
        if (prop.features.floors) features.push(`${prop.features.floors} Floors`);
      }

      await Property.create({
        title,
        description: prop.description || '',
        price: prop.price || 0,
        location: locationStr,
        category: categoryId,
        images: prop.images || [],
        status: prop.status === 'new-launch' || prop.status === 'available' ? 'active' : 'inactive',
        isFeatured: prop.featured || false,
        features,
        area: prop.area ? `${prop.area} ${prop.areaUnit || 'sq.ft'}` : '',
        bedrooms: prop.features?.bedrooms || 0,
        bathrooms: prop.features?.bathrooms || 0,
        parking: prop.features?.parking || 0,
      });
      propCreated++;
    }
    console.log(`Properties: ${propCreated} created, ${propSkipped} skipped`);

    // ── Contact ────────────────────────────────────────────
    console.log('\n--- Seeding Contact ---');
    const existingContact = await Contact.findOne();
    if (!existingContact) {
      await Contact.create({
        phone: ['+91 98765 43210', '+91 98765 43211'],
        email: ['info@akenterprises.com', 'sales@akenterprises.com'],
        address: 'Shop No. 5, Goldmine Plaza, Shiv Mandir Road, Ambernath East, Maharashtra 421501',
        workingHours: 'Mon – Sat: 9:00 AM – 6:00 PM | Sun: 10:00 AM – 2:00 PM',
        mapUrl: 'https://maps.google.com/?q=Ambernath+East+Maharashtra',
      });
      console.log('Created contact info');
    } else {
      console.log('Contact info already exists');
    }

    // ── Social Media ────────────────────────────────────────
    console.log('\n--- Seeding Social Media ---');
    const defaultSocialMedia = [
      { platform: 'Facebook', url: 'https://facebook.com/akenterprises', icon: 'Facebook', isActive: true },
      { platform: 'Instagram', url: 'https://instagram.com/akenterprises', icon: 'Instagram', isActive: true },
      { platform: 'WhatsApp', url: 'https://wa.me/919876543210', icon: 'WhatsApp', isActive: true },
      { platform: 'YouTube', url: 'https://youtube.com/@akenterprises', icon: 'YouTube', isActive: true },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/akenterprises', icon: 'Linkedin', isActive: false },
    ];

    let socialCreated = 0;
    for (const social of defaultSocialMedia) {
      const existing = await SocialMedia.findOne({ platform: social.platform });
      if (!existing) {
        await SocialMedia.create(social);
        socialCreated++;
      }
    }
    console.log(`Social media: ${socialCreated} created, rest skipped`);

    // ── Enquiries ──────────────────────────────────────────
    console.log('\n--- Seeding Enquiries ---');
    const allProperties = await Property.find({}).lean();

    const demoEnquiries = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91 98765 12345',
        message: 'I am interested in this property. Could you please share the detailed floor plan and brochure? Also, let me know about the current offer price.',
        status: 'new',
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@email.com',
        phone: '+91 87654 32109',
        message: 'Looking for a 2 BHK apartment in Ambernath West within 1 Cr budget. Do you have any ready-to-move options? Please share available listings.',
        status: 'new',
      },
      {
        name: 'Amit Verma',
        email: 'amit.verma@email.com',
        phone: '+91 76543 21098',
        message: 'I visited the site last weekend. Impressed with the construction quality. Need assistance with the payment plan and home loan process.',
        status: 'replied',
      },
      {
        name: 'Sneha Joshi',
        email: 'sneha.joshi@email.com',
        phone: '+91 65432 10987',
        message: 'Please send me the price list for available commercial spaces. Looking for a retail shop on ground floor for my clothing boutique.',
        status: 'new',
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        phone: '+91 54321 09876',
        message: 'I already booked a property with you last month. Following up on the registration and legal documentation process.',
        status: 'closed',
      },
    ];

    let enquiryCreated = 0;
    for (const enquiry of demoEnquiries) {
      const property = allProperties.length > 0
        ? allProperties[Math.floor(Math.random() * allProperties.length)]
        : null;

      await Enquiry.create({
        ...enquiry,
        propertyId: property?._id || undefined,
        propertyTitle: property?.title || undefined,
      });
      enquiryCreated++;
    }
    console.log(`Created ${enquiryCreated} demo enquiries`);

    // ── Summary ────────────────────────────────────────────
    const counts = {
      admins: await Admin.countDocuments(),
      categories: await Category.countDocuments(),
      locations: await Location.countDocuments(),
      properties: await Property.countDocuments(),
      enquiries: await Enquiry.countDocuments(),
      socialMedia: await SocialMedia.countDocuments(),
    };

    console.log('\n========================================');
    console.log('  Seed Complete — Database Summary');
    console.log('========================================');
    for (const [key, val] of Object.entries(counts)) {
      console.log(`  ${key.padEnd(15)} ${val}`);
    }
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
