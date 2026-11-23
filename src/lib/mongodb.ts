import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://info_db_user:rexkTuz4elj0srRx@cluster0.utakxdh.mongodb.net/travelluxx?retryWrites=true&w=majority&appName=Cluster0";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((inst) => {
      return inst;
    }).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Schemas & Models
const ServiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: String,
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: String,
    image: String,
    heroImage: String,
    icon: { type: String, default: "Car" },
    features: { type: [String], default: [] },
    priceText: String,
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    metaTitle: String,
    metaDescription: String,
    noIndexNoFollow: { type: Boolean, default: false },
    faqs: { type: Array, default: [] },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { strict: false }
);

export const ServiceModel =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);

const ServiceAreaSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: String,
    slug: { type: String, required: true, unique: true },
    heroTitle: String,
    heroSubtitle: String,
    heroDescription: String,
    metaTitle: String,
    metaDescription: String,
    noIndexNoFollow: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    faqs: { type: Array, default: [] },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { strict: false }
);

export const ServiceAreaModel =
  mongoose.models.ServiceArea || mongoose.model("ServiceArea", ServiceAreaSchema);

const PageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: String,
    slug: { type: String, required: true, unique: true },
    content: String,
    metaTitle: String,
    metaDescription: String,
    noIndexNoFollow: { type: Boolean, default: false },
    faqs: { type: Array, default: [] },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  { strict: false }
);

export const PageModel =
  mongoose.models.Page || mongoose.model("Page", PageSchema);

const PostSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: String,
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    content: String,
    image: String,
    author: { type: String, default: "Travelluxx Editorial" },
    date: String,
    published: { type: Number, default: 1 },
    metaTitle: String,
    metaDescription: String,
    noIndexNoFollow: { type: Boolean, default: false },
    faqs: { type: Array, default: [] },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { strict: false }
);

export const PostModel =
  mongoose.models.Post || mongoose.model("Post", PostSchema);

const SettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
});

export const SettingModel =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

function cleanDoc(doc: any) {
  if (!doc) return null;
  const json = JSON.parse(JSON.stringify(doc));
  if (json._id) {
    json._id = String(json._id);
  }
  return json;
}

function cleanDocs(docs: any[]) {
  if (!Array.isArray(docs)) return [];
  return docs.map(cleanDoc);
}

// Data fetch helpers with MongoDB first, local JSON as secondary fallback
export async function getWebsiteSettings(): Promise<any> {
  try {
    await connectToDatabase();
    const doc = await SettingModel.findOne({ key: "website" }).lean();
    if (doc && doc.value) {
      return cleanDoc(doc.value);
    }
  } catch (err) {
    console.warn("MongoDB getWebsiteSettings fallback:", err);
  }
  try {
    const filePath = path.join(process.cwd(), "website_settings.json");
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (e) {}
  return {};
}

export async function getServicesPageSettings(): Promise<any> {
  try {
    await connectToDatabase();
    const doc = await SettingModel.findOne({ key: "services_page_settings" }).lean();
    if (doc && doc.value) {
      return cleanDoc(doc.value);
    }
  } catch (err) {
    console.warn("MongoDB getServicesPageSettings fallback:", err);
  }
  try {
    const filePath = path.join(process.cwd(), "services_settings.json");
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (e) {}
  return {};
}

export async function getServiceAreasPageSettings(): Promise<any> {
  try {
    await connectToDatabase();
    const doc = await SettingModel.findOne({ key: "service_areas_page_settings" }).lean();
    if (doc && doc.value) {
      return cleanDoc(doc.value);
    }
  } catch (err) {
    console.warn("MongoDB getServiceAreasPageSettings fallback:", err);
  }
  try {
    const filePath = path.join(process.cwd(), "service_areas_settings.json");
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch (e) {}
  return {};
}

export async function getServices(onlyPublished = true): Promise<any[]> {
  try {
    await connectToDatabase();
    const query = onlyPublished ? { published: { $ne: false } } : {};
    const docs = await ServiceModel.find(query).sort({ order: 1, createdAt: 1 }).lean();
    if (docs && docs.length > 0) {
      return cleanDocs(docs);
    }
  } catch (err) {
    console.warn("MongoDB getServices fallback:", err);
  }
  try {
    const filePath = path.join(process.cwd(), "services.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return cleanDocs(onlyPublished ? data.filter((s: any) => s.published !== false) : data);
    }
  } catch (e) {}
  return [];
}

export async function getServiceBySlug(slug: string): Promise<any | null> {
  try {
    await connectToDatabase();
    const doc = await ServiceModel.findOne({
      $or: [{ slug }, { id: slug }],
      published: { $ne: false },
    }).lean();
    if (doc) return cleanDoc(doc);
  } catch (err) {
    console.warn(`MongoDB getServiceBySlug(${slug}) fallback:`, err);
  }
  try {
    const filePath = path.join(process.cwd(), "services.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const found = data.find((s: any) => (s.slug === slug || s.id === slug) && s.published !== false);
      if (found) return cleanDoc(found);
    }
  } catch (e) {}
  return null;
}

export async function getServiceAreas(onlyPublished = true): Promise<any[]> {
  try {
    await connectToDatabase();
    const query = onlyPublished ? { published: { $ne: false } } : {};
    const docs = await ServiceAreaModel.find(query).sort({ title: 1 }).lean();
    if (docs && docs.length > 0) {
      return cleanDocs(docs);
    }
  } catch (err) {
    console.warn("MongoDB getServiceAreas fallback:", err);
  }
  try {
    const filePath = path.join(process.cwd(), "service_areas.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return cleanDocs(onlyPublished ? data.filter((a: any) => a.published !== false) : data);
    }
  } catch (e) {}
  return [];
}

export async function getServiceAreaBySlug(slug: string): Promise<any | null> {
  try {
    await connectToDatabase();
    const doc = await ServiceAreaModel.findOne({
      $or: [{ slug }, { id: slug }],
      published: { $ne: false },
    }).lean();
    if (doc) return cleanDoc(doc);
  } catch (err) {
    console.warn(`MongoDB getServiceAreaBySlug(${slug}) fallback:`, err);
  }
  try {
    const filePath = path.join(process.cwd(), "service_areas.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const found = data.find((a: any) => (a.slug === slug || a.id === slug) && a.published !== false);
      if (found) return cleanDoc(found);
    }
  } catch (e) {}
  return null;
}

export async function getPages(): Promise<any[]> {
  try {
    await connectToDatabase();
    const docs = await PageModel.find({}).lean();
    if (docs && docs.length > 0) {
      return cleanDocs(docs);
    }
  } catch (err) {
    console.warn("MongoDB getPages fallback:", err);
  }
  try {
    const filePath = path.join(process.cwd(), "pages.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return cleanDocs(data);
    }
  } catch (e) {}
  return [];
}

export async function getPageBySlug(slug: string): Promise<any | null> {
  try {
    await connectToDatabase();
    const doc = await PageModel.findOne({
      $or: [{ slug }, { id: slug }],
    }).lean();
    if (doc) return cleanDoc(doc);
  } catch (err) {
    console.warn(`MongoDB getPageBySlug(${slug}) fallback:`, err);
  }
  try {
    const filePath = path.join(process.cwd(), "pages.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const found = data.find((p: any) => p.slug === slug || p.id === slug);
      if (found) return cleanDoc(found);
    }
  } catch (e) {}
  return null;
}

export async function getPosts(onlyPublished = true): Promise<any[]> {
  try {
    await connectToDatabase();
    const query = onlyPublished ? { published: 1 } : {};
    const docs = await PostModel.find(query).sort({ createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      return cleanDocs(docs);
    }
  } catch (err) {
    console.warn("MongoDB getPosts fallback:", err);
  }
  try {
    const filePath = path.join(process.cwd(), "posts.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return cleanDocs(onlyPublished ? data.filter((p: any) => p.published !== false && p.published !== 0) : data);
    }
  } catch (e) {}
  return [];
}

export async function getPostBySlug(slug: string): Promise<any | null> {
  try {
    await connectToDatabase();
    const doc = await PostModel.findOne({
      $or: [{ slug }, { id: slug }],
    }).lean();
    if (doc) return cleanDoc(doc);
  } catch (err) {
    console.warn(`MongoDB getPostBySlug(${slug}) fallback:`, err);
  }
  try {
    const filePath = path.join(process.cwd(), "posts.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const found = data.find((p: any) => (p.slug === slug || p.id === slug) && p.published !== false && p.published !== 0);
      if (found) return cleanDoc(found);
    }
  } catch (e) {}
  return null;
}
