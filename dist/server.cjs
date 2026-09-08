var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_api_client = require("@mollie/api-client");
var import_mongoose = __toESM(require("mongoose"), 1);
import_dotenv.default.config();
var BOOKINGS_PATH = import_path.default.join(process.cwd(), "bookings.json");
var SETTINGS_PATH = import_path.default.join(process.cwd(), "settings.json");
var PRICING_PATH = import_path.default.join(process.cwd(), "pricing.json");
var SMTP_PATH = import_path.default.join(process.cwd(), "smtp.json");
var POSTS_PATH = import_path.default.join(process.cwd(), "posts.json");
var ADMINS_PATH = import_path.default.join(process.cwd(), "admins.json");
var PAGES_PATH = import_path.default.join(process.cwd(), "pages.json");
var INQUIRIES_PATH = import_path.default.join(process.cwd(), "inquiries.json");
var SERVICES_PATH = import_path.default.join(process.cwd(), "services.json");
var SERVICES_SETTINGS_PATH = import_path.default.join(process.cwd(), "services_settings.json");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://info_db_user:rexkTuz4elj0srRx@cluster0.utakxdh.mongodb.net/travelluxx?retryWrites=true&w=majority&appName=Cluster0";
var BookingSchema = new import_mongoose.default.Schema({
  id: { type: String, required: true, unique: true },
  passengerName: String,
  passengerEmail: String,
  passengerPhone: String,
  pickup: String,
  dropoff: String,
  date: String,
  time: String,
  distance: String,
  vehicle: String,
  price: Number,
  status: { type: String, default: "Pending" },
  paymentMethod: String,
  paymentStatus: { type: String, default: "Unpaid" },
  flightNumber: String,
  createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
}, { strict: false });
var BookingModel = import_mongoose.default.model("Booking", BookingSchema);
var PostSchema = new import_mongoose.default.Schema({
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
  createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
}, { strict: false });
var PostModel = import_mongoose.default.model("Post", PostSchema);
var PageSchema = new import_mongoose.default.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  slug: { type: String, required: true, unique: true },
  content: String,
  metaTitle: String,
  metaDescription: String,
  noIndexNoFollow: { type: Boolean, default: false },
  updatedAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
}, { strict: false });
var PageModel = import_mongoose.default.model("Page", PageSchema);
var ServiceSchema = new import_mongoose.default.Schema({
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
  createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
  updatedAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
}, { strict: false });
var ServiceModel = import_mongoose.default.model("Service", ServiceSchema);
var InquirySchema = new import_mongoose.default.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  type: String,
  message: String,
  status: { type: String, default: "Unread" },
  createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
}, { strict: false });
var InquiryModel = import_mongoose.default.model("Inquiry", InquirySchema);
var SettingSchema = new import_mongoose.default.Schema({
  key: { type: String, required: true, unique: true },
  value: import_mongoose.default.Schema.Types.Mixed
});
var SettingModel = import_mongoose.default.model("Setting", SettingSchema);
var UploadSchema = new import_mongoose.default.Schema({
  filename: { type: String, required: true, unique: true },
  mimeType: String,
  data: Buffer
});
var UploadModel = import_mongoose.default.model("Upload", UploadSchema);
var isConnected = false;
async function runMigrations() {
  try {
    const count = await BookingModel.countDocuments();
    if (count === 0 && import_fs.default.existsSync(BOOKINGS_PATH)) {
      console.log("\u{1F4E5} Migrating bookings.json into MongoDB...");
      const jsonBookings = JSON.parse(import_fs.default.readFileSync(BOOKINGS_PATH, "utf8"));
      await BookingModel.insertMany(jsonBookings, { ordered: false }).catch(() => {
      });
      console.log("\u2705 MongoDB populated with all historic bookings!");
    }
  } catch (err) {
    console.error("Error migrating bookings to MongoDB:", err.message);
  }
  try {
    const count = await PostModel.countDocuments();
    if (count === 0 && import_fs.default.existsSync(POSTS_PATH)) {
      console.log("\u{1F4E5} Migrating posts.json into MongoDB...");
      const jsonPosts = JSON.parse(import_fs.default.readFileSync(POSTS_PATH, "utf8"));
      await PostModel.insertMany(jsonPosts, { ordered: false }).catch(() => {
      });
      console.log("\u2705 MongoDB populated with all posts!");
    }
  } catch (err) {
    console.error("Error migrating posts to MongoDB:", err.message);
  }
  try {
    const count = await PageModel.countDocuments();
    if (count === 0 && import_fs.default.existsSync(PAGES_PATH)) {
      console.log("\u{1F4E5} Migrating pages.json into MongoDB...");
      const jsonPages = JSON.parse(import_fs.default.readFileSync(PAGES_PATH, "utf8"));
      await PageModel.insertMany(jsonPages, { ordered: false }).catch(() => {
      });
      console.log("\u2705 MongoDB populated with all pages!");
    }
  } catch (err) {
    console.error("Error migrating pages to MongoDB:", err.message);
  }
  try {
    const count = await InquiryModel.countDocuments();
    if (count === 0 && import_fs.default.existsSync(INQUIRIES_PATH)) {
      console.log("\u{1F4E5} Migrating inquiries.json into MongoDB...");
      const jsonInquiries = JSON.parse(import_fs.default.readFileSync(INQUIRIES_PATH, "utf8"));
      await InquiryModel.insertMany(jsonInquiries, { ordered: false }).catch(() => {
      });
      console.log("\u2705 MongoDB populated with all inquiries!");
    }
  } catch (err) {
    console.error("Error migrating inquiries to MongoDB:", err.message);
  }
  try {
    const count = await ServiceModel.countDocuments();
    if (count === 0 && import_fs.default.existsSync(SERVICES_PATH)) {
      console.log("\u{1F4E5} Migrating services.json into MongoDB...");
      const jsonServices = JSON.parse(import_fs.default.readFileSync(SERVICES_PATH, "utf8"));
      await ServiceModel.insertMany(jsonServices, { ordered: false }).catch(() => {
      });
      console.log("\u2705 MongoDB populated with all services!");
    }
  } catch (err) {
    console.error("Error migrating services to MongoDB:", err.message);
  }
}
async function connectToDatabase() {
  if (isConnected || import_mongoose.default.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  const isVercelLocalFallback = process.env.VERCEL && MONGODB_URI.includes("localhost");
  if (isVercelLocalFallback) {
    console.log("\u26A0\uFE0F Skipping MongoDB connection (local fallback on Vercel).");
    return;
  }
  try {
    import_mongoose.default.set("bufferCommands", false);
    await import_mongoose.default.connect(MONGODB_URI);
    console.log("Connected to MongoDB!");
    isConnected = true;
    await runMigrations();
    await syncSettingsFromDb();
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}
function readInquiries() {
  try {
    if (import_fs.default.existsSync(INQUIRIES_PATH)) {
      return JSON.parse(import_fs.default.readFileSync(INQUIRIES_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading inquiries.json:", err);
  }
  return [];
}
function writeInquiries(inquiries) {
  if (process.env.VERCEL) {
    console.log("\u2139\uFE0F Skipping writeInquiries to local file on Vercel.");
    return;
  }
  try {
    import_fs.default.writeFileSync(INQUIRIES_PATH, JSON.stringify(inquiries, null, 2));
  } catch (err) {
    console.error("Error writing inquiries.json:", err);
  }
}
function readPages() {
  try {
    if (import_fs.default.existsSync(PAGES_PATH)) {
      return JSON.parse(import_fs.default.readFileSync(PAGES_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading pages.json:", err);
  }
  return [];
}
function writePages(pages) {
  if (process.env.VERCEL) {
    console.log("\u2139\uFE0F Skipping writePages to local file on Vercel.");
    return;
  }
  try {
    import_fs.default.writeFileSync(PAGES_PATH, JSON.stringify(pages, null, 2));
  } catch (err) {
    console.error("Error writing pages.json:", err);
  }
}
function readServices() {
  try {
    if (import_fs.default.existsSync(SERVICES_PATH)) {
      return JSON.parse(import_fs.default.readFileSync(SERVICES_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading services.json:", err);
  }
  return [];
}
function writeServices(services) {
  if (process.env.VERCEL) {
    console.log("\u2139\uFE0F Skipping writeServices to local file on Vercel.");
    return;
  }
  try {
    import_fs.default.writeFileSync(SERVICES_PATH, JSON.stringify(services, null, 2));
  } catch (err) {
    console.error("Error writing services.json:", err);
  }
}
function readServicesSettings() {
  try {
    if (import_fs.default.existsSync(SERVICES_SETTINGS_PATH)) {
      return JSON.parse(import_fs.default.readFileSync(SERVICES_SETTINGS_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading services_settings.json:", err);
  }
  return {};
}
function writeServicesSettings(settingsData) {
  if (process.env.VERCEL) {
    console.log("\u2139\uFE0F Skipping writeServicesSettings to local file on Vercel.");
    return;
  }
  try {
    import_fs.default.writeFileSync(SERVICES_SETTINGS_PATH, JSON.stringify(settingsData, null, 2));
  } catch (err) {
    console.error("Error writing services_settings.json:", err);
  }
}
function readPosts() {
  try {
    if (import_fs.default.existsSync(POSTS_PATH)) {
      return JSON.parse(import_fs.default.readFileSync(POSTS_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading posts.json:", err);
  }
  return [];
}
function writePosts(posts) {
  if (process.env.VERCEL) {
    console.log("\u2139\uFE0F Skipping writePosts to local file on Vercel.");
    return;
  }
  try {
    import_fs.default.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error("Error writing posts.json:", err);
  }
}
function readBookings() {
  try {
    if (import_fs.default.existsSync(BOOKINGS_PATH)) {
      return JSON.parse(import_fs.default.readFileSync(BOOKINGS_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading bookings.json:", err);
  }
  return [];
}
function writeBookings(bookings) {
  if (process.env.VERCEL) {
    console.log("\u2139\uFE0F Skipping writeBookings to local file on Vercel.");
    return;
  }
  try {
    import_fs.default.writeFileSync(BOOKINGS_PATH, JSON.stringify(bookings, null, 2));
  } catch (err) {
    console.error("Error writing bookings.json:", err);
  }
}
var cachedWebsiteSettings = null;
var cachedPricingSettings = null;
var cachedSmtpSettings = null;
var cachedMollieApiKey = null;
var cachedMenu = null;
async function syncSettingsFromDb() {
  try {
    if (import_mongoose.default.connection.readyState === 1) {
      const dbWebsite = await SettingModel.findOne({ key: "website" });
      if (dbWebsite && dbWebsite.value) cachedWebsiteSettings = dbWebsite.value;
      const dbPricing = await SettingModel.findOne({ key: "pricing" });
      if (dbPricing && dbPricing.value) cachedPricingSettings = dbPricing.value;
      const dbSmtp = await SettingModel.findOne({ key: "smtp" });
      if (dbSmtp && dbSmtp.value) cachedSmtpSettings = dbSmtp.value;
      const dbMollie = await SettingModel.findOne({ key: "mollie_api_key" });
      if (dbMollie && dbMollie.value) cachedMollieApiKey = dbMollie.value;
      const dbMenu = await SettingModel.findOne({ key: "menu" });
      if (dbMenu && dbMenu.value) cachedMenu = dbMenu.value;
      console.log("\u{1F504} Loaded settings cache from MongoDB!");
    }
  } catch (err) {
    console.error("Error syncing settings from DB:", err.message);
  }
}
function getCurrentWebsiteSettings() {
  if (cachedWebsiteSettings) {
    return cachedWebsiteSettings;
  }
  const defaultSettings = {
    business_name: "Travelluxx",
    business_email: "info@travelluxx.co.uk",
    whatsapp_number: "441217140876",
    office_address: "Shirley B90 Shirley, Solihull, West Midlands, UK",
    economy_price: 1.5,
    luxury_price: 2,
    family_price: 2.5,
    minimum_distance: 10,
    hero_image: "",
    logo_image: "",
    logo_url: "",
    favicon_url: "",
    footer_info: "\xA9 2026 Travelluxx. All rights reserved.",
    homepage_displays: "latest",
    homepage_page_id: "",
    posts_page_id: "",
    search_engine_visibility: false,
    active_theme: "default",
    homepage_hero_badge: "",
    homepage_hero_title: "",
    homepage_hero_subtitle: "",
    homepage_hero_btn_text: "",
    homepage_hero_btn_link: "",
    homepage_hero_phone_text: "",
    homepage_hero_phone_link: "",
    homepage_indicator1: "",
    homepage_indicator2: "",
    homepage_indicator3: "",
    homepage_fleet_subtitle: "",
    homepage_fleet_title: "",
    homepage_fleet_description: "",
    homepage_airports_title: "",
    // Homepage SEO
    homepage_seo_title: "",
    homepage_seo_description: "",
    homepage_seo_focus_keyphrase: "",
    // Fleet Economy
    fleet_economy_name: "Business Economy Class",
    fleet_economy_tagline: "Elegant, clean, and highly efficient travel.",
    fleet_economy_description: "Perfect for business commuters, solo travellers, or quick transfers. Featuring modern executive comfort with absolute fuel efficiency.",
    fleet_economy_features: "Complimentary 4G Wi-Fi, Dual-zone Climate Control, USB Charging Ports, Bottle Holders & Newspapers",
    fleet_economy_image: "",
    // Fleet Luxury
    fleet_luxury_name: "First Class Luxury Chauffeur",
    fleet_luxury_tagline: "The pinnacle of executive comfort and style.",
    fleet_luxury_description: "Experience VIP travel. Whether it's high-profile business meetings, weddings, or an ultra-comfort ride to Heathrow. Settle into reclining leather chairs.",
    fleet_luxury_features: "Premium Leather Reclining Seats, Complimentary Bottled Water, Ambient Lighting Controls, Rear Seat Entertainment Systems, Quiet Acoustic Cabins",
    fleet_luxury_image: "",
    // Fleet Family (MPV)
    fleet_family_name: "Family & Executive MPV",
    fleet_family_tagline: "Generous space for luggage and loved ones.",
    fleet_family_description: "Ideal for family vacations, groups, or high-volume luggage transfers. Spacious seating configuration ensures passengers can converse in absolute comfort.",
    fleet_family_features: "Conference Seating Options, Massive Boot Capacity, Automatic Sliding Doors, Privacy Glass, Individual Air-Con Units, Child Seats Available (On Request)",
    fleet_family_image: "",
    // Airports (6 items)
    airport_name_1: "Heathrow",
    airport_code_1: "LHR",
    airport_name_2: "Gatwick",
    airport_code_2: "LGW",
    airport_name_3: "Luton",
    airport_code_3: "LTN",
    airport_name_4: "Stansted",
    airport_code_4: "STN",
    airport_name_5: "London City",
    airport_code_5: "LCY",
    airport_name_6: "Southend",
    airport_code_6: "SEN",
    // Services (5 items)
    service_title_1: "Airport Transfers",
    service_desc_1: "Reliable private transfers to Heathrow, Gatwick, and all major UK airports.",
    service_image_1: "",
    service_pickup_1: "Shirley, Solihull B90",
    service_dropoff_1: "London Heathrow Airport (LHR)",
    service_title_2: "Port Transfers",
    service_desc_2: "Reliable transfers to and from all major UK ports and cruise terminals.",
    service_image_2: "",
    service_pickup_2: "Shirley, Solihull B90",
    service_dropoff_2: "Southampton Cruise Port",
    service_title_3: "Station Transfers",
    service_desc_3: "Seamless transfers to and from rail stations across London and the UK.",
    service_image_3: "",
    service_pickup_3: "Shirley, Solihull B90",
    service_dropoff_3: "London Euston Station",
    service_title_4: "Popular Cities",
    service_desc_4: "Travel to all major cities across the UK in comfort and style.",
    service_image_4: "",
    service_pickup_4: "Shirley, Solihull B90",
    service_dropoff_4: "London Central, UK",
    service_title_5: "Business Travel",
    service_desc_5: "Executive travel solutions tailored for business and professionals.",
    service_image_5: "",
    service_pickup_5: "Shirley, Solihull B90",
    service_dropoff_5: "Birmingham Airport (BHX)"
  };
  try {
    const webSettingsPath = import_path.default.join(process.cwd(), "website_settings.json");
    if (import_fs.default.existsSync(SETTINGS_PATH)) {
      const data = JSON.parse(import_fs.default.readFileSync(SETTINGS_PATH, "utf8"));
      cachedWebsiteSettings = { ...defaultSettings, ...data };
      return cachedWebsiteSettings;
    } else if (import_fs.default.existsSync(webSettingsPath)) {
      const data = JSON.parse(import_fs.default.readFileSync(webSettingsPath, "utf8"));
      cachedWebsiteSettings = { ...defaultSettings, ...data };
      return cachedWebsiteSettings;
    }
  } catch (err) {
  }
  return defaultSettings;
}
function getCurrentPricingSettings() {
  if (cachedPricingSettings) {
    return cachedPricingSettings;
  }
  const defaultPricing = {
    economy_price_per_mile: 1.5,
    luxury_price_per_mile: 2,
    family_price_per_mile: 2.5,
    minimum_billable_distance: 10,
    extra_stop_charge: 10,
    break_time_charge: 0.5
  };
  try {
    if (import_fs.default.existsSync(PRICING_PATH)) {
      const data = JSON.parse(import_fs.default.readFileSync(PRICING_PATH, "utf8"));
      cachedPricingSettings = { ...defaultPricing, ...data };
      return cachedPricingSettings;
    }
  } catch (err) {
  }
  return defaultPricing;
}
function readSmtpSettings() {
  if (cachedSmtpSettings) {
    const ws2 = getCurrentWebsiteSettings();
    return {
      smtpHost: cachedSmtpSettings.smtpHost || process.env.SMTP_HOST || "mail.travelluxx.co.uk",
      smtpPort: cachedSmtpSettings.smtpPort || process.env.SMTP_PORT || "465",
      smtpUser: cachedSmtpSettings.smtpUser || process.env.SMTP_USER || ws2.business_email || "info@travelluxx.co.uk",
      smtpPass: cachedSmtpSettings.smtpPass || process.env.SMTP_PASS || "7JjGeytEq@565FF6xN",
      smtpSecure: cachedSmtpSettings.smtpSecure !== void 0 ? cachedSmtpSettings.smtpSecure : process.env.SMTP_SECURE !== "false",
      senderAddress: cachedSmtpSettings.senderAddress || cachedSmtpSettings.smtpUser || process.env.SMTP_USER || ws2.business_email || "info@travelluxx.co.uk"
    };
  }
  let saved = {};
  try {
    if (import_fs.default.existsSync(SMTP_PATH)) {
      saved = JSON.parse(import_fs.default.readFileSync(SMTP_PATH, "utf8"));
    } else {
      const ws2 = getCurrentWebsiteSettings();
      if (ws2.smtp_host || ws2.smtp_user || ws2.smtpUser) {
        saved = {
          smtpHost: ws2.smtp_host || ws2.smtpHost,
          smtpPort: ws2.smtp_port || ws2.smtpPort,
          smtpUser: ws2.smtp_user || ws2.smtpUser,
          smtpPass: ws2.smtp_pass || ws2.smtpPass,
          smtpSecure: ws2.smtp_secure !== void 0 ? ws2.smtp_secure : ws2.smtpSecure,
          senderAddress: ws2.business_email || ws2.smtp_user || ws2.smtpUser
        };
      }
    }
  } catch (err) {
  }
  const ws = getCurrentWebsiteSettings();
  cachedSmtpSettings = {
    smtpHost: saved.smtpHost || process.env.SMTP_HOST || "mail.travelluxx.co.uk",
    smtpPort: saved.smtpPort || process.env.SMTP_PORT || "465",
    smtpUser: saved.smtpUser || process.env.SMTP_USER || ws.business_email || "info@travelluxx.co.uk",
    smtpPass: saved.smtpPass || process.env.SMTP_PASS || "7JjGeytEq@565FF6xN",
    smtpSecure: saved.smtpSecure !== void 0 ? saved.smtpSecure : process.env.SMTP_SECURE !== "false",
    senderAddress: saved.senderAddress || saved.smtpUser || process.env.SMTP_USER || ws.business_email || "info@travelluxx.co.uk"
  };
  return cachedSmtpSettings;
}
function getMollieClient() {
  const settings = getCurrentWebsiteSettings();
  const apiKey = process.env.MOLLIE_API_KEY || settings?.mollie_api_key;
  if (!apiKey || !apiKey.trim()) {
    return null;
  }
  return (0, import_api_client.createMollieClient)({ apiKey: apiKey.trim() });
}
function createTransporter() {
  const settings = readSmtpSettings();
  const port = parseInt(String(settings.smtpPort || "465"), 10);
  const secure = settings.smtpSecure !== false && (port === 465 || settings.smtpSecure === true);
  return import_nodemailer.default.createTransport({
    host: settings.smtpHost,
    port,
    secure,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 1e4,
    greetingTimeout: 1e4,
    socketTimeout: 15e3
  });
}
async function sendEmailSafely(mailOptions) {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email safely:", error);
    try {
      import_fs.default.appendFileSync(
        import_path.default.join(process.cwd(), "email_errors.log"),
        `[${(/* @__PURE__ */ new Date()).toISOString()}] To: ${mailOptions.to}, Subject: ${mailOptions.subject}, Error: ${error?.message || String(error)}
`
      );
    } catch (e) {
    }
    return { success: false, error: error?.message || String(error) };
  }
}
async function sendWhatsAppNotification(booking) {
  const ws = getCurrentWebsiteSettings();
  const token = process.env.WHATSAPP_TOKEN || "tJghe6OE6w1V8YclFG4onsIQgAUgx1QlZ6SIydFjoJBUw11l1PJKfOwwyoMu29Ff";
  const messageBody = `\u{1F697} *Booking Confirmed - ${ws.business_name}*
Ref: ${booking.id}
Passenger: ${booking.passengerName}
Date/Time: ${booking.date} at ${booking.time}
Pickup: ${booking.pickup}
Dropoff: ${booking.dropoff}
Distance: ${Number(booking.distance || 0).toFixed(1)} miles
Vehicle: ${booking.vehicle} Class
Total: \xA3${Number(booking.price).toFixed(2)}
Payment: ${booking.paymentMethod} (${booking.paymentStatus})

Thank you for choosing ${ws.business_name}!`;
  const phoneNumbers = [booking.passengerPhone, ws.whatsapp_number].filter(Boolean);
  for (const phone of phoneNumbers) {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) continue;
    try {
      console.log(`Sending WhatsApp message to ${cleanPhone} with token prefix ${token.substring(0, 6)}...`);
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "YOUR_PHONE_NUMBER_ID";
      if (phoneNumberId && phoneNumberId !== "YOUR_PHONE_NUMBER_ID") {
        const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: cleanPhone,
            type: "text",
            text: { body: messageBody }
          })
        });
        const resData = await response.json();
        console.log("WhatsApp API response for", cleanPhone, resData);
      } else {
        console.log("WhatsApp notification simulated successfully for", cleanPhone);
      }
    } catch (err) {
      console.error("WhatsApp notification error for", phone, err);
    }
  }
}
async function sendBookingEmails(booking, isConfirmedEmail = false, isStatusChange = false) {
  const ws = getCurrentWebsiteSettings();
  const brandGreen = "#047857";
  const bgSlate = "#f8fafc";
  const borderSlate = "#e2e8f0";
  const textDark = "#0f172a";
  const textMuted = "#64748b";
  const hasStops = Array.isArray(booking.stops) && booking.stops.length > 0;
  const hasWaiting = Number(booking.waitingTime || 0) > 0;
  const paymentDisplay = booking.paymentMethod === "Pay Later" ? "Pay Later" : `${booking.paymentMethod} <span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:700;">Paid</span>`;
  let stopsListHtml = "";
  if (hasStops) {
    stopsListHtml = booking.stops.map(
      (s, i) => `<li style="margin-bottom: 4px;"><span style="color: ${textMuted}; font-size: 11px;">Stop ${i + 1}:</span> ${s.address} ${Number(s.waiting) > 0 ? `(Wait: ${s.waiting}m)` : ""}</li>`
    ).join("");
  }
  const detailsTableHtml = `
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 25px;">
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Booking Reference</td><td style="padding: 10px 0; font-weight: 700; text-align: right; color: ${brandGreen}; font-family: monospace;">${booking.id}</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Passenger Name</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">${booking.passengerName}</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Email</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">${booking.passengerEmail}</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Phone Number</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">${booking.passengerPhone}</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Date &amp; Time</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">${booking.date} at ${booking.time}</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Pickup Address</td><td style="padding: 10px 0; font-weight: 600; text-align: right; font-size: 13px;">${booking.pickup || "N/A"}</td></tr>
      ${hasStops ? `<tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Intermediate Stops</td><td style="padding: 10px 0; font-weight: 600; text-align: right; font-size: 13px;"><ul style="list-style: none; padding: 0; margin: 0;">${stopsListHtml}</ul></td></tr>` : ""}
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Dropoff Address</td><td style="padding: 10px 0; font-weight: 600; text-align: right; font-size: 13px;">${booking.dropoff || "N/A"}</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Total Distance</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">${Number(booking.distance || 0) > 0 ? Number(booking.distance).toFixed(1) + " miles" : "N/A"}</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Vehicle Class</td><td style="padding: 10px 0; color: ${brandGreen}; font-weight: 700; text-align: right;">${booking.vehicle} Class</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Passengers / Bags</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">${booking.passengers || 1} Passengers, ${booking.luggage || 0} Bags</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Flight Number</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">${booking.flightNumber || "N/A"}</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Distance Fare</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">\xA3${Number(booking.distanceFare || booking.price).toFixed(2)}</td></tr>
      ${hasWaiting ? `
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Waiting Time</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">${booking.waitingTime} Minutes</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Waiting Charge Percentage</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">${booking.waitingPercent ? booking.waitingPercent * 100 : 0}%</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Waiting Charge Amount</td><td style="padding: 10px 0; font-weight: 600; text-align: right;">\xA3${Number(booking.waitingChargeAmount || 0).toFixed(2)}</td></tr>
      ` : ""}
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Total Price</td><td style="padding: 10px 0; color: ${brandGreen}; font-weight: 800; text-align: right; font-size: 18px;">\xA3${Number(booking.price).toFixed(2)}</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Payment</td><td style="padding: 10px 0; font-weight: 700; text-align: right;">${paymentDisplay}</td></tr>
      <tr style="border-bottom: 1px solid ${borderSlate};"><td style="padding: 10px 0; color: ${textMuted};">Booking Status</td><td style="padding: 10px 0; font-weight: 700; text-align: right; color: ${booking.status === "Cancelled" ? "#d63638" : "#2271b1"}">${booking.status || "Pending"}</td></tr>
    </table>
  `;
  const commonEmailHtml = (title, subtitle) => `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: ${bgSlate}; padding: 40px 20px; color: ${textDark}; line-height: 1.6; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid ${borderSlate};">
      <div style="background-color: ${brandGreen}; border-radius: 12px 12px 0 0; padding: 30px; text-align: center; margin: -40px -20px 30px -20px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px;">${(ws.business_name || "Travelluxx").toUpperCase()}</h1>
        <p style="color: #a7f3d0; margin: 5px 0 0 0; font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;">Private Hire \u2022 Airport Transfers</p>
      </div>
      <div style="padding: 0 10px;">
        <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: ${textDark};">${title}</h2>
        <p style="color: ${textMuted}; font-size: 14px; margin-bottom: 25px;">
          ${subtitle}
        </p>
        <div style="background: #ecfdf5; border-left: 4px solid ${brandGreen}; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 25px;">
          <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${brandGreen}; font-weight: 700; display: block; margin-bottom: 4px;">Booking Reference</span>
          <strong style="font-size: 18px; color: ${brandGreen}; font-family: monospace;">${booking.id}</strong>
        </div>
        ${detailsTableHtml}
        <p style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 13px; color: #475569; text-align: center;">
          Need to make changes? Call us on <strong style="color: ${textDark};">${ws.whatsapp_number}</strong>.
        </p>
      </div>
    </div>
  `;
  let emailTitle = isConfirmedEmail ? "Booking Confirmed!" : "Booking Request Received";
  let emailSubtitle = isConfirmedEmail ? `Hi <strong>${booking.passengerName}</strong>,<br>Great news! Your booking request has been confirmed. Below are your travel details and final fare summary:` : `Hi <strong>${booking.passengerName}</strong>,<br>We have received your private hire booking request. Our team is verifying vehicle availability, and we will email you a confirmation shortly. Details:`;
  if (isStatusChange) {
    emailTitle = `Booking Status: ${booking.status}`;
    emailSubtitle = `Hi <strong>${booking.passengerName}</strong>,<br>Your booking status has been updated to <strong>${booking.status}</strong>. Please see the updated summary below:`;
  }
  const passengerHtml = commonEmailHtml(emailTitle, emailSubtitle);
  const operatorHtml = commonEmailHtml(
    `[NEW BOOKING REQUEST - ${booking.id}]`,
    `New pending booking registered by <strong>${booking.passengerName}</strong> (${booking.passengerPhone}). Details below:`
  );
  const smtpSettings = readSmtpSettings();
  const fromAddress = `"${ws.business_name}" <${smtpSettings.senderAddress || smtpSettings.smtpUser || ws.business_email}>`;
  const passengerEmail = booking.passengerEmail || booking.email;
  let subjectPrefix = isConfirmedEmail ? "Booking Confirmed" : "Booking Pending Confirmation";
  if (isStatusChange) {
    subjectPrefix = `Booking Update: ${booking.status}`;
  }
  if (passengerEmail) {
    await sendEmailSafely({
      from: fromAddress,
      to: passengerEmail,
      replyTo: ws.business_email,
      subject: `${subjectPrefix}: Ref ${booking.id} - ${ws.business_name}`,
      html: passengerHtml
    });
  }
  if (isStatusChange && ws.business_email) {
    const operatorStatusHtml = commonEmailHtml(
      `[STATUS UPDATE] Ref ${booking.id} - ${booking.status}`,
      `The booking status for <strong>${booking.passengerName}</strong> has been updated to <strong>${booking.status}</strong>. Updated summary below:`
    );
    await sendEmailSafely({
      from: fromAddress,
      to: ws.business_email,
      replyTo: passengerEmail || ws.business_email,
      subject: `[Status Change] Ref ${booking.id} - ${booking.passengerName} is now ${booking.status}`,
      html: operatorStatusHtml
    });
  }
  if (!isStatusChange && ws.business_email) {
    await sendEmailSafely({
      from: fromAddress,
      to: ws.business_email,
      replyTo: passengerEmail || ws.business_email,
      subject: `[New Booking Request] Ref ${booking.id} - ${booking.passengerName || "Passenger"} (${booking.vehicle || "Vehicle"})`,
      html: operatorHtml
    });
  }
}
async function sendContactEmails(inquiry) {
  const ws = getCurrentWebsiteSettings();
  const smtpSettings = readSmtpSettings();
  const fromAddress = `"${ws.business_name}" <${smtpSettings.senderAddress || smtpSettings.smtpUser || ws.business_email}>`;
  const customerHtml = `
    <div style="font-family: sans-serif; padding: 20px; background: #f8fafc; border-radius: 12px;">
      <h2>Inquiry Received</h2>
      <p>Hi ${inquiry.name}, we have received your message and will get back to you under 15 minutes.</p>
      <p><em>"${inquiry.message}"</em></p>
    </div>
  `;
  const operatorHtml = `
    <div style="font-family: sans-serif; background: #0f172a; color: #fff; padding: 20px; border-radius: 12px;">
      <h2>[NEW CONTACT INQUIRY]</h2>
      <p><strong>Name:</strong> ${inquiry.name} (${inquiry.email}, ${inquiry.phone})</p>
      <p><strong>Type:</strong> ${inquiry.type}</p>
      <p><strong>Message:</strong> ${inquiry.message}</p>
    </div>
  `;
  if (inquiry.email) {
    await sendEmailSafely({
      from: fromAddress,
      to: inquiry.email,
      replyTo: ws.business_email,
      subject: `We have received your inquiry - ${ws.business_name}`,
      html: customerHtml
    });
  }
  if (ws.business_email) {
    await sendEmailSafely({
      from: fromAddress,
      to: ws.business_email,
      replyTo: inquiry.email || ws.business_email,
      subject: `[New Inquiry] ${inquiry.name} - ${inquiry.type}`,
      html: operatorHtml
    });
  }
}
var UK_LOCATIONS = {
  "shirley": { lat: 52.414, lng: -1.815, name: "Shirley, Solihull B90" },
  "solihull": { lat: 52.4135, lng: -1.778, name: "Solihull, West Midlands" },
  "birmingham": { lat: 52.4862, lng: -1.8904, name: "Birmingham, West Midlands" },
  "bhx": { lat: 52.4539, lng: -1.7481, name: "Birmingham Airport (BHX)" },
  "lhr": { lat: 51.47, lng: -0.4543, name: "London Heathrow Airport (LHR)" },
  "lgw": { lat: 51.1537, lng: -0.1821, name: "London Gatwick Airport (LGW)" },
  "man": { lat: 53.3588, lng: -2.2727, name: "Manchester Airport (MAN)" }
};
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function generateFallbackRoutePoints(lat1, lng1, lat2, lng2, stepsCount = 10) {
  const points = [];
  const pLat = -(lng2 - lng1);
  const pLng = lat2 - lat1;
  const len = Math.sqrt(pLat * pLat + pLng * pLng);
  for (let i = 0; i <= stepsCount; i++) {
    const ratio = i / stepsCount;
    const midLat = lat1 + (lat2 - lat1) * ratio;
    const midLng = lng1 + (lng2 - lng1) * ratio;
    if (len > 0) {
      const wiggle = Math.sin(ratio * Math.PI) * len * 0.12;
      points.push({ lat: midLat + pLat / len * wiggle, lng: midLng + pLng / len * wiggle });
    } else {
      points.push({ lat: midLat, lng: midLng });
    }
  }
  return points;
}
var app = (0, import_express.default)();
var PORT = 3e3;
app.use((req, res, next) => {
  const host = req.headers.host || "";
  if (host.toLowerCase().startsWith("www.")) {
    const newHost = host.slice(4);
    return res.redirect(301, `https://${newHost}${req.originalUrl}`);
  }
  next();
});
app.use(import_express.default.json({ limit: "50mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", import_express.default.static(import_path.default.join(process.cwd(), "uploads")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.post("/api/distance", async (req, res) => {
  const { pickup, dropoff, pickupCoords, dropoffCoords, stops, precalculated } = req.body;
  if (!pickup || !dropoff) {
    return res.status(400).json({ error: "Pickup and Dropoff locations are required." });
  }
  const pricing = getCurrentPricingSettings();
  let pCoords = pickupCoords ? { lat: Number(pickupCoords.lat), lng: Number(pickupCoords.lng), name: pickup } : UK_LOCATIONS.shirley;
  let dCoords = dropoffCoords ? { lat: Number(dropoffCoords.lat), lng: Number(dropoffCoords.lng), name: dropoff } : UK_LOCATIONS.bhx;
  let distance = precalculated?.distanceMiles ? Number(precalculated.distanceMiles) : getHaversineDistance(pCoords.lat, pCoords.lng, dCoords.lat, dCoords.lng) * 1.25;
  if (isNaN(distance) || distance < 1) distance = 15;
  let duration = precalculated?.timeMinutes ? Math.round(Number(precalculated.timeMinutes)) : Math.round(distance / 45 * 60);
  const effectiveDist = Math.max(distance, pricing.minimum_billable_distance);
  const stopCount = Array.isArray(stops) ? stops.length : 0;
  const stopFee = stopCount * (pricing.extra_stop_charge || 10);
  let totalWaitingMins = 0;
  if (Array.isArray(stops)) {
    stops.forEach((s) => {
      totalWaitingMins += Number(s.waiting || 0);
    });
  }
  const waitingChargeAmount = totalWaitingMins * (pricing.break_time_charge || 0.5);
  const prices = {
    Economy: Number((effectiveDist * pricing.economy_price_per_mile + stopFee + waitingChargeAmount).toFixed(2)),
    Luxury: Number((effectiveDist * pricing.luxury_price_per_mile + stopFee + waitingChargeAmount).toFixed(2)),
    Family: Number((effectiveDist * pricing.family_price_per_mile + stopFee + waitingChargeAmount).toFixed(2))
  };
  const routePoints = precalculated?.routePoints && precalculated.routePoints.length > 0 ? precalculated.routePoints : generateFallbackRoutePoints(pCoords.lat, pCoords.lng, dCoords.lat, dCoords.lng);
  return res.json({
    distance: Number(distance.toFixed(1)),
    duration,
    prices,
    routePoints,
    pickupCoords: pCoords,
    dropoffCoords: dCoords,
    waitingTime: totalWaitingMins,
    waitingChargeAmount: Number(waitingChargeAmount.toFixed(2))
  });
});
app.post("/api/bookings", async (req, res) => {
  try {
    await connectToDatabase();
    const data = req.body;
    const bookingId = `WLC-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const newBooking = {
      id: bookingId,
      ...data,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const bookings = readBookings();
    bookings.unshift(newBooking);
    writeBookings(bookings);
    if (import_mongoose.default.connection.readyState === 1) {
      const dbBooking = new BookingModel(newBooking);
      await dbBooking.save();
      console.log("\u{1F4BE} Saved booking to MongoDB!");
    } else {
      console.warn("\u26A0\uFE0F MongoDB connection not active, trying to connect...");
      await connectToDatabase();
      const dbBooking = new BookingModel(newBooking);
      await dbBooking.save();
      console.log("\u{1F4BE} Saved booking to MongoDB after reconnect!");
    }
    await sendBookingEmails(newBooking).catch((err) => console.error("Booking email error:", err));
    sendWhatsAppNotification(newBooking).catch((err) => console.error("WhatsApp notification error:", err));
    return res.json({ success: true, booking: newBooking });
  } catch (err) {
    console.error("Failed to create booking:", err);
    return res.status(500).json({ error: err.message || "Failed to create booking" });
  }
});
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const envEmail = (process.env.ADMIN_EMAIL || "info@travelluxx.co.uk").toLowerCase().trim();
  const envPassword = process.env.ADMIN_PASSWORD || "Travelluxx2026@";
  const inputUser = (username || "").toLowerCase().trim();
  if ((inputUser === envEmail || inputUser === "admin") && password === envPassword) {
    return res.json({ success: true, token: "admin-auth-token-travelluxx-2026" });
  }
  return res.status(401).json({ success: false, error: "Invalid username or password" });
});
app.get("/api/admin/bookings", async (req, res) => {
  try {
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      const rows = await BookingModel.find({
        $or: [
          { paymentMethod: { $ne: "Mollie" } },
          { paymentMethod: "Mollie", paymentStatus: "Paid" }
        ]
      }).sort({ createdAt: -1 });
      return res.json(rows.map((r) => r.toObject ? r.toObject() : r));
    }
  } catch (e) {
    console.error("Error reading from MongoDB bookings:", e.message);
  }
  const bookings = readBookings().filter(
    (b) => b.paymentMethod !== "Mollie" || b.paymentStatus === "Paid"
  );
  return res.json(bookings);
});
app.put("/api/admin/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;
  try {
    await connectToDatabase();
    let oldBooking = null;
    let updatedBooking = null;
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (import_mongoose.default.connection.readyState === 1) {
      const dbBooking = await BookingModel.findOne({ id });
      if (dbBooking) {
        oldBooking = dbBooking.toObject ? dbBooking.toObject() : dbBooking;
        if (status) {
          const current = oldBooking.status || "Pending";
          let allowed = false;
          if (current === status) allowed = true;
          else if (current === "Pending") allowed = status === "Confirmed" || status === "Cancelled";
          else if (current === "Confirmed") allowed = status === "Completed" || status === "Cancelled";
          if (!allowed) {
            return res.status(400).json({ error: `Invalid status transition from ${current} to ${status}` });
          }
        }
        const newDbBooking = await BookingModel.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
        updatedBooking = newDbBooking.toObject ? newDbBooking.toObject() : newDbBooking;
      }
    }
    const bookings = readBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      if (!oldBooking) {
        oldBooking = { ...bookings[index] };
      }
      if (status) {
        const current = oldBooking.status || "Pending";
        let allowed = false;
        if (current === status) allowed = true;
        else if (current === "Pending") allowed = status === "Confirmed" || status === "Cancelled";
        else if (current === "Confirmed") allowed = status === "Completed" || status === "Cancelled";
        if (!allowed) {
          return res.status(400).json({ error: `Invalid status transition from ${current} to ${status}` });
        }
      }
      if (status) bookings[index].status = status;
      if (paymentStatus) bookings[index].paymentStatus = paymentStatus;
      writeBookings(bookings);
      if (!updatedBooking) {
        updatedBooking = { ...bookings[index] };
      }
    }
    if (!oldBooking && !updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    const isStatusOrPaymentChanged = status && status !== oldBooking?.status || paymentStatus && paymentStatus !== oldBooking?.paymentStatus;
    if (isStatusOrPaymentChanged && updatedBooking) {
      await sendBookingEmails(updatedBooking, status === "Confirmed", true).catch((err) => console.error("Status update email error:", err));
    }
    return res.json({ success: true, booking: updatedBooking });
  } catch (e) {
    console.error("Error updating booking status:", e.message);
    return res.status(500).json({ error: e.message });
  }
});
app.delete("/api/admin/bookings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    await BookingModel.deleteOne({ id });
  } catch (e) {
  }
  let bookings = readBookings();
  bookings = bookings.filter((b) => b.id !== id);
  writeBookings(bookings);
  return res.json({ success: true });
});
app.get("/api/posts", async (req, res) => {
  try {
    await connectToDatabase();
    const posts2 = await PostModel.find({ published: 1 }).sort({ createdAt: -1 });
    if (posts2 && posts2.length > 0) return res.json(posts2);
  } catch (e) {
  }
  const posts = readPosts();
  return res.json(posts.filter((p) => p.published !== false));
});
app.get("/api/posts/:slug", async (req, res) => {
  try {
    await connectToDatabase();
    const post2 = await PostModel.findOne({ slug: req.params.slug });
    if (post2) return res.json(post2);
  } catch (e) {
  }
  const post = readPosts().find((p) => p.slug === req.params.slug);
  if (post) return res.json(post);
  return res.status(404).json({ error: "Post not found" });
});
app.get("/api/admin/posts", async (req, res) => {
  try {
    await connectToDatabase();
    const rows = await PostModel.find().sort({ createdAt: -1 });
    if (rows && rows.length > 0) return res.json(rows);
  } catch (e) {
  }
  return res.json(readPosts());
});
app.post("/api/admin/posts", async (req, res) => {
  try {
    await connectToDatabase();
    const newPost = {
      id: `post-${Date.now()}`,
      slug: req.body.slug || (req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : `post-${Date.now()}`),
      title: req.body.title || "",
      excerpt: req.body.excerpt || "",
      content: req.body.content || "",
      image: req.body.image || "",
      author: req.body.author || "Travelluxx Editorial",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      published: req.body.published !== false ? 1 : 0,
      metaTitle: req.body.metaTitle || "",
      metaDescription: req.body.metaDescription || "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const posts = readPosts();
    posts.unshift(newPost);
    writePosts(posts);
    try {
      await PostModel.findOneAndUpdate({ id: newPost.id }, newPost, { upsert: true });
      console.log("\u{1F4BE} Saved Post to MongoDB!");
    } catch (e) {
      console.error("MongoDB Post error:", e.message);
    }
    return res.json({ success: true, post: newPost });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to create post" });
  }
});
app.put("/api/admin/posts/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  delete updateData._id;
  delete updateData.__v;
  try {
    await connectToDatabase();
    await PostModel.findOneAndUpdate({ id }, { $set: updateData });
  } catch (e) {
    console.error("Error updating MongoDB post:", e);
  }
  const posts = readPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...req.body };
    writePosts(posts);
    return res.json({ success: true, post: posts[index] });
  }
  return res.status(404).json({ error: "Post not found" });
});
app.delete("/api/admin/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    await PostModel.deleteOne({ id });
  } catch (e) {
  }
  let posts = readPosts();
  posts = posts.filter((p) => p.id !== id);
  writePosts(posts);
  return res.json({ success: true });
});
app.get("/api/admin/settings", async (req, res) => {
  try {
    await connectToDatabase();
    await syncSettingsFromDb();
  } catch (e) {
  }
  const settings = getCurrentWebsiteSettings();
  const mollieApiKey = process.env.MOLLIE_API_KEY || cachedMollieApiKey || settings?.mollie_api_key || "";
  return res.json({ ...settings, mollie_api_key: mollieApiKey });
});
app.post("/api/admin/settings", async (req, res) => {
  try {
    await connectToDatabase();
    const { mollie_api_key, ...otherSettings } = req.body;
    const current = getCurrentWebsiteSettings();
    const updated = { ...current, ...otherSettings };
    if (mollie_api_key !== void 0) {
      updated.mollie_api_key = mollie_api_key;
      cachedMollieApiKey = mollie_api_key;
      process.env.MOLLIE_API_KEY = mollie_api_key;
      if (import_mongoose.default.connection.readyState === 1) {
        await SettingModel.findOneAndUpdate({ key: "mollie_api_key" }, { value: mollie_api_key }, { upsert: true });
        console.log("\u{1F4BE} Saved Mollie API Key to MongoDB!");
      }
    }
    cachedWebsiteSettings = updated;
    if (import_mongoose.default.connection.readyState === 1) {
      await SettingModel.findOneAndUpdate({ key: "website" }, { value: updated }, { upsert: true });
      console.log("\u{1F4BE} Saved admin settings to MongoDB!");
    }
    if (!process.env.VERCEL) {
      import_fs.default.writeFileSync(SETTINGS_PATH, JSON.stringify(otherSettings, null, 2));
      if (mollie_api_key !== void 0) {
        const envPath = import_path.default.join(process.cwd(), ".env");
        let envContent = "";
        if (import_fs.default.existsSync(envPath)) {
          envContent = import_fs.default.readFileSync(envPath, "utf8");
        }
        if (envContent.includes("MOLLIE_API_KEY=")) {
          envContent = envContent.replace(/MOLLIE_API_KEY=.*/g, `MOLLIE_API_KEY=${mollie_api_key}`);
        } else {
          envContent += `
MOLLIE_API_KEY=${mollie_api_key}
`;
        }
        import_fs.default.writeFileSync(envPath, envContent);
      }
    }
    return res.json({ success: true, message: "Settings updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to save settings" });
  }
});
app.get("/api/pages", async (req, res) => {
  try {
    await connectToDatabase();
    const pages = await PageModel.find();
    if (pages && pages.length > 0) return res.json(pages);
  } catch (e) {
  }
  return res.json(readPages());
});
app.get("/api/pages/:slug", async (req, res) => {
  try {
    await connectToDatabase();
    const page2 = await PageModel.findOne({ slug: req.params.slug });
    if (page2) return res.json(page2);
  } catch (e) {
  }
  const page = readPages().find((p) => p.slug === req.params.slug);
  if (page) return res.json(page);
  return res.status(404).json({ error: "Page not found" });
});
app.get("/api/admin/pages", async (req, res) => {
  try {
    await connectToDatabase();
    const pages = await PageModel.find();
    if (pages && pages.length > 0) return res.json(pages);
  } catch (e) {
  }
  return res.json(readPages());
});
app.post("/api/admin/pages", async (req, res) => {
  try {
    await connectToDatabase();
    const pages = readPages();
    const newPage = {
      id: `page-${Date.now()}`,
      slug: req.body.slug || req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `page-${Date.now()}`,
      ...req.body,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    pages.push(newPage);
    writePages(pages);
    try {
      await PageModel.findOneAndUpdate({ id: newPage.id }, newPage, { upsert: true });
      console.log("\u{1F4BE} Saved Page to MongoDB!");
    } catch (e) {
    }
    return res.json({ success: true, page: newPage });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to create page" });
  }
});
app.put("/api/admin/pages/:id", async (req, res) => {
  const updateData = { ...req.body };
  delete updateData._id;
  delete updateData.__v;
  try {
    await connectToDatabase();
    await PageModel.findOneAndUpdate({ id: req.params.id }, { ...updateData, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
  } catch (e) {
    console.error("Error updating MongoDB page:", e);
  }
  const pages = readPages();
  const idx = pages.findIndex((p) => p.id === req.params.id);
  if (idx !== -1) {
    pages[idx] = { ...pages[idx], ...req.body, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    writePages(pages);
    return res.json({ success: true, page: pages[idx] });
  }
  return res.status(404).json({ error: "Page not found" });
});
app.delete("/api/admin/pages/:id", async (req, res) => {
  try {
    await connectToDatabase();
    await PageModel.deleteOne({ id: req.params.id });
  } catch (e) {
  }
  writePages(readPages().filter((p) => p.id !== req.params.id));
  return res.json({ success: true });
});
app.get("/api/services", async (req, res) => {
  try {
    await connectToDatabase();
    const services = await ServiceModel.find({ published: true }).sort({ order: 1, createdAt: 1 });
    if (services && services.length > 0) return res.json(services);
  } catch (e) {
  }
  const local = readServices().filter((s) => s.published !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  return res.json(local);
});
app.get("/api/services/:slug", async (req, res) => {
  try {
    await connectToDatabase();
    const service2 = await ServiceModel.findOne({ slug: req.params.slug });
    if (service2) return res.json(service2);
  } catch (e) {
  }
  const service = readServices().find((s) => s.slug === req.params.slug);
  if (service) return res.json(service);
  return res.status(404).json({ error: "Service not found" });
});
app.get("/api/admin/services", async (req, res) => {
  try {
    await connectToDatabase();
    const services = await ServiceModel.find().sort({ order: 1, createdAt: 1 });
    if (services && services.length > 0) return res.json(services);
  } catch (e) {
  }
  return res.json(readServices().sort((a, b) => (a.order || 0) - (b.order || 0)));
});
app.post("/api/admin/services", async (req, res) => {
  try {
    await connectToDatabase();
    const services = readServices();
    const rawSlug = req.body.slug || req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `service-${Date.now()}`;
    const newService = {
      id: `service-${Date.now()}`,
      slug: rawSlug,
      title: req.body.title || "Untitled Service",
      excerpt: req.body.excerpt || "",
      content: req.body.content || "",
      image: req.body.image || "",
      heroImage: req.body.heroImage || "",
      icon: req.body.icon || "Car",
      features: Array.isArray(req.body.features) ? req.body.features : [],
      priceText: req.body.priceText || "",
      published: req.body.published !== false,
      order: Number(req.body.order || services.length + 1),
      metaTitle: req.body.metaTitle || req.body.title,
      metaDescription: req.body.metaDescription || req.body.excerpt,
      noIndexNoFollow: !!req.body.noIndexNoFollow,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    services.push(newService);
    writeServices(services);
    try {
      await ServiceModel.findOneAndUpdate({ id: newService.id }, newService, { upsert: true });
      console.log("\u{1F4BE} Saved Service to MongoDB!");
    } catch (e) {
    }
    return res.json({ success: true, service: newService });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to create service" });
  }
});
app.put("/api/admin/services/:id", async (req, res) => {
  const updateData = { ...req.body };
  delete updateData._id;
  delete updateData.__v;
  updateData.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  if (updateData.order !== void 0) updateData.order = Number(updateData.order);
  if (updateData.published !== void 0) updateData.published = !!updateData.published;
  try {
    await connectToDatabase();
    await ServiceModel.findOneAndUpdate({ id: req.params.id }, updateData);
  } catch (e) {
    console.error("Error updating MongoDB service:", e);
  }
  const services = readServices();
  const idx = services.findIndex((s) => s.id === req.params.id);
  if (idx !== -1) {
    services[idx] = { ...services[idx], ...updateData };
    writeServices(services);
    return res.json({ success: true, service: services[idx] });
  }
  return res.status(404).json({ error: "Service not found" });
});
app.delete("/api/admin/services/:id", async (req, res) => {
  try {
    await connectToDatabase();
    await ServiceModel.deleteOne({ id: req.params.id });
  } catch (e) {
  }
  writeServices(readServices().filter((s) => s.id !== req.params.id));
  return res.json({ success: true });
});
app.get("/api/services-page-settings", async (req, res) => {
  try {
    await connectToDatabase();
    const doc = await SettingModel.findOne({ key: "services_page_settings" });
    if (doc && doc.value) return res.json(doc.value);
  } catch (e) {
  }
  return res.json(readServicesSettings());
});
app.post("/api/admin/services-page-settings", async (req, res) => {
  const newSettings = req.body || {};
  try {
    await connectToDatabase();
    await SettingModel.findOneAndUpdate(
      { key: "services_page_settings" },
      { key: "services_page_settings", value: newSettings },
      { upsert: true }
    );
  } catch (e) {
  }
  writeServicesSettings(newSettings);
  return res.json({ success: true, settings: newSettings });
});
var MENU_PATH = import_path.default.join(process.cwd(), "menu.json");
function readMenu() {
  if (cachedMenu) return cachedMenu;
  try {
    if (import_fs.default.existsSync(MENU_PATH)) {
      cachedMenu = JSON.parse(import_fs.default.readFileSync(MENU_PATH, "utf8"));
      return cachedMenu;
    }
  } catch (e) {
  }
  cachedMenu = [
    { id: "1", label: "Book Now", href: "/#calculator", target: "_self" },
    { id: "2", label: "Services", href: "/services", target: "_self" },
    { id: "3", label: "Blog", href: "/blog", target: "_self" },
    { id: "4", label: "Contact", href: "/#contact", target: "_self" }
  ];
  return cachedMenu;
}
app.get("/api/menu", async (req, res) => {
  try {
    await connectToDatabase();
    await syncSettingsFromDb();
  } catch (e) {
  }
  return res.json(readMenu());
});
app.post("/api/admin/menu", async (req, res) => {
  try {
    await connectToDatabase();
    cachedMenu = req.body;
    if (import_mongoose.default.connection.readyState === 1) {
      await SettingModel.findOneAndUpdate({ key: "menu" }, { value: req.body }, { upsert: true });
      console.log("\u{1F4BE} Saved menu to MongoDB!");
    }
    if (!process.env.VERCEL) {
      import_fs.default.writeFileSync(MENU_PATH, JSON.stringify(req.body, null, 2));
    }
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
app.post("/api/admin/upload", async (req, res) => {
  try {
    await connectToDatabase();
    const { filename, data } = req.body;
    if (!filename || !data) return res.status(400).json({ error: "filename and data required" });
    const matches = data.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: "Invalid base64 data" });
    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const safeFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    if (import_mongoose.default.connection.readyState === 1) {
      const uploadDoc = new UploadModel({
        filename: safeFilename,
        mimeType,
        data: buffer
      });
      await uploadDoc.save();
      console.log(`\u{1F4BE} Successfully uploaded ${safeFilename} to MongoDB virtual FS!`);
    }
    if (!process.env.VERCEL) {
      const uploadDir = import_path.default.join(process.cwd(), "public", "uploads");
      import_fs.default.mkdirSync(uploadDir, { recursive: true });
      import_fs.default.writeFileSync(import_path.default.join(uploadDir, safeFilename), buffer);
      const distUploadDir = import_path.default.join(process.cwd(), "dist", "uploads");
      import_fs.default.mkdirSync(distUploadDir, { recursive: true });
      import_fs.default.writeFileSync(import_path.default.join(distUploadDir, safeFilename), buffer);
    }
    return res.json({ success: true, url: `/uploads/${safeFilename}`, filename: safeFilename });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
app.get("/api/admin/media", async (req, res) => {
  try {
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      const uploads = await UploadModel.find({}, "filename");
      const urls = uploads.map((u) => `/uploads/${u.filename}`);
      return res.json(urls);
    }
  } catch (e) {
    console.error("Error fetching media from DB:", e.message);
  }
  try {
    const uploadDir = import_path.default.join(process.cwd(), "public", "uploads");
    if (import_fs.default.existsSync(uploadDir)) {
      const files = import_fs.default.readdirSync(uploadDir);
      return res.json(files.map((f) => `/uploads/${f}`));
    }
  } catch (e) {
  }
  return res.json([]);
});
app.delete("/api/admin/media/:filename", async (req, res) => {
  try {
    await connectToDatabase();
    const { filename } = req.params;
    if (import_mongoose.default.connection.readyState === 1) {
      await UploadModel.deleteOne({ filename });
    }
    const localPath = import_path.default.join(process.cwd(), "public", "uploads", filename);
    if (import_fs.default.existsSync(localPath)) {
      import_fs.default.unlinkSync(localPath);
    }
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
app.get("/uploads/:filename", async (req, res, next) => {
  try {
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      const uploadDoc = await UploadModel.findOne({ filename: req.params.filename });
      if (uploadDoc && uploadDoc.data) {
        res.setHeader("Content-Type", uploadDoc.mimeType || "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.send(uploadDoc.data);
      }
    }
  } catch (e) {
    console.error("Error serving virtual upload:", e);
  }
  next();
});
app.use("/uploads", import_express.default.static(import_path.default.join(process.cwd(), "public", "uploads")));
app.get("/api/places/autocomplete", async (req, res) => {
  const query = (req.query.q || "").trim();
  if (!query || query.length < 2) {
    return res.json([]);
  }
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8`;
    const response = await fetch(photonUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.features && data.features.length > 0) {
        const results = data.features.map((f) => {
          const p = f.properties || {};
          const name = p.name || "";
          const street = [p.housenumber, p.street].filter(Boolean).join(" ");
          const locParts = [street, p.city || p.town || p.district, p.postcode, p.country].filter(Boolean);
          const fullLabel = [name, ...locParts].filter((v, i, a) => v && a.indexOf(v) === i).join(", ");
          const isAirport = name.toLowerCase().includes("airport") || p.osm_value && p.osm_value.includes("aerodrome");
          return {
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
            name: fullLabel || name,
            mainText: name || locParts[0] || fullLabel,
            secondaryText: locParts.join(", "),
            type: isAirport ? "airport" : "address"
          };
        });
        return res.json(results);
      }
    }
  } catch (err) {
    console.warn("Backend Photon search error:", err);
  }
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=gb&limit=6&addressdetails=1`;
    const nomRes = await fetch(nomUrl, { headers: { "User-Agent": "TravelluxxApp/1.0", "Accept-Language": "en" } });
    if (nomRes.ok) {
      const nomData = await nomRes.json();
      const results = nomData.map((item) => {
        const parts = (item.display_name || "").split(",");
        return {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          name: item.display_name,
          mainText: parts[0]?.trim() || item.display_name,
          secondaryText: parts.slice(1, 3).map((p) => p.trim()).join(", "),
          type: item.display_name.toLowerCase().includes("airport") ? "airport" : "address"
        };
      });
      return res.json(results);
    }
  } catch (e) {
    console.warn("Backend Nominatim fallback error:", e);
  }
  return res.json([]);
});
app.post("/api/admin/register", (req, res) => {
  return res.status(403).json({ error: "Registration is disabled" });
});
app.post("/api/bookings/payment-simulate", async (req, res) => {
  const { bookingId } = req.body;
  try {
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      await BookingModel.findOneAndUpdate(
        { id: bookingId },
        { $set: { paymentStatus: "Paid", status: "Pending" } }
      );
      console.log(`\u{1F4BE} Simulated payment (Paid, Pending) for ${bookingId} in MongoDB!`);
    }
    const bookings = readBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.paymentStatus = "Paid";
      booking.status = "Pending";
      writeBookings(bookings);
    }
    return res.json({ success: true, transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}` });
  } catch (err) {
    console.error("Simulation error:", err);
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/mollie/create-payment", async (req, res) => {
  try {
    const bookingData = req.body;
    const mollieClient = getMollieClient();
    if (!mollieClient) {
      return res.status(400).json({
        success: false,
        error: "Mollie API key is missing. Please configure MOLLIE_API_KEY in your .env file or in Website Settings in Admin Panel."
      });
    }
    const bookings = readBookings();
    const bookingId = bookingData.id || `WLC-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
    let booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      booking = {
        id: bookingId,
        ...bookingData,
        paymentMethod: "Mollie",
        paymentStatus: "Pending (Mollie)",
        status: "Pending Payment",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      bookings.unshift(booking);
      writeBookings(bookings);
      if (import_mongoose.default.connection.readyState === 1) {
        const dbBooking = new BookingModel(booking);
        await dbBooking.save().catch((e) => console.error("Error saving draft booking to MongoDB:", e));
      }
    }
    const appUrl = (process.env.APP_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
    const rawPrice = Number(bookingData.price || booking.price || 0);
    const amountVal = rawPrice > 0 ? rawPrice.toFixed(2) : "10.00";
    const payment = await mollieClient.payments.create({
      amount: {
        currency: "GBP",
        value: amountVal
      },
      description: `TravelLuxx Booking Ref: ${bookingId}`,
      redirectUrl: `${appUrl}/?bookingStatus=success&bookingId=${bookingId}`,
      webhookUrl: `${appUrl}/api/mollie/webhook`,
      metadata: {
        bookingId,
        passengerName: booking.passengerName || booking.name || "",
        email: booking.email || ""
      }
    });
    booking.molliePaymentId = payment.id;
    writeBookings(bookings);
    const checkoutUrl = payment.getCheckoutUrl();
    return res.json({
      success: true,
      checkoutUrl,
      bookingId,
      molliePaymentId: payment.id
    });
  } catch (err) {
    console.error("Mollie payment creation error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to create Mollie payment"
    });
  }
});
app.post("/api/mollie/webhook", async (req, res) => {
  try {
    const paymentId = req.body?.id;
    if (!paymentId) {
      return res.status(400).send("Missing payment id");
    }
    const mollieClient = getMollieClient();
    if (!mollieClient) {
      return res.status(400).send("Mollie not configured");
    }
    const payment = await mollieClient.payments.get(paymentId);
    const metadata = payment.metadata;
    const bookingId = metadata?.bookingId;
    if (bookingId) {
      const bookings = readBookings();
      const booking = bookings.find((b) => b.id === bookingId || b.molliePaymentId === paymentId);
      if (booking) {
        if (payment.status === "paid") {
          booking.paymentStatus = "Paid";
          booking.status = "Pending";
          booking.paymentMethod = "Mollie";
          writeBookings(bookings);
          if (import_mongoose.default.connection.readyState === 1) {
            await BookingModel.findOneAndUpdate(
              { id: bookingId },
              { $set: { paymentStatus: "Paid", status: "Pending", paymentMethod: "Mollie" } }
            );
          }
          sendBookingEmails(booking).catch((err) => console.error("Mollie email error:", err));
          sendWhatsAppNotification(booking).catch((err) => console.error("Mollie WhatsApp error:", err));
        } else if (payment.status === "canceled" || payment.status === "expired" || payment.status === "failed") {
          booking.paymentStatus = "Failed/Canceled";
          booking.status = "Canceled";
          writeBookings(bookings);
          if (import_mongoose.default.connection.readyState === 1) {
            await BookingModel.findOneAndUpdate(
              { id: bookingId },
              { $set: { paymentStatus: "Failed/Canceled", status: "Canceled" } }
            );
          }
        }
      }
    }
    return res.status(200).send("OK");
  } catch (err) {
    console.error("Mollie webhook error:", err);
    return res.status(500).send("Webhook error");
  }
});
app.get("/api/mollie/status/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  try {
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      const dbBooking = await BookingModel.findOne({ id: bookingId });
      if (dbBooking) {
        const b = dbBooking.toObject ? dbBooking.toObject() : dbBooking;
        return res.json({
          success: true,
          bookingId: b.id,
          paymentStatus: b.paymentStatus,
          status: b.status
        });
      }
    }
  } catch (e) {
  }
  const bookings = readBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }
  return res.json({
    success: true,
    bookingId: booking.id,
    paymentStatus: booking.paymentStatus,
    status: booking.status
  });
});
app.post("/api/contact", async (req, res) => {
  try {
    await connectToDatabase();
    const inquiry = {
      id: `INQ-${Math.floor(1e3 + Math.random() * 9e3)}`,
      ...req.body,
      status: "Unread",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const inquiries = readInquiries();
    inquiries.unshift(inquiry);
    writeInquiries(inquiries);
    try {
      if (import_mongoose.default.connection.readyState === 1) {
        const dbInquiry = new InquiryModel(inquiry);
        await dbInquiry.save();
        console.log("\u{1F4BE} Saved contact inquiry to MongoDB!");
      }
    } catch (err) {
      console.error("MongoDB inquiry save error:", err.message);
    }
    await sendContactEmails(inquiry).catch((err) => console.error("Contact email error:", err));
    return res.json({ success: true, inquiry });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/admin/inquiries", async (req, res) => {
  try {
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      const rows = await InquiryModel.find().sort({ createdAt: -1 });
      return res.json(rows.map((r) => r.toObject ? r.toObject() : r));
    }
  } catch (e) {
    console.error("Error reading from MongoDB inquiries:", e.message);
  }
  return res.json(readInquiries());
});
app.delete("/api/admin/inquiries/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      await InquiryModel.deleteOne({ id });
    }
  } catch (e) {
  }
  let inquiries = readInquiries();
  inquiries = inquiries.filter((i) => i.id !== id);
  writeInquiries(inquiries);
  return res.json({ success: true });
});
app.get("/api/pricing", async (req, res) => {
  try {
    await connectToDatabase();
    await syncSettingsFromDb();
  } catch (e) {
  }
  res.json(getCurrentPricingSettings());
});
app.get("/api/settings", async (req, res) => {
  try {
    await connectToDatabase();
    await syncSettingsFromDb();
  } catch (e) {
  }
  res.json(getCurrentWebsiteSettings());
});
app.post("/api/settings", async (req, res) => {
  try {
    await connectToDatabase();
    const current = getCurrentWebsiteSettings();
    const updated = { ...current, ...req.body };
    cachedWebsiteSettings = updated;
    if (import_mongoose.default.connection.readyState === 1) {
      await SettingModel.findOneAndUpdate({ key: "website" }, { value: updated }, { upsert: true });
      console.log("\u{1F4BE} Saved website settings to MongoDB!");
    }
    if (!process.env.VERCEL) {
      import_fs.default.writeFileSync(SETTINGS_PATH, JSON.stringify(updated, null, 2));
    }
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update settings" });
  }
});
app.get("/api/smtp-settings", async (req, res) => {
  try {
    await connectToDatabase();
    await syncSettingsFromDb();
  } catch (e) {
  }
  const smtp = readSmtpSettings();
  res.json({
    smtpHost: smtp.smtpHost,
    smtpPort: smtp.smtpPort,
    smtpUser: smtp.smtpUser,
    smtpPass: smtp.smtpPass ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : "",
    smtpSecure: smtp.smtpSecure,
    senderAddress: smtp.senderAddress
  });
});
app.post("/api/smtp-settings", async (req, res) => {
  try {
    await connectToDatabase();
    const { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, senderAddress } = req.body;
    const current = readSmtpSettings();
    const updated = {
      smtpHost: smtpHost || current.smtpHost,
      smtpPort: smtpPort || current.smtpPort,
      smtpUser: smtpUser || current.smtpUser,
      smtpPass: smtpPass && smtpPass !== "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" ? smtpPass : current.smtpPass,
      smtpSecure: smtpSecure !== void 0 ? smtpSecure : current.smtpSecure,
      senderAddress: senderAddress || current.senderAddress || smtpUser || current.smtpUser
    };
    cachedSmtpSettings = updated;
    if (import_mongoose.default.connection.readyState === 1) {
      await SettingModel.findOneAndUpdate({ key: "smtp" }, { value: updated }, { upsert: true });
      console.log("\u{1F4BE} Saved SMTP settings to MongoDB!");
    }
    if (!process.env.VERCEL) {
      import_fs.default.writeFileSync(SMTP_PATH, JSON.stringify(updated, null, 2));
    }
    res.json({ success: true, smtp: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to save SMTP settings" });
  }
});
app.post("/api/test-email", async (req, res) => {
  try {
    const { recipientEmail } = req.body;
    const ws = getCurrentWebsiteSettings();
    const target = recipientEmail || ws.business_email || "info@travelluxx.co.uk";
    const smtpSettings = readSmtpSettings();
    const result = await sendEmailSafely({
      from: `"${ws.business_name}" <${smtpSettings.senderAddress || smtpSettings.smtpUser || ws.business_email}>`,
      to: target,
      subject: `Test Email from ${ws.business_name}`,
      text: `Hello! This is a test email sent from ${ws.business_name} at ${(/* @__PURE__ */ new Date()).toLocaleString()}. SMTP is functioning properly.`
    });
    if (result.success) {
      return res.json({ success: true, message: `Test email sent successfully to ${target}`, messageId: result.messageId });
    } else {
      return res.status(500).json({ success: false, error: result.error || "Failed to send test email" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || "Test email exception" });
  }
});
app.post("/api/settings/logo", async (req, res) => {
  try {
    await connectToDatabase();
    const { logo } = req.body;
    if (!logo) {
      return res.status(400).json({ error: "No logo data provided" });
    }
    const current = getCurrentWebsiteSettings();
    const updated = { ...current, logo_image: logo, logoImage: logo };
    cachedWebsiteSettings = updated;
    if (import_mongoose.default.connection.readyState === 1) {
      await SettingModel.findOneAndUpdate({ key: "website" }, { value: updated }, { upsert: true });
      console.log("\u{1F4BE} Saved website settings logo to MongoDB!");
    }
    if (!process.env.VERCEL) {
      import_fs.default.writeFileSync(SETTINGS_PATH, JSON.stringify(updated, null, 2));
    }
    res.json({ success: true, logo, settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to save logo" });
  }
});
app.post("/api/stats/click", (req, res) => {
  res.json({ success: true });
});
app.post("/api/stats/visit", (req, res) => {
  res.json({ success: true });
});
app.post("/api/save-asset-image", (req, res) => {
  try {
    const { key, base64 } = req.body;
    if (!key || !base64) {
      return res.status(400).json({ error: "Missing key or base64 data" });
    }
    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: "Invalid base64 format" });
    }
    const imageBuffer = Buffer.from(matches[2], "base64");
    const keyToFileMap = {
      logo: "travelluxx_logo_1786403432815.jpg",
      hero_bg: "hero_background_1786403449488.jpg",
      fleet_Economy: "fleet_economy_1786403470397.jpg",
      fleet_Luxury: "fleet_luxury_1786403483244.jpg",
      fleet_Family: "fleet_family_1786403496325.jpg",
      transfer_airport: "transfer_airport_1786403518712.jpg",
      transfer_port: "transfer_port_1786403532912.jpg",
      transfer_station: "transfer_station_1786403548164.jpg",
      transfer_city: "transfer_city_1786403562698.jpg",
      transfer_business: "transfer_business_1786403576291.jpg"
    };
    const fileName = keyToFileMap[key];
    if (!fileName) {
      return res.status(400).json({ error: "Unknown image key: " + key });
    }
    const targetPath = import_path.default.join(process.cwd(), "src", "assets", "images", fileName);
    import_fs.default.mkdirSync(import_path.default.dirname(targetPath), { recursive: true });
    import_fs.default.writeFileSync(targetPath, imageBuffer);
    const distPath = import_path.default.join(process.cwd(), "dist", "assets", "images", fileName);
    if (import_fs.default.existsSync(import_path.default.dirname(distPath))) {
      import_fs.default.writeFileSync(distPath, imageBuffer);
    }
    console.log(`[ASSETS] Successfully saved asset image key ${key} to ${targetPath}`);
    return res.json({ success: true, fileName, path: targetPath });
  } catch (err) {
    console.error("Error saving asset image:", err);
    return res.status(500).json({ error: err.message || "Failed to save asset image" });
  }
});
app.get("/sitemap.xml", async (req, res) => {
  const baseUrl = "https://travelluxx.co.uk";
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  let pages = [];
  let posts = [];
  let mediaImages = [];
  try {
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      const dbPages = await PageModel.find({ published: { $ne: false } });
      pages = dbPages.map((p) => p.toObject ? p.toObject() : p);
      const dbPosts = await PostModel.find({ published: { $ne: false } });
      posts = dbPosts.map((p) => p.toObject ? p.toObject() : p);
    }
  } catch (e) {
  }
  if (pages.length === 0) {
    pages = readPages().filter((p) => p.published !== false);
  }
  if (posts.length === 0) {
    posts = readPosts().filter((p) => p.published !== false);
  }
  try {
    const uploadsDir = import_path.default.join(process.cwd(), "public", "uploads");
    if (import_fs.default.existsSync(uploadsDir)) {
      const files = import_fs.default.readdirSync(uploadsDir);
      mediaImages = files.filter((f) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f)).map((f) => `${baseUrl}/uploads/${f}`);
    }
  } catch (e) {
  }
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  for (const page of pages) {
    const slug = page.slug || page.id;
    const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString().split("T")[0] : page.date || today;
    xml += `
  <url>
    <loc>${baseUrl}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${page.image ? `
    <image:image>
      <image:loc>${page.image.startsWith("http") ? page.image : baseUrl + page.image}</image:loc>
      <image:title>${(page.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</image:title>
    </image:image>` : ""}
  </url>`;
  }
  for (const post of posts) {
    const slug = post.slug || post.id;
    const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString().split("T")[0] : post.date || today;
    xml += `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>${post.image ? `
    <image:image>
      <image:loc>${post.image.startsWith("http") ? post.image : baseUrl + post.image}</image:loc>
      <image:title>${(post.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</image:title>
    </image:image>` : ""}
  </url>`;
  }
  for (const imgUrl of mediaImages) {
    xml += `
  <url>
    <loc>${imgUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
    <image:image>
      <image:loc>${imgUrl}</image:loc>
    </image:image>
  </url>`;
  }
  xml += `
</urlset>`;
  res.set("Content-Type", "application/xml");
  return res.send(xml);
});
async function startServer() {
  await connectToDatabase();
  const distPath = import_path.default.join(process.cwd(), "dist");
  const distIndexPath = import_path.default.join(distPath, "index.html");
  const isProduction = process.env.NODE_ENV === "production" || import_fs.default.existsSync(distIndexPath);
  if (!isProduction) {
    console.log("[MODE] Development mode: starting Vite dev server middleware.");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("[MODE] Production mode: serving static files from", distPath);
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} [mode: ${isProduction ? "production" : "development"}]`);
  });
}
if (!process.env.VERCEL) {
  startServer();
}
var server_default = app;
//# sourceMappingURL=server.cjs.map
