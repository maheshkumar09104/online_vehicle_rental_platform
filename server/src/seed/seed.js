// Fix DNS resolution for mongodb+srv on restricted networks (e.g. ISP that blocks SRV lookups)
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Models — require after dotenv so DB is not connected at import time
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

// ── Sample vehicles ───────────────────────────────────────────────────────────
const sampleVehicles = [
  {
    name: 'Tesla Model 3',
    brand: 'Tesla',
    type: 'car',
    pricePerDay: 5500,
    seats: 5,
    fuelType: 'Electric',
    imageUrl:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
    isAvailable: true,
    description:
      'High-performance luxury electric sedan with autopilot, premium sound system, and exceptional range.',
  },
  {
    name: 'BMW 3 Series Sedan',
    brand: 'BMW',
    type: 'car',
    pricePerDay: 4800,
    seats: 5,
    fuelType: 'Petrol',
    imageUrl:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
    isAvailable: true,
    description:
      'Dynamic sports sedan offering precision handling, luxurious leather interior, and responsive turbocharged power.',
  },
  {
    name: 'Toyota RAV4 Hybrid',
    brand: 'Toyota',
    type: 'suv',
    pricePerDay: 3500,
    seats: 5,
    fuelType: 'Hybrid',
    imageUrl:
      'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=900&q=80',
    isAvailable: true,
    description:
      'Reliable, fuel-efficient compact SUV perfect for family trips, equipped with AWD and modern safety tech.',
  },
  {
    name: 'Range Rover Sport',
    brand: 'Land Rover',
    type: 'suv',
    pricePerDay: 9500,
    seats: 7,
    fuelType: 'Diesel',
    imageUrl:
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=900&q=80',
    isAvailable: true,
    description:
      'Ultimate luxury all-terrain SUV with commanding presence, panoramic sunroof, and unmatched prestige.',
  },
  {
    name: 'Ducati Panigale V2',
    brand: 'Ducati',
    type: 'bike',
    pricePerDay: 6000,
    seats: 2,
    fuelType: 'Petrol',
    imageUrl:
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80',
    isAvailable: true,
    description:
      'Italian superbike masterpiece offering thrilling acceleration, race ergonomics, and unmistakable sound.',
  },
  {
    name: 'Harley-Davidson Iron 883',
    brand: 'Harley-Davidson',
    type: 'bike',
    pricePerDay: 3200,
    seats: 2,
    fuelType: 'Petrol',
    imageUrl:
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80',
    isAvailable: true,
    description:
      'Iconic stripped-down cruiser style with authentic rumbling V-Twin engine, perfect for highway adventures.',
  },
  {
    name: 'Mercedes-Benz Sprinter Passenger',
    brand: 'Mercedes-Benz',
    type: 'van',
    pricePerDay: 7500,
    seats: 12,
    fuelType: 'Diesel',
    imageUrl:
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=80',
    isAvailable: true,
    description:
      'Spacious executive passenger van with standing headroom, dual-zone climate control, and supreme comfort.',
  },
  {
    name: 'Ford Transit Custom',
    brand: 'Ford',
    type: 'van',
    pricePerDay: 4500,
    seats: 8,
    fuelType: 'Diesel',
    imageUrl:
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
    isAvailable: true,
    description:
      'Versatile touring van with generous luggage room, smooth driving dynamics, and intuitive navigation.',
  },
];

// ── Main seed function ────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not set. Aborting.');
    }

    // Log only the host — never print the full URI (contains password)
    let hostDisplay = 'unknown';
    try {
      // mongodb+srv://user:pass@cluster.mongodb.net/db  →  cluster.mongodb.net
      hostDisplay = new URL(mongoUri).hostname;
    } catch (_) {
      hostDisplay = mongoUri.split('@')[1]?.split('/')[0] || 'unknown';
    }
    console.log(`[Seed] Connecting to MongoDB host: ${hostDisplay}`);

    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected successfully.');

    // ── Admin account (idempotent) ──────────────────────────────────────────
    const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    if (!adminEmail || !adminPassword) {
      console.warn(
        '[Seed] ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin creation.'
      );
    } else {
      const existing = await User.findOne({ email: adminEmail });
      if (existing) {
        console.log(`[Seed] Admin account already exists (${adminEmail}) — skipping creation.`);
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Use User.create with a pre-hashed password.
        // We bypass the pre-save hook by inserting via Model.collection.insertOne
        // so the hook doesn't double-hash an already-hashed password.
        await User.collection.insertOne({
          name: 'System Administrator',
          email: adminEmail,
          phone: '+1 800-555-0199',
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`[Seed] Admin account created: ${adminEmail}`);
      }
    }

    // ── Sample vehicles (only if collection is empty) ───────────────────────
    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount > 0) {
      console.log(
        `[Seed] Vehicles collection already has ${vehicleCount} document(s) — skipping insert.`
      );
    } else {
      await Vehicle.insertMany(sampleVehicles);
      console.log('[Seed] 8 sample vehicles inserted successfully.');
    }

    // NOTE: Bookings and existing users are never deleted by this script.
    console.log('[Seed] Database seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    try { await mongoose.disconnect(); } catch (_) {}
    process.exit(1);
  }
};

seedDatabase();
