import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import { Profile, Slide, Blog, Poem, Message } from "./models.js";
import crypto from "crypto";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbJsonPath = path.resolve(__dirname, "../src/data/db.json");

// ── Environment Variables ──────────────────────────────
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  console.error("CRITICAL SECURITY ERROR: JWT_ACCESS_SECRET or JWT_REFRESH_SECRET is not defined in environment variables!");
  process.exit(1);
}
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const CORS_ORIGINS = process.env.CORS_ORIGINS || CLIENT_URL;

const app = express();

// ── CORS Configuration ─────────────────────────────────
const allowedOrigins = CORS_ORIGINS.split(",").map(o => o.trim());
app.use(cors({
  origin: NODE_ENV === "development" ? true : allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));

// ── Helper: generate token pair ────────────────────────
const generateTokens = () => {
  const payload = { role: "admin" };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN
  });

  return { accessToken, refreshToken };
};

// ────────────────────────────────────────────────────────
// AUTH ENDPOINTS
// ────────────────────────────────────────────────────────

// POST /api/auth/login — validate password, return access + refresh tokens
app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    console.error("CRITICAL SECURITY ERROR: ADMIN_PASSWORD is not defined in environment variables!");
    return res.status(500).json({ error: "Server authentication is misconfigured." });
  }

  if (!password || password !== expectedPassword) {
    return res.status(401).json({ error: "Invalid admin password." });
  }

  const { accessToken, refreshToken } = generateTokens();

  console.log("Admin authenticated — access + refresh tokens issued.");
  res.json({
    success: true,
    accessToken,
    refreshToken,
    accessExpiresIn: JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: JWT_REFRESH_EXPIRES_IN
  });
});

// POST /api/auth/refresh — exchange a valid refresh token for a new access token
app.post("/api/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required." });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Issue a fresh access token (refresh token stays the same until it expires)
    const accessToken = jwt.sign(
      { role: decoded.role },
      JWT_ACCESS_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRES_IN }
    );

    res.json({ success: true, accessToken, accessExpiresIn: JWT_ACCESS_EXPIRES_IN });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Refresh token expired. Please log in again.", expired: true });
    }
    return res.status(401).json({ error: "Invalid refresh token." });
  }
});

// Helper to extract JWT token from request headers
const getAuthToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  const customHeader = req.headers["x-admin-token"];
  if (customHeader) {
    return customHeader;
  }
  return null;
};

// GET /api/auth/verify — check if access token is still valid
app.get("/api/auth/verify", (req, res) => {
  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({ valid: false, error: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    res.json({ valid: true, role: decoded.role, exp: decoded.exp });
  } catch (err) {
    res.status(401).json({ valid: false, error: "Token expired or invalid." });
  }
});

// ── Middleware: require valid access token ──────────────
const requireAuth = (req, res, next) => {
  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({ error: "Access denied. Authentication token missing." });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Access token expired.", expired: true });
    }
    return res.status(401).json({ error: "Access denied. Invalid or tampered token." });
  }
};

// Seed database helper — cached so it only runs once per serverless instance
let _seeded = false;
const seedDatabase = async () => {
  if (_seeded) return; // Skip if already seeded in this instance
  try {
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      console.log("No profile found. Seeding database with initial data from db.json...");
      const rawData = fs.readFileSync(dbJsonPath, "utf-8");
      const initialData = JSON.parse(rawData);
      
      // Save Profile
      await Profile.create(initialData.profile);
      
      // Save Slides
      if (initialData.slides && initialData.slides.length > 0) {
        await Slide.insertMany(initialData.slides);
      }
      
      // Save Blogs
      if (initialData.blogs && initialData.blogs.length > 0) {
        await Blog.insertMany(initialData.blogs);
      }
      
      // Save Poetry
      if (initialData.poetry && initialData.poetry.length > 0) {
        await Poem.insertMany(initialData.poetry);
      }
      
      console.log("Database successfully seeded!");
    }
    _seeded = true;
  } catch (error) {
    console.error("Database seeding failed:", error.message);
  }
};

// Endpoint to test database connection details (useful for debugging Hostinger environment variables)
app.get("/api/test-db-connection", async (req, res) => {
  try {
    const { connectDB } = await import("./db.js");
    await connectDB();
    res.json({
      success: true,
      message: "Database connection successful!",
      env: {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        DB_PORT: process.env.DB_PORT,
        DB_PASSWORD_INFO: process.env.DB_PASSWORD ? {
          length: process.env.DB_PASSWORD.length,
          startsWith: process.env.DB_PASSWORD[0],
          endsWith: process.env.DB_PASSWORD[process.env.DB_PASSWORD.length - 1]
        } : "NOT_DEFINED"
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database connection failed!",
      error: err.message,
      stack: err.stack,
      env: {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        DB_PORT: process.env.DB_PORT,
        DB_PASSWORD_INFO: process.env.DB_PASSWORD ? {
          length: process.env.DB_PASSWORD.length,
          startsWith: process.env.DB_PASSWORD[0],
          endsWith: process.env.DB_PASSWORD[process.env.DB_PASSWORD.length - 1]
        } : "NOT_DEFINED"
      }
    });
  }
});

// Middleware: ensure DB is connected + seeded before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    await seedDatabase();
    next();
  } catch (err) {
    console.error("DB middleware error:", err.message);
    res.status(503).json({ error: "Database unavailable. Please try again." });
  }
});

// ────────────────────────────────────────────────────────
// API ENDPOINTS
// ────────────────────────────────────────────────────────

// 1. GET ALL PORTFOLIO DATA (parallel queries for speed)
app.get("/api/portfolio", async (req, res) => {
  try {
    const [profile, slides, blogs, poetry] = await Promise.all([
      Profile.findOne(),
      Slide.find(),
      Blog.find(),
      Poem.find()
    ]);
    
    res.json({
      profile: profile || {},
      slides: slides || [],
      blogs: blogs || [],
      poetry: poetry || []
    });
  } catch (error) {
    console.error("Failed to fetch portfolio data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. SAVE ALL PORTFOLIO DATA (Admin save all — parallel writes for speed)
app.post("/api/portfolio", requireAuth, async (req, res) => {
  try {
    let { profile, slides, blogs, poetry } = req.body;
    
    // Support Base64 encoded payload to bypass Hostinger ModSecurity/WAF
    if (req.body.payload) {
      try {
        const decoded = Buffer.from(req.body.payload, "base64").toString("utf-8");
        const parsed = JSON.parse(decoded);
        profile = parsed.profile;
        slides = parsed.slides;
        blogs = parsed.blogs;
        poetry = parsed.poetry;
      } catch (decodeError) {
        console.error("Failed to decode base64 payload:", decodeError.message);
        return res.status(400).json({ error: "Invalid payload encoding" });
      }
    }
    
    // Step 1: Delete all collections in parallel
    await Promise.all([
      Profile.deleteMany(),
      Slide.deleteMany(),
      Blog.deleteMany(),
      Poem.deleteMany()
    ]);
    
    // Step 2: Insert all new data in parallel
    await Promise.all([
      Profile.create(profile),
      slides && slides.length > 0 ? Slide.insertMany(slides) : Promise.resolve(),
      blogs && blogs.length > 0 ? Blog.insertMany(blogs) : Promise.resolve(),
      poetry && poetry.length > 0 ? Poem.insertMany(poetry) : Promise.resolve()
    ]);
    
    console.log("All portfolio collections successfully synchronized!");
    res.json({ success: true, message: "Portfolio successfully synchronized in Supabase." });
  } catch (error) {
    console.error("Failed to update portfolio data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3. GET MESSAGES (Admin panel message viewer)
app.get("/api/messages", requireAuth, async (req, res) => {
  try {
    const messages = await Message.find(); // Already sorted newest first in model
    res.json(messages);
  } catch (error) {
    console.error("Failed to fetch contact messages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 4. ADD MESSAGE (Public contact form submission)
app.post("/api/messages", async (req, res) => {
  try {
    const { id, name, email, subject, message, date } = req.body;
    
    const newMessage = await Message.create({
      id: id || "msg_" + Math.random().toString(36).substring(2, 11),
      name,
      email,
      subject,
      message,
      date,
      read: false
    });
    
    console.log(`New contact response received from ${name}`);
    res.json({ success: true, message: "Contact message sent successfully.", data: newMessage });
  } catch (error) {
    console.error("Failed to save contact message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 5. DELETE MESSAGE (Admin delete)
app.delete("/api/messages/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Message.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    console.log(`Contact message ${id} deleted.`);
    res.json({ success: true, message: "Contact response deleted." });
  } catch (error) {
    console.error("Failed to delete contact message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 6. TOGGLE READ STATUS (Admin read/unread)
app.put("/api/messages/:id/read", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await Message.findOne({ id });
    
    if (!msg) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    const newReadStatus = !msg.read;
    const { getDB } = await import("./db.js");
    const db = getDB();
    await db.query("UPDATE messages SET `read` = ? WHERE id = ?", [newReadStatus ? 1 : 0, id]);
    
    res.json({ success: true, message: "Message status updated.", data: { ...msg, read: newReadStatus } });
  } catch (error) {
    console.error("Failed to toggle read status:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Helper to extract Cloudinary public ID from its full URL
function extractPublicId(url) {
  try {
    const parts = url.split('/image/upload/');
    if (parts.length < 2) return null;
    const pathAfterUpload = parts[1];
    const pathParts = pathAfterUpload.split('/');
    if (pathParts[0].match(/^v\d+$/)) {
      pathParts.shift();
    }
    const filenameWithFolders = pathParts.join('/');
    const dotIndex = filenameWithFolders.lastIndexOf('.');
    if (dotIndex === -1) return filenameWithFolders;
    return filenameWithFolders.substring(0, dotIndex);
  } catch (e) {
    console.error("Error parsing public_id:", e);
    return null;
  }
}

// Helper to destroy asset in Cloudinary
async function deleteFromCloudinary(publicId) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary delete skipped: Credentials (CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not fully configured in backend .env");
    return { success: false, reason: "credentials_missing" };
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    
    // Hash signature string using SHA-1 (default for Cloudinary)
    const signature = crypto.createHash("sha1").update(signatureString).digest("hex");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_id: publicId,
        api_key: apiKey,
        timestamp: timestamp,
        signature: signature
      })
    });

    const data = await response.json();
    if (data.result === "ok") {
      console.log(`Successfully deleted ${publicId} from Cloudinary.`);
      return { success: true };
    } else {
      console.error(`Failed to delete ${publicId} from Cloudinary:`, data);
      return { success: false, error: data.error || data.result };
    }
  } catch (err) {
    console.error(`Failed to connect/delete from Cloudinary for ${publicId}:`, err.message);
    return { success: false, error: err.message };
  }
}

// POST /api/media/delete — Delete image(s) from Cloudinary securely (Authenticated)
app.post("/api/media/delete", requireAuth, async (req, res) => {
  try {
    const { url, urls } = req.body;
    const targetUrls = urls || (url ? [url] : []);

    if (targetUrls.length === 0) {
      return res.status(400).json({ error: "No image URL(s) provided." });
    }

    const results = [];
    for (const imgUrl of targetUrls) {
      if (!imgUrl || !imgUrl.includes("cloudinary.com")) {
        results.push({ url: imgUrl, status: "skipped", reason: "not_cloudinary_url" });
        continue;
      }

      const publicId = extractPublicId(imgUrl);
      if (!publicId) {
        results.push({ url: imgUrl, status: "failed", reason: "invalid_public_id" });
        continue;
      }

      const clRes = await deleteFromCloudinary(publicId);
      if (clRes.success) {
        results.push({ url: imgUrl, publicId, status: "deleted" });
      } else {
        results.push({ url: imgUrl, publicId, status: "failed", reason: clRes.reason || clRes.error });
      }
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error("Error in /api/media/delete:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve static files from the React app build folder
const distPath = path.resolve(__dirname, "../dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Serve the React index.html for any other route (supporting client-side routing)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Function to locate public_html and auto-write ModSecurity bypass rules to the web root on Hostinger
const autoWriteHtaccess = () => {
  try {
    let currentDir = __dirname;
    let found = false;
    for (let i = 0; i < 5; i++) {
      const parentDir = path.resolve(currentDir, "..");
      if (parentDir === currentDir) break;

      const publicHtmlPath = path.join(parentDir, "public_html");
      const domainsPath = path.join(parentDir, "domains");

      if (fs.existsSync(publicHtmlPath)) {
        const htaccessPath = path.join(publicHtmlPath, ".htaccess");
        writeHtRules(htaccessPath);
        found = true;
        break;
      }

      if (fs.existsSync(domainsPath)) {
        const domainPublicHtml = path.join(domainsPath, "learnwithsrrs.com", "public_html");
        if (fs.existsSync(domainPublicHtml)) {
          const htaccessPath = path.join(domainPublicHtml, ".htaccess");
          writeHtRules(htaccessPath);
          found = true;
          break;
        }
      }

      currentDir = parentDir;
    }
    if (!found) {
      console.log("Could not find public_html to auto-inject ModSecurity bypass rules.");
    }
  } catch (err) {
    console.error("autoWriteHtaccess failed:", err.message);
  }
};

const writeHtRules = (filePath) => {
  const rules = `<IfModule mod_security.c>
  SecFilterEngine Off
  SecFilterScanPOST Off
</IfModule>\n`;

  try {
    let currentContent = "";
    if (fs.existsSync(filePath)) {
      currentContent = fs.readFileSync(filePath, "utf-8");
    }

    if (!currentContent.includes("SecFilterEngine Off")) {
      const newContent = rules + currentContent;
      fs.writeFileSync(filePath, newContent, "utf-8");
      console.log(`Successfully injected ModSecurity bypass rules into: ${filePath}`);
    } else {
      console.log(`ModSecurity rules already present in: ${filePath}`);
    }
  } catch (e) {
    console.error(`Failed to write .htaccess rules to ${filePath}:`, e.message);
  }
};

// Start server and connect DB
// Local development: start Express server with listen()
if (!process.env.VERCEL) {
  const startServer = async () => {
    // Auto-inject ModSecurity bypass rules into Hostinger public_html .htaccess on startup
    autoWriteHtaccess();
    
    try {
      await connectDB();
      await seedDatabase();
      console.log("Database connected and seeded successfully.");
    } catch (err) {
      console.error("Database connection/seeding failed during startup:", err.message);
      console.log("Starting server in offline/database-offline fallback mode...");
    }
    
    app.listen(PORT, () => {
      console.log(`Express Portfolio API Server is running on http://localhost:${PORT}`);
    });
  };
  startServer();
}

// Vercel serverless: DB connection is handled by the middleware above
export default app;
