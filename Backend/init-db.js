import pkg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const { Pool } = pkg;

// Connect to default postgres database to create eco_cycle
const adminPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "postgres", // Connect to default database
});

async function createDatabase() {
  const client = await adminPool.connect();

  try {
    // Check if database exists
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (result.rows.length === 0) {
      console.log(`Creating database: ${process.env.DB_NAME}`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created successfully`);
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists`);
    }
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    client.release();
    await adminPool.end();
  }
}

// Create tables in eco_cycle database
async function createTables() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const client = await pool.connect();

  try {
    // Drop existing table if it exists (to fix schema mismatch)
    await client.query(`
      DROP TABLE IF EXISTS pickups CASCADE
    `);

    await client.query(`
      DROP TABLE IF EXISTS users CASCADE
    `);

    console.log("Dropped old tables");

    // Create users table with correct schema
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        number VARCHAR(20),
        city VARCHAR(100),
        usertype VARCHAR(50) NOT NULL DEFAULT 'User',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create pickups table
    await client.query(`
      CREATE TABLE pickups (
        "pickupId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" INTEGER NOT NULL REFERENCES users(id),
        "wasteType" VARCHAR(100) NOT NULL,
        "estimatedWeight" DECIMAL(10, 2) NOT NULL,
        "pickupAddress" TEXT NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled')),
        "driverId" INTEGER,
        "requestedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "scheduledTime" TIMESTAMP,
        "completedAt" TIMESTAMP,
        notes TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pickups_userId ON pickups("userId")
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pickups_status ON pickups(status)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pickups_driverId ON pickups("driverId")
    `);

    console.log("Database initialization completed successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

// Create default admin user
async function createDefaultAdmin() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const client = await pool.connect();

  try {
    // Check if admin already exists
    const adminExists = await client.query(
      "SELECT * FROM users WHERE email = $1",
      ["admin@ecocycle.com"]
    );

    if (adminExists.rows.length > 0) {
      const admin = adminExists.rows[0];
      console.log("✅ Admin account already exists");
      console.log("   ID:", admin.id);
      console.log("   Email:", admin.email);
      console.log("   UserType:", admin.usertype);
      
      // If usertype is not "Admin", update it
      if (admin.usertype !== "Admin") {
        console.log("⚠️  Fixing admin usertype from", admin.usertype, "to Admin");
        await client.query(
          "UPDATE users SET usertype = $1 WHERE email = $2",
          ["Admin", "admin@ecocycle.com"]
        );
        console.log("✅ Admin usertype updated to Admin");
      }
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create admin user
    const result = await client.query(
      `INSERT INTO users (username, email, password, number, city, usertype)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, username, email, usertype`,
      ["Admin", "admin@ecocycle.com", hashedPassword, "0000000000", "Admin City", "Admin"]
    );

    const newAdmin = result.rows[0];
    console.log("✅ Default admin account created successfully");
    console.log("   ID:", newAdmin.id);
    console.log("   Email:", newAdmin.email);
    console.log("   Password: Admin@123");
    console.log("   UserType:", newAdmin.usertype);
  } catch (err) {
    console.error("Error creating admin account:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

async function initialize() {
  console.log("Starting database initialization...");
  await createDatabase();
  await createTables();
  await createDefaultAdmin();
  console.log("✅ Database setup complete!");
}

initialize().catch((err) => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});
