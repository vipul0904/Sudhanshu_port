import { getDB } from "./db.js";

// Helper to safely parse JSON columns
function safeParseJSON(value, fallback) {
  if (!value) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error("Failed to parse JSON string:", value, e);
      return fallback;
    }
  }
  return value; // already parsed object/array
}

// ── Profile ────────────────────────────────────────────
export const Profile = {
  async findOne() {
    const db = getDB();
    try {
      const [rows] = await db.query("SELECT * FROM profiles LIMIT 1");
      if (rows.length === 0) return null;
      return mapProfileFromDB(rows[0]);
    } catch (error) {
      console.error("Profile.findOne failed:", error.message);
      throw error;
    }
  },

  async create(profile) {
    const db = getDB();
    const dbProfile = mapProfileToDB(profile);
    try {
      const [result] = await db.query(
        `INSERT INTO profiles (hero_image, name, title, tagline, phone, phone_display, address, socials, greeting, bio_paragraphs) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dbProfile.hero_image,
          dbProfile.name,
          dbProfile.title,
          dbProfile.tagline,
          dbProfile.phone,
          dbProfile.phone_display,
          dbProfile.address,
          JSON.stringify(dbProfile.socials),
          dbProfile.greeting,
          JSON.stringify(dbProfile.bio_paragraphs)
        ]
      );
      const [rows] = await db.query("SELECT * FROM profiles WHERE id = ?", [result.insertId]);
      return mapProfileFromDB(rows[0]);
    } catch (error) {
      console.error("Profile.create failed:", error.message);
      throw error;
    }
  },

  async deleteMany() {
    const db = getDB();
    try {
      await db.query("DELETE FROM profiles");
    } catch (error) {
      console.error("Profile.deleteMany failed:", error.message);
      throw error;
    }
  },

  async countDocuments() {
    const db = getDB();
    try {
      const [rows] = await db.query("SELECT COUNT(*) AS count FROM profiles");
      return rows[0].count;
    } catch (error) {
      console.error("Profile.countDocuments failed:", error.message);
      throw error;
    }
  }
};

// ── Slide ──────────────────────────────────────────────
export const Slide = {
  async find() {
    const db = getDB();
    try {
      const [rows] = await db.query("SELECT * FROM slides ORDER BY id ASC");
      return rows || [];
    } catch (error) {
      console.error("Slide.find failed:", error.message);
      throw error;
    }
  },

  async insertMany(slides) {
    if (!slides || slides.length === 0) return [];
    const db = getDB();
    const inserted = [];
    try {
      for (const s of slides) {
        const [result] = await db.query(
          "INSERT INTO slides (img, caption) VALUES (?, ?)",
          [s.img || "", s.caption || ""]
        );
        inserted.push({ id: result.insertId, img: s.img || "", caption: s.caption || "" });
      }
      return inserted;
    } catch (error) {
      console.error("Slide.insertMany failed:", error.message);
      throw error;
    }
  },

  async deleteMany() {
    const db = getDB();
    try {
      await db.query("DELETE FROM slides");
    } catch (error) {
      console.error("Slide.deleteMany failed:", error.message);
      throw error;
    }
  }
};

// ── Blog ──────────────────────────────────────────────
export const Blog = {
  async find() {
    const db = getDB();
    try {
      const [rows] = await db.query("SELECT * FROM blogs");
      return rows || [];
    } catch (error) {
      console.error("Blog.find failed:", error.message);
      throw error;
    }
  },

  async insertMany(blogs) {
    if (!blogs || blogs.length === 0) return [];
    const db = getDB();
    const inserted = [];
    try {
      for (const b of blogs) {
        await db.query(
          `INSERT INTO blogs (id, type, title, meta, excerpt, link, image, gradient, date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            b.id,
            b.type,
            b.title || "",
            b.meta || "",
            b.excerpt || "",
            b.link || "",
            b.image || "",
            b.gradient || "",
            b.date || ""
          ]
        );
        inserted.push(b);
      }
      return inserted;
    } catch (error) {
      console.error("Blog.insertMany failed:", error.message);
      throw error;
    }
  },

  async deleteMany() {
    const db = getDB();
    try {
      await db.query("DELETE FROM blogs");
    } catch (error) {
      console.error("Blog.deleteMany failed:", error.message);
      throw error;
    }
  }
};

// ── Poem ──────────────────────────────────────────────
export const Poem = {
  async find() {
    const db = getDB();
    try {
      const [rows] = await db.query("SELECT * FROM poems");
      return (rows || []).map(mapPoemFromDB);
    } catch (error) {
      console.error("Poem.find failed:", error.message);
      throw error;
    }
  },

  async insertMany(poems) {
    if (!poems || poems.length === 0) return [];
    const db = getDB();
    const inserted = [];
    try {
      for (const p of poems) {
        const dbPoem = mapPoemToDB(p);
        await db.query(
          `INSERT INTO poems (id, title, meta, is_hindi, is_reflection, lines, content, quote, quote_author, date, image, disclaimer)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            dbPoem.id,
            dbPoem.title,
            dbPoem.meta,
            dbPoem.is_hindi,
            dbPoem.is_reflection,
            JSON.stringify(dbPoem.lines),
            dbPoem.content,
            dbPoem.quote,
            dbPoem.quote_author,
            dbPoem.date,
            dbPoem.image,
            dbPoem.disclaimer
          ]
        );
        inserted.push(mapPoemFromDB(dbPoem));
      }
      return inserted;
    } catch (error) {
      console.error("Poem.insertMany failed:", error.message);
      throw error;
    }
  },

  async deleteMany() {
    const db = getDB();
    try {
      await db.query("DELETE FROM poems");
    } catch (error) {
      console.error("Poem.deleteMany failed:", error.message);
      throw error;
    }
  }
};

// ── Message ───────────────────────────────────────────
export const Message = {
  async find() {
    const db = getDB();
    try {
      const [rows] = await db.query("SELECT * FROM messages ORDER BY date DESC");
      return (rows || []).map(mapMessageFromDB);
    } catch (error) {
      console.error("Message.find failed:", error.message);
      throw error;
    }
  },

  async create(msg) {
    const db = getDB();
    const dbMsg = mapMessageToDB(msg);
    try {
      await db.query(
        `INSERT INTO messages (id, name, email, subject, message, date, \`read\`)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          dbMsg.id,
          dbMsg.name,
          dbMsg.email,
          dbMsg.subject,
          dbMsg.message,
          dbMsg.date,
          dbMsg.read
        ]
      );
      return mapMessageFromDB(dbMsg);
    } catch (error) {
      console.error("Message.create failed:", error.message);
      throw error;
    }
  },

  async findOne(filter) {
    const db = getDB();
    try {
      const [rows] = await db.query("SELECT * FROM messages WHERE id = ? LIMIT 1", [filter.id]);
      if (rows.length === 0) return null;
      return mapMessageFromDB(rows[0]);
    } catch (error) {
      console.error("Message.findOne failed:", error.message);
      throw error;
    }
  },

  async deleteOne(filter) {
    const db = getDB();
    try {
      const [result] = await db.query("DELETE FROM messages WHERE id = ?", [filter.id]);
      return { deletedCount: result.affectedRows };
    } catch (error) {
      console.error("Message.deleteOne failed:", error.message);
      throw error;
    }
  },

  async countDocuments() {
    const db = getDB();
    try {
      const [rows] = await db.query("SELECT COUNT(*) AS count FROM messages");
      return rows[0].count;
    } catch (error) {
      console.error("Message.countDocuments failed:", error.message);
      throw error;
    }
  }
};

// ── Mapping helpers (camelCase ↔ snake_case) ──────────

function mapProfileToDB(p) {
  return {
    hero_image: p.heroImage || "",
    name: p.name || "",
    title: p.title || "",
    tagline: p.tagline || "",
    phone: p.phone || "",
    phone_display: p.phoneDisplay || "",
    address: p.address || "",
    socials: p.socials || {},
    greeting: p.greeting || "",
    bio_paragraphs: p.bioParagraphs || []
  };
}

function mapProfileFromDB(row) {
  return {
    heroImage: row.hero_image || "",
    name: row.name || "",
    title: row.title || "",
    tagline: row.tagline || "",
    phone: row.phone || "",
    phoneDisplay: row.phone_display || "",
    address: row.address || "",
    socials: safeParseJSON(row.socials, {}),
    greeting: row.greeting || "",
    bioParagraphs: safeParseJSON(row.bio_paragraphs, [])
  };
}

function mapPoemToDB(p) {
  return {
    id: p.id,
    title: p.title || "",
    meta: p.meta || "",
    is_hindi: p.isHindi ? 1 : 0,
    is_reflection: p.isReflection ? 1 : 0,
    lines: p.lines || [],
    content: p.content || "",
    quote: p.quote || "",
    quote_author: p.quoteAuthor || "",
    date: p.date || "",
    image: p.image || "",
    disclaimer: p.disclaimer || ""
  };
}

function mapPoemFromDB(row) {
  return {
    id: row.id,
    title: row.title || "",
    meta: row.meta || "",
    isHindi: !!row.is_hindi,
    isReflection: !!row.is_reflection,
    lines: safeParseJSON(row.lines, []),
    content: row.content || "",
    quote: row.quote || "",
    quoteAuthor: row.quote_author || "",
    date: row.date || "",
    image: row.image || "",
    disclaimer: row.disclaimer || ""
  };
}

function mapMessageToDB(m) {
  return {
    id: m.id,
    name: m.name || "",
    email: m.email || "",
    subject: m.subject || "",
    message: m.message || "",
    date: m.date || "",
    read: m.read ? 1 : 0
  };
}

function mapMessageFromDB(row) {
  return {
    id: row.id,
    name: row.name || "",
    email: row.email || "",
    subject: row.subject || "",
    message: row.message || "",
    date: row.date || "",
    read: !!row.read
  };
}
