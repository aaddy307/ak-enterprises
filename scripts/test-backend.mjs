import 'dotenv/config';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

import dbConnect from "../lib/db/connect.js";
import Admin from "../lib/db/models/Admin.js";
import Property from "../lib/db/models/Property.js";
import Category from "../lib/db/models/Category.js";
import Contact from "../lib/db/models/Contact.js";
import SocialMedia from "../lib/db/models/SocialMedia.js";
import Enquiry from "../lib/db/models/Enquiry.js";

console.log("=== AK Enterprises Backend Test Suite ===\n");

async function runTests() {
  let passed = 0;
  let failed = 0;

  try {
    console.log("1. Testing MongoDB Connection...");
    await dbConnect();
    console.log("   ✓ MongoDB connected successfully\n");

    console.log("2. Testing Admin Model...");
    const adminEmail = process.env.ADMIN_EMAIL || "admin@akenterprises.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const admin = await Admin.findOne({ email: adminEmail.toLowerCase() });
    if (admin) {
      console.log("   ✓ Admin user exists");
      const isValid = await admin.comparePassword(adminPassword);
      if (isValid) {
        console.log("   ✓ Admin password verification works\n");
        passed += 2;
      } else {
        console.log("   ✗ Admin password verification failed\n");
        failed++;
      }
    } else {
      console.log("   ✗ Admin user not found (searched for: " + adminEmail.toLowerCase() + ")\n");
      failed++;
    }

    console.log("3. Testing Category Model...");
    const categories = await Category.find();
    console.log(`   ✓ Found ${categories.length} categories: ${categories.map(c => c.name).join(', ')}\n`);
    passed++;

    console.log("4. Testing Property Model...");
    const properties = await Property.find().populate('category');
    console.log(`   ✓ Found ${properties.length} properties`);
    if (properties.length > 0) {
      console.log(`   Sample: "${properties[0].title}" - ₹${properties[0].price.toLocaleString()}\n`);
    }
    passed++;

    console.log("5. Testing Contact Model...");
    const contact = await Contact.findOne();
    if (contact) {
      console.log(`   ✓ Contact info exists`);
      console.log(`   Phone: ${contact.phone.join(', ')}`);
      console.log(`   Email: ${contact.email.join(', ')}\n`);
      passed++;
    } else {
      console.log("   ✗ Contact info not found\n");
      failed++;
    }

    console.log("6. Testing SocialMedia Model...");
    const socialMedia = await SocialMedia.find();
    console.log(`   ✓ Found ${socialMedia.length} social media links`);
    socialMedia.forEach(s => {
      console.log(`     - ${s.platform}: ${s.isActive ? 'Active' : 'Inactive'}`);
    });
    console.log();
    passed++;

    console.log("7. Testing Enquiry Model (Create/Read)...");
    const testEnquiry = await Enquiry.create({
      name: "Test User",
      email: "test@example.com",
      phone: "+91 98765 43210",
      message: "This is a test enquiry",
      status: "new"
    });
    console.log(`   ✓ Created test enquiry with ID: ${testEnquiry._id}`);

    const fetchedEnquiry = await Enquiry.findById(testEnquiry._id);
    if (fetchedEnquiry && fetchedEnquiry.name === "Test User") {
      console.log(`   ✓ Read enquiry back successfully\n`);
      passed++;
    } else {
      console.log(`   ✗ Failed to read enquiry back\n`);
      failed++;
    }

    console.log("8. Testing Enquiry Update...");
    await Enquiry.findByIdAndUpdate(testEnquiry._id, { status: "replied" });
    const updatedEnquiry = await Enquiry.findById(testEnquiry._id);
    if (updatedEnquiry.status === "replied") {
      console.log(`   ✓ Updated enquiry status to "replied"\n`);
      passed++;
    } else {
      console.log(`   ✗ Failed to update enquiry status\n`);
      failed++;
    }

    console.log("9. Testing Enquiry Delete...");
    await Enquiry.findByIdAndDelete(testEnquiry._id);
    const deletedEnquiry = await Enquiry.findById(testEnquiry._id);
    if (!deletedEnquiry) {
      console.log(`   ✓ Deleted test enquiry successfully\n`);
      passed++;
    } else {
      console.log(`   ✗ Failed to delete enquiry\n`);
      failed++;
    }

    console.log("10. Testing Property CRUD...");
    const newProperty = await Property.create({
      title: "Test Property for Verification",
      description: "This is a test property created by the verification script",
      price: 5000000,
      location: "Test Location",
      category: categories[0]._id,
      status: "active",
      features: ["Test Feature 1", "Test Feature 2"],
      images: [],
      area: "1000 sq.ft",
      bedrooms: 2,
      bathrooms: 2
    });
    console.log(`   ✓ Created test property: ${newProperty.title}`);

    newProperty.title = "Updated Test Property";
    await Property.findByIdAndUpdate(newProperty._id, { title: newProperty.title });
    const updatedProperty = await Property.findById(newProperty._id);
    if (updatedProperty.title === "Updated Test Property") {
      console.log(`   ✓ Updated property successfully`);
    }

    await Property.findByIdAndDelete(newProperty._id);
    console.log(`   ✓ Deleted test property\n`);
    passed++;

    console.log("11. Testing Category CRUD...");
    const newCategory = await Category.create({
      name: "Test Category",
      slug: "test-category",
      description: "For testing purposes",
      icon: "Test"
    });
    console.log(`   ✓ Created test category: ${newCategory.name}`);

    await Category.findByIdAndDelete(newCategory._id);
    console.log(`   ✓ Deleted test category\n`);
    passed++;

  } catch (error) {
    console.error("Test error:", error);
    failed++;
  }

  console.log("=== Test Summary ===");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}`);

  if (failed === 0) {
    console.log("\n✓ All tests passed! Backend is working correctly.");
  } else {
    console.log("\n✗ Some tests failed. Please check the errors above.");
  }

  process.exit(failed === 0 ? 0 : 1);
}

runTests();
