import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT || 3306;

let pool;

export function getDB() {
  if (!pool) {
    if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
      console.error("CRITICAL ERROR: MySQL environment variables are not fully defined in .env!");
      process.exit(1);
    }
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: Number(DB_PORT),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

// Test the connection and initialize tables automatically
export async function connectDB() {
  const db = getDB();
  try {
    const connection = await db.getConnection();
    console.log(`MySQL Connected to database: ${DB_NAME} on ${DB_HOST}:${DB_PORT}`);
    connection.release();
    
    // Automatically initialize database tables if they do not exist
    await initializeTables();
    return db;
  } catch (err) {
    console.error("MySQL connection test failed:", err.message);
    throw err;
  }
}

async function initializeTables() {
  const db = getDB();
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      hero_image TEXT,
      name VARCHAR(255),
      title VARCHAR(255),
      tagline VARCHAR(255),
      phone VARCHAR(50),
      phone_display VARCHAR(50),
      address TEXT,
      socials LONGTEXT,
      greeting VARCHAR(255),
      bio_paragraphs LONGTEXT
    )`,
    `CREATE TABLE IF NOT EXISTS slides (
      id INT AUTO_INCREMENT PRIMARY KEY,
      img TEXT,
      caption VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS blogs (
      id VARCHAR(255) PRIMARY KEY,
      type VARCHAR(50),
      title VARCHAR(255),
      meta VARCHAR(255),
      excerpt TEXT,
      link TEXT,
      image TEXT,
      gradient VARCHAR(255),
      date VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS poems (
      id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255),
      meta VARCHAR(255),
      is_hindi BOOLEAN DEFAULT FALSE,
      is_reflection BOOLEAN DEFAULT FALSE,
      lines LONGTEXT,
      content TEXT,
      quote TEXT,
      quote_author VARCHAR(255),
      date VARCHAR(100),
      image TEXT,
      disclaimer TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      subject VARCHAR(255),
      message TEXT,
      date VARCHAR(100),
      \`read\` BOOLEAN DEFAULT FALSE
    )`
  ];

  try {
    for (const query of tables) {
      await db.query(query);
    }
    console.log("MySQL tables verified/created successfully.");
  } catch (error) {
    console.error("Failed to initialize database tables:", error.message);
    throw error;
  }
}
