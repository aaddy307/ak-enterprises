import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envLocalPath)) {
  config({ path: envLocalPath });
} else {
  config({ path: envPath });
}

// Dynamically import dbConnect and Admin to ensure env is loaded first
const { default: dbConnect } = await import("../lib/db/connect.js");
const { default: Admin } = await import("../lib/db/models/Admin.js");

async function seedAdmin() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;

    const normalizedEmail = email.toLowerCase();
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      console.log(`Admin user with email "${email}" already exists in the database.`);
      process.exit(0);
    }

    const admin = await Admin.create({
      email: normalizedEmail,
      password: password, // Will be auto-hashed by Mongoose pre-save hook
      name: name,
    });

    console.log("Admin user created successfully:");
    console.log(`  Email: ${admin.email}`);
    console.log(`  Name: ${admin.name}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();

