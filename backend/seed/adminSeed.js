const dotenv = require('dotenv');
dotenv.config();

const bcrypt = require('bcryptjs');

const connectDb = require('../config/db');
const Admin = require('../models/Admin');

const run = async () => {
  await connectDb();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await Admin.findOne({ email: normalizedEmail });

  const passwordHash = await bcrypt.hash(password, 10);

  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log('Admin password updated for:', existing.email);
    process.exit(0);
  }

  const admin = await Admin.create({ email: normalizedEmail, passwordHash });
  console.log('Admin created:', admin.email);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
