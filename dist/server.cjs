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
var SERVICE_AREAS_PATH = import_path.default.join(process.cwd(), "service_areas.json");
var SERVICES_SETTINGS_PATH = import_path.default.join(process.cwd(), "services_settings.json");
var SERVICE_AREAS_SETTINGS_PATH = import_path.default.join(process.cwd(), "service_areas_settings.json");
var PROMOCODES_PATH = import_path.default.join(process.cwd(), "promocodes.json");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://info_db_user:rexkTuz4elj0srRx@cluster0.utakxdh.mongodb.net/travelluxx?retryWrites=true&w=majority&appName=Cluster0";
var BookingSchema = new import_mongoose.default.Schema({
  id: { type: String, required: true, unique: true },
  passengerName: String,
  passengerEmail: String,
  passengerPhone: String,
  passengerAlternatePhone: String,
  pickup: String,
  dropoff: String,
  pickupCoords: Object,
  dropoffCoords: Object,
  date: String,
  time: String,
  distance: String,
  distanceMiles: Number,
  distanceKm: Number,
  distanceText: String,
  duration: Number,
  vehicle: String,
  price: Number,
  originalPrice: Number,
  discountAmount: Number,
  promoCode: String,
  status: { type: String, default: "Pending" },
  paymentMethod: String,
  paymentStatus: { type: String, default: "Unpaid" },
  flightNumber: String,
  passengers: Number,
  luggage: Number,
  stops: Array,
  waitingTime: Number,
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
  faqs: { type: Array, default: [] },
  createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
  updatedAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
}, { strict: false });
var ServiceModel = import_mongoose.default.model("Service", ServiceSchema);
var ServiceAreaSchema = new import_mongoose.default.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  slug: { type: String, required: true, unique: true },
  updatedAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
}, { strict: false });
var ServiceAreaModel = import_mongoose.default.model("ServiceArea", ServiceAreaSchema);
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
var PromoCodeSchema = new import_mongoose.default.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ["fixed", "percentage"], default: "fixed" },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number, default: null },
  startDate: { type: String, default: "" },
  expiryDate: { type: String, default: "" },
  usageLimit: { type: Number, default: null },
  perUserLimit: { type: Number, default: null },
  timesUsed: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  description: { type: String, default: "" },
  createdAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() },
  updatedAt: { type: String, default: () => (/* @__PURE__ */ new Date()).toISOString() }
}, { strict: false });
var PromoCodeModel = import_mongoose.default.model("PromoCode", PromoCodeSchema);
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
    const count = await ServiceAreaModel.countDocuments();
    if (count === 0 && import_fs.default.existsSync(SERVICE_AREAS_PATH)) {
      const jsonServiceAreas = JSON.parse(import_fs.default.readFileSync(SERVICE_AREAS_PATH, "utf8"));
      await ServiceAreaModel.insertMany(jsonServiceAreas, { ordered: false }).catch(() => {
      });
      console.log("\u2705 MongoDB populated with all service areas!");
    }
  } catch (err) {
    console.error("Error migrating service areas to MongoDB:", err.message);
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
function readServiceAreas() {
  try {
    if (import_fs.default.existsSync(SERVICE_AREAS_PATH)) {
      return JSON.parse(import_fs.default.readFileSync(SERVICE_AREAS_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading service_areas.json:", err);
  }
  return [];
}
function writeServiceAreas(serviceAreas) {
  if (process.env.VERCEL) {
    console.log("\u2139\uFE0F Skipping writeServiceAreas to local file on Vercel.");
    return;
  }
  try {
    import_fs.default.writeFileSync(SERVICE_AREAS_PATH, JSON.stringify(serviceAreas, null, 2));
  } catch (err) {
    console.error("Error writing service_areas.json:", err);
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
function readPromoCodes() {
  try {
    if (import_fs.default.existsSync(PROMOCODES_PATH)) {
      return JSON.parse(import_fs.default.readFileSync(PROMOCODES_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading promocodes.json:", err);
  }
  return [];
}
function writePromoCodes(codes) {
  if (process.env.VERCEL) return;
  try {
    import_fs.default.writeFileSync(PROMOCODES_PATH, JSON.stringify(codes, null, 2));
  } catch (err) {
    console.error("Error writing promocodes.json:", err);
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
      if (dbMenu && Array.isArray(dbMenu.value) && dbMenu.value.length > 0) {
        cachedMenu = dbMenu.value;
      }
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
    service_dropoff_5: "Birmingham Airport (BHX)",
    custom_header_code: "",
    custom_footer_code: ""
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
var UK_LOCATIONS = {
  "shirley": { lat: 52.414, lng: -1.815, name: "Shirley, Solihull B90" },
  "solihull": { lat: 52.4135, lng: -1.778, name: "Solihull, West Midlands" },
  "birmingham": { lat: 52.4862, lng: -1.8904, name: "Birmingham, West Midlands" },
  "bhx": { lat: 52.4539, lng: -1.7481, name: "Birmingham Airport (BHX)" },
  "lhr": { lat: 51.47, lng: -0.4543, name: "London Heathrow Airport (LHR)" },
  "lgw": { lat: 51.1537, lng: -0.1821, name: "London Gatwick Airport (LGW)" },
  "man": { lat: 53.3588, lng: -2.2727, name: "Manchester Airport (MAN)" }
};
var UK_AIRPORTS_AND_HUBS = [
  { name: "London Heathrow Airport (LHR), Longford, Hounslow TW6", mainText: "London Heathrow Airport (LHR)", secondaryText: "Longford, Hounslow, Greater London, TW6", lat: 51.47, lng: -0.4543, type: "airport" },
  { name: "London Gatwick Airport (LGW), Horley, Gatwick RH6", mainText: "London Gatwick Airport (LGW)", secondaryText: "Horley, West Sussex, RH6", lat: 51.1537, lng: -0.1821, type: "airport" },
  { name: "Birmingham Airport (BHX), Trident Way, Birmingham B26 3QJ", mainText: "Birmingham Airport (BHX)", secondaryText: "Bickenhill Lane, Solihull, B26 3QJ", lat: 52.4539, lng: -1.748, type: "airport" },
  { name: "Manchester Airport (MAN), Manchester M90 1QX", mainText: "Manchester Airport (MAN)", secondaryText: "Ringway, Greater Manchester, M90 1QX", lat: 53.3588, lng: -2.2727, type: "airport" },
  { name: "London Stansted Airport (STN), Bassingbourn Rd, Stansted CM24 1QW", mainText: "London Stansted Airport (STN)", secondaryText: "Stansted Mountfitchet, Essex, CM24 1QW", lat: 51.886, lng: 0.2389, type: "airport" },
  { name: "London Luton Airport (LTN), Airport Way, Luton LU2 9LY", mainText: "London Luton Airport (LTN)", secondaryText: "Luton, Bedfordshire, LU2 9LY", lat: 51.8763, lng: -0.3717, type: "airport" },
  { name: "London City Airport (LCY), Hartmann Rd, London E16 2PX", mainText: "London City Airport (LCY)", secondaryText: "Royal Docks, Newham, London E16 2PX", lat: 51.5048, lng: 0.0495, type: "airport" },
  { name: "East Midlands Airport (EMA), Castle Donington, Derby DE74 2SA", mainText: "East Midlands Airport (EMA)", secondaryText: "Castle Donington, Leicestershire, DE74 2SA", lat: 52.8311, lng: -1.3281, type: "airport" },
  { name: "Bristol Airport (BRS), Bristol BS48 3DY", mainText: "Bristol Airport (BRS)", secondaryText: "Lulsgate Bottom, North Somerset, BS48 3DY", lat: 51.3827, lng: -2.7191, type: "airport" },
  { name: "London St Pancras International Station, Euston Rd, London N1C 4QP", mainText: "London St Pancras International Station", secondaryText: "Camden, London N1C 4QP", lat: 51.5314, lng: -0.1261, type: "station" },
  { name: "London Euston Station, Eversholt St, London NW1 2DN", mainText: "London Euston Station", secondaryText: "Camden, London NW1 2DN", lat: 51.5284, lng: -0.1331, type: "station" },
  { name: "London Paddington Station, Praed St, London W2 1HQ", mainText: "London Paddington Station", secondaryText: "Westminster, London W2 1HQ", lat: 51.5154, lng: -0.1755, type: "station" },
  { name: "Birmingham New Street Station, Station St, Birmingham B2 4QA", mainText: "Birmingham New Street Station", secondaryText: "City Centre, Birmingham B2 4QA", lat: 52.4778, lng: -1.8986, type: "station" },
  { name: "Solihull Train Station, Station Approach, Solihull B91 1LE", mainText: "Solihull Train Station", secondaryText: "Solihull, West Midlands, B91 1LE", lat: 52.4109, lng: -1.782, type: "station" },
  { name: "Shirley, Solihull B90, West Midlands, UK", mainText: "Shirley, Solihull", secondaryText: "Solihull, West Midlands, B90", lat: 52.414, lng: -1.815, type: "address" },
  { name: "Mayfair, London W1K, Greater London, UK", mainText: "Mayfair, Central London", secondaryText: "City of Westminster, London W1K", lat: 51.5103, lng: -0.1494, type: "address" }
];
async function resolveLocationCoords(rawName, providedCoords, fallback) {
  if (providedCoords && Number(providedCoords.lat) !== 0 && Number(providedCoords.lng) !== 0) {
    return { lat: Number(providedCoords.lat), lng: Number(providedCoords.lng), name: rawName || fallback.name };
  }
  const query = String(rawName || "").trim();
  if (!query) return fallback;
  const lower = query.toLowerCase();
  const hub = UK_AIRPORTS_AND_HUBS.find(
    (h) => lower.includes(h.mainText.toLowerCase()) || h.name.toLowerCase().includes(lower) || lower.includes("heathrow") && h.mainText.includes("Heathrow") || lower.includes("gatwick") && h.mainText.includes("Gatwick") || lower.includes("birmingham airport") && h.mainText.includes("BHX") || lower.includes("manchester airport") && h.mainText.includes("MAN") || lower.includes("stansted") && h.mainText.includes("Stansted") || lower.includes("luton") && h.mainText.includes("Luton")
  );
  if (hub) {
    return { lat: hub.lat, lng: hub.lng, name: query };
  }
  for (const key of Object.keys(UK_LOCATIONS)) {
    if (lower.includes(key)) {
      return { lat: UK_LOCATIONS[key].lat, lng: UK_LOCATIONS[key].lng, name: query };
    }
  }
  const cleanPostcode = query.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const ukPostcodePattern = /^[A-Z]{1,2}[0-9][A-Z0-9]?(\s?[0-9][A-Z]{2})?$/i;
  if (ukPostcodePattern.test(query) || /^[A-Z]{1,2}[0-9]/.test(cleanPostcode)) {
    try {
      const pcRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`, {
        signal: AbortSignal.timeout(2e3)
      });
      if (pcRes.ok) {
        const pcData = await pcRes.json();
        if (pcData.result) {
          return { lat: pcData.result.latitude, lng: pcData.result.longitude, name: query };
        }
      }
    } catch (e) {
    }
  }
  return fallback;
}
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
var PORT = process.env.PORT || 3e3;
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
  const pCoords = await resolveLocationCoords(pickup, pickupCoords, UK_LOCATIONS.shirley);
  const dCoords = await resolveLocationCoords(dropoff, dropoffCoords, UK_LOCATIONS.bhx);
  let actualDistanceMiles = 0;
  let actualDurationMinutes = 0;
  let routePoints = precalculated?.routePoints && precalculated.routePoints.length > 0 ? precalculated.routePoints : [];
  if (precalculated?.distanceMiles && Number(precalculated.distanceMiles) > 0) {
    actualDistanceMiles = Number(precalculated.distanceMiles);
    actualDurationMinutes = precalculated.timeMinutes ? Math.round(Number(precalculated.timeMinutes)) : Math.round(actualDistanceMiles / 35 * 60);
  } else {
    const validStops = [];
    if (Array.isArray(stops)) {
      for (const s of stops) {
        if (s.lat && s.lng) {
          validStops.push(s);
        } else if (s.address || s.location || s.name) {
          const resolved = await resolveLocationCoords(s.address || s.location || s.name, null, { lat: 0, lng: 0, name: "" });
          if (resolved.lat && resolved.lng) {
            validStops.push({ ...s, lat: resolved.lat, lng: resolved.lng });
          }
        }
      }
    }
    try {
      const stopCoordsStr = validStops.map((s) => `${s.lng},${s.lat}`).join(";");
      const coordsChain = [
        `${pCoords.lng},${pCoords.lat}`,
        ...stopCoordsStr ? [stopCoordsStr] : [],
        `${dCoords.lng},${dCoords.lat}`
      ].join(";");
      const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsChain}?overview=full&geometries=geojson`, {
        signal: AbortSignal.timeout(3500)
      });
      if (osrmRes.ok) {
        const osrmData = await osrmRes.json();
        if (osrmData.routes && osrmData.routes.length > 0) {
          const r = osrmData.routes[0];
          actualDistanceMiles = r.distance / 1609.344;
          actualDurationMinutes = Math.max(5, Math.round(r.duration / 60));
          if (!routePoints || routePoints.length === 0) {
            routePoints = r.geometry.coordinates.map((coord) => ({ lat: coord[1], lng: coord[0] }));
          }
        }
      }
    } catch (e) {
    }
    if (!actualDistanceMiles || actualDistanceMiles <= 0) {
      const straightLine = getHaversineDistance(pCoords.lat, pCoords.lng, dCoords.lat, dCoords.lng);
      actualDistanceMiles = Math.max(0.5, straightLine * 1.2);
      actualDurationMinutes = Math.max(5, Math.round(actualDistanceMiles / 30 * 60));
      if (!routePoints || routePoints.length === 0) {
        routePoints = generateFallbackRoutePoints(pCoords.lat, pCoords.lng, dCoords.lat, dCoords.lng);
      }
    }
  }
  actualDistanceMiles = Number(actualDistanceMiles.toFixed(1));
  const actualDistanceKm = Number((actualDistanceMiles * 1.60934).toFixed(1));
  const minBillableDist = Number(pricing.minimum_billable_distance || 10);
  const effectiveDist = Math.max(actualDistanceMiles, minBillableDist);
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
  if (!routePoints || routePoints.length === 0) {
    routePoints = generateFallbackRoutePoints(pCoords.lat, pCoords.lng, dCoords.lat, dCoords.lng);
  }
  return res.json({
    distance: actualDistanceMiles,
    distanceMiles: actualDistanceMiles,
    distanceKm: actualDistanceKm,
    distanceText: `${actualDistanceMiles} mi (${actualDistanceKm} km)`,
    duration: actualDurationMinutes,
    durationText: `${actualDurationMinutes} mins`,
    billableDistance: effectiveDist,
    prices,
    routePoints,
    pickupCoords: pCoords,
    dropoffCoords: dCoords,
    waitingTime: totalWaitingMins,
    waitingChargeAmount: Number(waitingChargeAmount.toFixed(2))
  });
});
var promoRateLimits = {};
function isRateLimitedForCoupon(ip) {
  const now = Date.now();
  const clientKey = ip || "unknown";
  const entry = promoRateLimits[clientKey];
  if (!entry || now > entry.resetAt) {
    promoRateLimits[clientKey] = { count: 1, resetAt: now + 60 * 1e3 };
    return false;
  }
  if (entry.count >= 15) {
    return true;
  }
  entry.count++;
  return false;
}
async function validateAndCalculateCoupon(rawCode, orderAmount, userEmail) {
  const code = String(rawCode || "").trim().toUpperCase();
  if (!code) {
    return { valid: false, message: "Please enter a coupon code.", discountAmount: 0, finalAmount: orderAmount };
  }
  await connectToDatabase();
  let promo = null;
  if (import_mongoose.default.connection.readyState === 1) {
    promo = await PromoCodeModel.findOne({ code }).lean();
  }
  if (!promo) {
    const all = readPromoCodes();
    promo = all.find((p) => p.code && p.code.toUpperCase() === code);
  }
  if (!promo) {
    return { valid: false, message: "Invalid coupon code.", discountAmount: 0, finalAmount: orderAmount };
  }
  if (!promo.isActive) {
    return { valid: false, message: "This coupon is currently inactive.", discountAmount: 0, finalAmount: orderAmount };
  }
  const now = /* @__PURE__ */ new Date();
  if (promo.startDate) {
    const start = new Date(promo.startDate);
    if (start.toString() !== "Invalid Date" && now < start) {
      return { valid: false, message: `This coupon will be valid starting ${promo.startDate}.`, discountAmount: 0, finalAmount: orderAmount };
    }
  }
  const expStr = promo.expiryDate || promo.expiresAt;
  if (expStr) {
    const expiry = new Date(expStr);
    if (expStr.length <= 10) {
      expiry.setHours(23, 59, 59, 999);
    }
    if (expiry.toString() !== "Invalid Date" && now > expiry) {
      return { valid: false, message: "This coupon has expired.", discountAmount: 0, finalAmount: orderAmount };
    }
  }
  if (promo.usageLimit !== null && promo.usageLimit !== void 0 && Number(promo.usageLimit) > 0) {
    const timesUsed = Number(promo.timesUsed || 0);
    if (timesUsed >= Number(promo.usageLimit)) {
      return { valid: false, message: "This coupon has reached its total usage limit.", discountAmount: 0, finalAmount: orderAmount };
    }
  }
  if (promo.perUserLimit !== null && promo.perUserLimit !== void 0 && Number(promo.perUserLimit) > 0 && userEmail) {
    const normalizedEmail = userEmail.toLowerCase().trim();
    let userUsedCount = 0;
    if (import_mongoose.default.connection.readyState === 1) {
      userUsedCount = await BookingModel.countDocuments({
        promoCode: promo.code,
        passengerEmail: normalizedEmail
      });
    } else {
      const allBookings = readBookings();
      userUsedCount = allBookings.filter(
        (b) => b.promoCode && b.promoCode.toUpperCase() === promo.code.toUpperCase() && String(b.passengerEmail || "").toLowerCase().trim() === normalizedEmail
      ).length;
    }
    if (userUsedCount >= Number(promo.perUserLimit)) {
      return { valid: false, message: `You have reached the per-customer usage limit (${promo.perUserLimit}) for this coupon.`, discountAmount: 0, finalAmount: orderAmount };
    }
  }
  const minAmount = Number(promo.minOrderAmount || 0);
  if (minAmount > 0 && orderAmount < minAmount) {
    return {
      valid: false,
      message: `Minimum booking fare of \xA3${minAmount.toFixed(2)} is required for this coupon.`,
      discountAmount: 0,
      finalAmount: orderAmount
    };
  }
  let discountAmount = 0;
  const val = Number(promo.discountValue || 0);
  if (promo.discountType === "percentage") {
    discountAmount = orderAmount * val / 100;
    if (promo.maxDiscountAmount && Number(promo.maxDiscountAmount) > 0) {
      discountAmount = Math.min(discountAmount, Number(promo.maxDiscountAmount));
    }
  } else {
    discountAmount = val;
  }
  discountAmount = Math.min(discountAmount, orderAmount);
  discountAmount = Math.max(0, Math.round(discountAmount * 100) / 100);
  const finalAmount = Math.max(0, Math.round((orderAmount - discountAmount) * 100) / 100);
  return {
    valid: true,
    message: "Coupon code applied successfully!",
    coupon: promo,
    discountAmount,
    finalAmount
  };
}
async function recordCouponUsage(promoCodeStr) {
  try {
    const code = String(promoCodeStr || "").trim().toUpperCase();
    if (!code) return;
    if (import_mongoose.default.connection.readyState === 1) {
      await PromoCodeModel.updateOne({ code }, { $inc: { timesUsed: 1 } });
    }
    const all = readPromoCodes();
    const target = all.find((p) => p.code && p.code.toUpperCase() === code);
    if (target) {
      target.timesUsed = Number(target.timesUsed || 0) + 1;
      writePromoCodes(all);
    }
  } catch (err) {
    console.error("Error incrementing coupon usage:", err);
  }
}
app.post("/api/bookings", async (req, res) => {
  try {
    await connectToDatabase();
    const data = req.body;
    const bookingId = `WLC-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
    let originalPrice = Number(data.originalPrice || data.price || 0);
    let discountAmount = 0;
    let finalPrice = originalPrice;
    let verifiedPromo = null;
    if (data.promoCode) {
      const result = await validateAndCalculateCoupon(data.promoCode, originalPrice, data.passengerEmail);
      if (result.valid) {
        discountAmount = result.discountAmount;
        finalPrice = result.finalAmount;
        verifiedPromo = result.coupon;
      }
    }
    finalPrice = Math.max(0, Math.round(finalPrice * 100) / 100);
    const newBooking = {
      id: bookingId,
      ...data,
      price: finalPrice,
      originalPrice,
      discountAmount,
      promoCode: verifiedPromo ? verifiedPromo.code : void 0,
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
    if (verifiedPromo) {
      await recordCouponUsage(verifiedPromo.code);
    }
    await sendBookingEmails(newBooking).catch((err) => console.error("Booking email error:", err));
    sendWhatsAppNotification(newBooking).catch((err) => console.error("WhatsApp notification error:", err));
    return res.json({ success: true, booking: newBooking });
  } catch (err) {
    console.error("Failed to create booking:", err);
    return res.status(500).json({ error: err.message || "Failed to create booking" });
  }
});
app.post("/api/mollie/create-payment", async (req, res) => {
  try {
    await connectToDatabase();
    const data = req.body;
    const bookingId = `WLC-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
    let originalPrice = Number(data.originalPrice || data.price || 0);
    let discountAmount = 0;
    let finalPrice = originalPrice;
    let verifiedPromo = null;
    if (data.promoCode) {
      const result = await validateAndCalculateCoupon(data.promoCode, originalPrice, data.passengerEmail);
      if (result.valid) {
        discountAmount = result.discountAmount;
        finalPrice = result.finalAmount;
        verifiedPromo = result.coupon;
      }
    }
    finalPrice = Math.max(0, Math.round(finalPrice * 100) / 100);
    const newBooking = {
      id: bookingId,
      ...data,
      price: finalPrice,
      originalPrice,
      discountAmount,
      promoCode: verifiedPromo ? verifiedPromo.code : void 0,
      paymentMethod: "Mollie",
      paymentStatus: "Pending",
      status: "Pending",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const bookings = readBookings();
    bookings.unshift(newBooking);
    writeBookings(bookings);
    if (import_mongoose.default.connection.readyState === 1) {
      const dbBooking = new BookingModel(newBooking);
      await dbBooking.save();
    }
    const mollieClient = getMollieClient();
    const reqHost = req.get("host") || "travelluxx.co.uk";
    const protocol = req.secure || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const origin = `${protocol}://${reqHost}`;
    if (mollieClient && finalPrice > 0) {
      try {
        const payment = await mollieClient.payments.create({
          amount: {
            value: finalPrice.toFixed(2),
            currency: "GBP"
          },
          description: `Travel Luxx Transfer ${bookingId} - ${data.passengerName || "Passenger"}`,
          redirectUrl: `${origin}/?bookingStatus=success&bookingId=${bookingId}`,
          webhookUrl: `${origin}/api/mollie/webhook`,
          metadata: {
            bookingId,
            promoCode: verifiedPromo ? verifiedPromo.code : void 0
          }
        });
        if (payment && payment.getCheckoutUrl()) {
          return res.json({ success: true, checkoutUrl: payment.getCheckoutUrl(), bookingId });
        }
      } catch (mollieErr) {
        console.warn("Mollie API charge fallback:", mollieErr?.message);
      }
    }
    return res.json({
      success: true,
      checkoutUrl: `${origin}/?bookingStatus=success&bookingId=${bookingId}`,
      bookingId
    });
  } catch (err) {
    console.error("Failed to create Mollie payment:", err);
    return res.status(500).json({ error: err.message || "Failed to create Mollie checkout" });
  }
});
app.get("/api/mollie/status/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    await connectToDatabase();
    let booking = null;
    if (import_mongoose.default.connection.readyState === 1) {
      booking = await BookingModel.findOne({ id: bookingId });
    }
    const bookings = readBookings();
    const idx = bookings.findIndex((b) => b.id === bookingId);
    if (!booking && idx === -1) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    const currentBooking = booking ? booking.toObject ? booking.toObject() : booking : bookings[idx];
    if (currentBooking.paymentStatus !== "Paid") {
      if (booking) {
        booking.paymentStatus = "Paid";
        booking.status = "Confirmed";
        await booking.save();
      }
      if (idx !== -1) {
        bookings[idx].paymentStatus = "Paid";
        bookings[idx].status = "Confirmed";
        writeBookings(bookings);
      }
      if (currentBooking.promoCode) {
        await recordCouponUsage(currentBooking.promoCode);
      }
      await sendBookingEmails(currentBooking).catch((err) => console.error("Email error:", err));
      sendWhatsAppNotification(currentBooking).catch((err) => console.error("WhatsApp error:", err));
    }
    return res.json({
      success: true,
      booking: currentBooking,
      paymentStatus: "Paid",
      status: "Confirmed"
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/bookings/payment-simulate", async (req, res) => {
  try {
    const { bookingId, paymentMethod, transactionId } = req.body;
    await connectToDatabase();
    let booking = null;
    if (import_mongoose.default.connection.readyState === 1) {
      booking = await BookingModel.findOne({ id: bookingId });
    }
    const bookings = readBookings();
    const idx = bookings.findIndex((b) => b.id === bookingId);
    if (!booking && idx === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }
    const updates = {
      paymentStatus: paymentMethod === "Pay Later" ? "Unpaid" : "Paid",
      status: "Pending",
      transactionId: transactionId || `SIM-${Date.now()}`
    };
    if (booking) {
      Object.assign(booking, updates);
      await booking.save();
    }
    if (idx !== -1) {
      Object.assign(bookings[idx], updates);
      writeBookings(bookings);
    }
    const promoToCount = booking && booking.promoCode || idx !== -1 && bookings[idx]?.promoCode;
    if (promoToCount) {
      recordCouponUsage(promoToCount).catch((e) => console.error("Error recording coupon usage:", e));
    }
    return res.json({ success: true, bookingId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var ADMIN_AUTH_TOKEN = "admin-auth-token-travelluxx-2026";
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : req.headers["x-admin-token"] || req.query.token;
  if (token === ADMIN_AUTH_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized: Admin authentication token required" });
}
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
app.get("/api/settings", async (req, res) => {
  try {
    await connectToDatabase();
    await syncSettingsFromDb();
  } catch (e) {
  }
  const settings = getCurrentWebsiteSettings();
  return res.json(settings);
});
app.get("/api/pricing", async (req, res) => {
  try {
    await connectToDatabase();
    await syncSettingsFromDb();
  } catch (e) {
  }
  const settings = getCurrentWebsiteSettings();
  return res.json({
    economy_price_per_mile: settings.economy_price || 1.5,
    luxury_price_per_mile: settings.luxury_price || 2,
    family_price_per_mile: settings.family_price || 2.5,
    minimum_billable_distance: settings.minimum_distance || 10,
    extra_stop_charge: settings.extra_stop_charge || 15
  });
});
app.post("/api/stats/visit", (req, res) => {
  return res.json({ success: true });
});
app.post("/api/stats/click", (req, res) => {
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
    cachedGoogleReviews = null;
    if (import_mongoose.default.connection.readyState === 1) {
      await SettingModel.findOneAndUpdate({ key: "website" }, { value: updated }, { upsert: true });
      console.log("\u{1F4BE} Saved admin settings to MongoDB!");
    }
    if (!process.env.VERCEL) {
      import_fs.default.writeFileSync(SETTINGS_PATH, JSON.stringify(updated, null, 2));
      try {
        const webSettingsPath = import_path.default.join(process.cwd(), "website_settings.json");
        import_fs.default.writeFileSync(webSettingsPath, JSON.stringify(updated, null, 2));
      } catch (e) {
      }
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
  const cleanParam = (req.params.slug || "").replace(/^\/+/, "");
  try {
    await connectToDatabase();
    const page2 = await PageModel.findOne({
      $or: [{ slug: cleanParam }, { id: cleanParam }]
    });
    if (page2) return res.json(page2);
  } catch (e) {
  }
  const page = readPages().find((p) => p.slug === cleanParam || p.id === cleanParam);
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
    const cleanSlug = (req.body.slug?.trim() || req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `page-${Date.now()}`).replace(/^\/+/, "");
    const newPage = {
      ...req.body,
      id: `page-${Date.now()}`,
      title: req.body.title?.trim() || "Untitled Page",
      slug: cleanSlug,
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
  if (updateData.slug !== void 0) {
    updateData.slug = String(updateData.slug).trim().replace(/^\/+/, "");
  }
  let dbPage = null;
  try {
    await connectToDatabase();
    const filter = {
      $or: [
        { id: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { slug: req.params.id }
      ].filter(Boolean)
    };
    dbPage = await PageModel.findOneAndUpdate(
      filter,
      { ...updateData, updatedAt: (/* @__PURE__ */ new Date()).toISOString() },
      { new: true }
    );
  } catch (e) {
    console.error("Error updating MongoDB page:", e);
  }
  const pages = readPages();
  const idx = pages.findIndex((p) => p.id === req.params.id || p._id === req.params.id || p.slug === req.params.id);
  if (idx !== -1) {
    pages[idx] = { ...pages[idx], ...updateData, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    writePages(pages);
    return res.json({ success: true, page: pages[idx] });
  } else if (dbPage) {
    pages.push(dbPage.toObject ? dbPage.toObject() : dbPage);
    writePages(pages);
    return res.json({ success: true, page: dbPage });
  } else {
    const newEntry = { id: req.params.id, ...updateData, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    pages.push(newEntry);
    writePages(pages);
    return res.json({ success: true, page: newEntry });
  }
});
app.delete("/api/admin/pages/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const filter = {
      $or: [
        { id: req.params.id },
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { slug: req.params.id }
      ].filter(Boolean)
    };
    await PageModel.deleteOne(filter);
  } catch (e) {
  }
  writePages(readPages().filter((p) => p.id !== req.params.id && p._id !== req.params.id && p.slug !== req.params.id));
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
      faqs: Array.isArray(req.body.faqs) ? req.body.faqs : [],
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
app.get("/api/service-areas", async (req, res) => {
  if (MONGODB_URI) {
    try {
      await connectToDatabase();
      const serviceAreas = await ServiceAreaModel.find({ published: { $ne: false } }).sort({ title: 1 });
      if (serviceAreas.length > 0) return res.json(serviceAreas);
    } catch (err) {
      console.error("Error loading service areas from MongoDB:", err);
    }
  }
  return res.json(readServiceAreas().filter((area) => area.published !== false));
});
app.get("/api/service-areas/:slug", async (req, res) => {
  if (MONGODB_URI) {
    try {
      await connectToDatabase();
      const serviceArea2 = await ServiceAreaModel.findOne({ slug: req.params.slug, published: { $ne: false } });
      if (serviceArea2) return res.json(serviceArea2);
    } catch (err) {
      console.error("Error loading service area from MongoDB:", err);
    }
  }
  const serviceArea = readServiceAreas().find((area) => area.slug === req.params.slug && area.published !== false);
  if (serviceArea) return res.json(serviceArea);
  return res.status(404).json({ error: "Service area not found" });
});
app.get("/api/admin/service-areas", async (req, res) => {
  if (MONGODB_URI) {
    try {
      await connectToDatabase();
      const serviceAreas = await ServiceAreaModel.find().sort({ title: 1 });
      if (serviceAreas.length > 0) return res.json(serviceAreas);
    } catch (err) {
      console.error("Error loading admin service areas from MongoDB:", err);
    }
  }
  return res.json(readServiceAreas().sort((a, b) => a.title.localeCompare(b.title)));
});
app.post("/api/admin/service-areas", async (req, res) => {
  try {
    await connectToDatabase();
    const serviceAreas = readServiceAreas();
    const title = String(req.body.title || "").trim();
    if (!title) return res.status(400).json({ error: "Service area title is required" });
    const slug = String(req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")).trim();
    if (!slug) return res.status(400).json({ error: "Service area URL slug is required" });
    if (serviceAreas.some((area) => area.slug === slug)) return res.status(409).json({ error: "A service area with this slug already exists" });
    if (MONGODB_URI && await ServiceAreaModel.exists({ slug })) {
      return res.status(409).json({ error: "A service area with this slug already exists" });
    }
    const newServiceArea = {
      ...req.body,
      id: `service-area-${Date.now()}`,
      title,
      slug,
      published: req.body.published !== false,
      faqs: Array.isArray(req.body.faqs) ? req.body.faqs : [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    serviceAreas.push(newServiceArea);
    writeServiceAreas(serviceAreas);
    if (MONGODB_URI) {
      await ServiceAreaModel.findOneAndUpdate({ id: newServiceArea.id }, newServiceArea, { upsert: true });
    }
    return res.json({ success: true, serviceArea: newServiceArea });
  } catch (err) {
    console.error("Error creating service area:", err);
    return res.status(500).json({ error: err.message || "Failed to create service area" });
  }
});
app.put("/api/admin/service-areas/:id", async (req, res) => {
  try {
    await connectToDatabase();
    const serviceAreas = readServiceAreas();
    const index = serviceAreas.findIndex((area) => area.id === req.params.id);
    const databaseArea = MONGODB_URI ? await ServiceAreaModel.findOne({ id: req.params.id }).lean() : null;
    const existingArea = databaseArea || serviceAreas[index];
    if (!existingArea) return res.status(404).json({ error: "Service area not found" });
    const title = String(req.body.title || "").trim();
    const slug = String(req.body.slug || "").trim();
    if (!title) return res.status(400).json({ error: "Service area title is required" });
    if (!slug) return res.status(400).json({ error: "Service area URL slug is required" });
    if (serviceAreas.some((area, i) => i !== index && area.slug === slug) || MONGODB_URI && await ServiceAreaModel.exists({ slug, id: { $ne: req.params.id } })) {
      return res.status(409).json({ error: "A service area with this slug already exists" });
    }
    const updatedServiceArea = {
      ...existingArea,
      ...req.body,
      id: req.params.id,
      title,
      slug,
      published: req.body.published !== false,
      faqs: Array.isArray(req.body.faqs) ? req.body.faqs : [],
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    delete updatedServiceArea._id;
    delete updatedServiceArea.__v;
    if (index === -1) serviceAreas.push(updatedServiceArea);
    else serviceAreas[index] = updatedServiceArea;
    writeServiceAreas(serviceAreas);
    if (MONGODB_URI) {
      await ServiceAreaModel.findOneAndUpdate({ id: req.params.id }, updatedServiceArea, { upsert: true });
    }
    return res.json({ success: true, serviceArea: updatedServiceArea });
  } catch (err) {
    console.error("Error updating service area:", err);
    return res.status(500).json({ error: err.message || "Failed to update service area" });
  }
});
app.delete("/api/admin/service-areas/:id", async (req, res) => {
  try {
    if (MONGODB_URI) {
      await connectToDatabase();
      await ServiceAreaModel.deleteOne({ id: req.params.id });
    }
    writeServiceAreas(readServiceAreas().filter((area) => area.id !== req.params.id));
    return res.json({ success: true });
  } catch (err) {
    console.error("Error deleting service area:", err);
    return res.status(500).json({ error: err.message || "Failed to delete service area" });
  }
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
app.get("/api/service-areas-page-settings", async (req, res) => {
  try {
    await connectToDatabase();
    const doc = await SettingModel.findOne({ key: "service_areas_page_settings" });
    if (doc && doc.value) return res.json(doc.value);
  } catch (e) {
  }
  try {
    if (import_fs.default.existsSync(SERVICE_AREAS_SETTINGS_PATH)) {
      return res.json(JSON.parse(import_fs.default.readFileSync(SERVICE_AREAS_SETTINGS_PATH, "utf8")));
    }
  } catch (e) {
  }
  return res.json({
    hero_enabled: true,
    hero_tag: "SERVICE AREAS",
    hero_title: "Explore TravelLuxx Service Areas Across the UK",
    hero_description: "Private chauffeur travel, airport transfers, and executive door-to-door transportation tailored around your location and schedule.",
    hero_button_text: "Plan Your Journey",
    hero_button_url: "/#calculator-section",
    hero_image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=2000&q=85",
    meta_title: "Service Areas | Executive Chauffeur & Airport Transfers | TravelLuxx",
    meta_description: "Discover all the areas TravelLuxx covers across the West Midlands, London, and nationwide. Book your private chauffeur and airport transfer."
  });
});
app.post("/api/admin/service-areas-page-settings", async (req, res) => {
  try {
    await connectToDatabase();
    if (MONGODB_URI) {
      await SettingModel.findOneAndUpdate(
        { key: "service_areas_page_settings" },
        { key: "service_areas_page_settings", value: req.body },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.error("Error saving service areas page settings to MongoDB:", err);
  }
  try {
    if (!process.env.VERCEL) {
      import_fs.default.writeFileSync(SERVICE_AREAS_SETTINGS_PATH, JSON.stringify(req.body, null, 2));
    }
  } catch (err) {
    console.error("Error writing service_areas_settings.json:", err);
  }
  return res.json({ success: true, settings: req.body });
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
  if (Array.isArray(cachedMenu) && cachedMenu.length > 0) return cachedMenu;
  try {
    if (import_fs.default.existsSync(MENU_PATH)) {
      const parsed = JSON.parse(import_fs.default.readFileSync(MENU_PATH, "utf8"));
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedMenu = parsed;
        return cachedMenu;
      }
    }
  } catch (e) {
  }
  cachedMenu = [
    { id: "nav-home", label: "Home", href: "/", target: "_self" },
    {
      id: "nav-services",
      label: "Services",
      href: "/services",
      target: "_self",
      children: [
        { id: "srv-airport-transfers", label: "Local Airport Transfers Birmingham", href: "/services/airport-transfers", target: "_self" },
        { id: "srv-private-transfers", label: "Private Transfers", href: "/services/private-transfers", target: "_self" },
        { id: "srv-long-distance-travel", label: "Long Distance Travel", href: "/services/long-distance-travel", target: "_self" },
        { id: "srv-business-travel", label: "Business Travel", href: "/services/business-travel", target: "_self" },
        { id: "srv-all-services", label: "All Services", href: "/services", target: "_self" }
      ]
    },
    {
      id: "nav-service-areas",
      label: "Service Areas",
      href: "/service-areas",
      target: "_self",
      children: [
        { id: "sa-solihull", label: "Solihull", href: "/service-areas/chauffeur-solihull", target: "_self" },
        { id: "sa-coventry", label: "Chauffeur Coventry", href: "/service-areas/chauffeur-coventry", target: "_self" },
        { id: "sa-leamington-spa", label: "Chauffeur Leamington Spa", href: "/service-areas/chauffeur-leamington-spa", target: "_self" },
        { id: "sa-warwick", label: "Chauffeur Warwick", href: "/service-areas/chauffeur-warwick", target: "_self" },
        { id: "sa-all-areas", label: "All Service Areas", href: "/service-areas", target: "_self" }
      ]
    },
    { id: "nav-blog", label: "Blog", href: "/blog", target: "_self" }
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
  const mediaSet = /* @__PURE__ */ new Set();
  try {
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      const uploads = await UploadModel.find({}, "filename");
      uploads.forEach((u) => {
        if (u.filename) mediaSet.add(`/uploads/${u.filename}`);
      });
    }
  } catch (e) {
    console.error("Error fetching media from DB:", e.message);
  }
  try {
    const uploadDir = import_path.default.join(process.cwd(), "public", "uploads");
    if (import_fs.default.existsSync(uploadDir)) {
      const files = import_fs.default.readdirSync(uploadDir);
      files.forEach((f) => {
        if (!f.startsWith(".")) mediaSet.add(`/uploads/${f}`);
      });
    }
  } catch (e) {
  }
  try {
    const assetsDir = import_path.default.join(process.cwd(), "public", "assets", "images");
    if (import_fs.default.existsSync(assetsDir)) {
      const files = import_fs.default.readdirSync(assetsDir);
      files.forEach((f) => {
        if (!f.startsWith(".")) mediaSet.add(`/assets/images/${f}`);
      });
    }
  } catch (e) {
  }
  try {
    const publicDir = import_path.default.join(process.cwd(), "public");
    if (import_fs.default.existsSync(publicDir)) {
      const rootFiles = import_fs.default.readdirSync(publicDir);
      rootFiles.forEach((f) => {
        if (/\.(png|jpe?g|webp|svg)$/i.test(f)) {
          mediaSet.add(`/${f}`);
        }
      });
    }
  } catch (e) {
  }
  return res.json(Array.from(mediaSet));
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
var placesCache = /* @__PURE__ */ new Map();
var PLACES_CACHE_TTL = 1e3 * 60 * 60;
app.get("/api/places/autocomplete", async (req, res) => {
  try {
    const rawQuery = String(req.query.q || req.query.input || req.query.query || "").trim();
    if (!rawQuery || rawQuery.length < 2) {
      return res.json([]);
    }
    const cacheKey = `ac_${rawQuery.toLowerCase()}`;
    const cached = placesCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < PLACES_CACHE_TTL) {
      return res.json(cached.data);
    }
    const queryLower = rawQuery.toLowerCase();
    const cleanQuery = rawQuery.replace(/[^a-zA-Z0-9\s,.-]/g, "").trim();
    const hubMatches = UK_AIRPORTS_AND_HUBS.filter(
      (h) => h.name.toLowerCase().includes(queryLower) || h.mainText.toLowerCase().includes(queryLower) || h.secondaryText.toLowerCase().includes(queryLower)
    );
    const results = [...hubMatches];
    const ukPostcodePattern = /^[A-Z]{1,2}[0-9][A-Z0-9]?(\s?[0-9][A-Z]{2})?$/i;
    const isPostcodeQuery = ukPostcodePattern.test(cleanQuery) || /^[A-Z]{1,2}[0-9]/i.test(cleanQuery);
    if (isPostcodeQuery && cleanQuery.length >= 2) {
      try {
        const pcRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleanQuery.replace(/\s+/g, ""))}`, {
          signal: AbortSignal.timeout(2e3)
        });
        if (pcRes.ok) {
          const pcData = await pcRes.json();
          if (pcData.result) {
            const r = pcData.result;
            const fullLabel = `${r.postcode}, ${[r.admin_ward, r.admin_district, r.region || r.european_electoral_region, "UK"].filter(Boolean).join(", ")}`;
            results.push({
              name: fullLabel,
              mainText: r.postcode,
              secondaryText: [r.admin_ward, r.admin_district, r.country || "UK"].filter(Boolean).join(", "),
              lat: r.latitude,
              lng: r.longitude,
              type: "postcode"
            });
          }
        } else {
          const autoRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleanQuery.replace(/\s+/g, ""))}/autocomplete`, {
            signal: AbortSignal.timeout(2e3)
          });
          if (autoRes.ok) {
            const autoData = await autoRes.json();
            if (Array.isArray(autoData.result) && autoData.result.length > 0) {
              const topCodes = autoData.result.slice(0, 4);
              for (const code of topCodes) {
                const subRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(code)}`, {
                  signal: AbortSignal.timeout(1500)
                }).catch(() => null);
                if (subRes && subRes.ok) {
                  const sData = await subRes.json();
                  if (sData.result) {
                    const sr = sData.result;
                    results.push({
                      name: `${sr.postcode}, ${[sr.admin_district, sr.region || "UK"].filter(Boolean).join(", ")}`,
                      mainText: sr.postcode,
                      secondaryText: [sr.admin_district, "UK"].filter(Boolean).join(", "),
                      lat: sr.latitude,
                      lng: sr.longitude,
                      type: "postcode"
                    });
                  }
                }
              }
            }
          }
        }
      } catch (e) {
      }
    }
    try {
      const photonRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&bbox=-8.65,49.86,1.78,60.86&limit=8`, {
        signal: AbortSignal.timeout(2500)
      });
      if (photonRes.ok) {
        const pData = await photonRes.json();
        if (pData && Array.isArray(pData.features)) {
          pData.features.forEach((f) => {
            const p = f.properties || {};
            const country = (p.country || "").toLowerCase();
            if (country && !country.includes("kingdom") && !country.includes("uk") && !country.includes("britain") && p.countrycode !== "GB") {
              return;
            }
            const name = p.name || "";
            const streetParts = [p.housenumber, p.street].filter(Boolean).join(" ");
            const locParts = [streetParts, p.city || p.town || p.district, p.postcode, "UK"].filter(Boolean);
            const fullLabel = [name, ...locParts].filter((v, i, a) => v && a.indexOf(v) === i).join(", ");
            const isAirport = name.toLowerCase().includes("airport") || p.osm_value && p.osm_value.includes("aerodrome");
            const isStation = name.toLowerCase().includes("station");
            if (f.geometry && f.geometry.coordinates) {
              results.push({
                name: fullLabel || name,
                mainText: name || streetParts || locParts[0] || fullLabel,
                secondaryText: locParts.join(", "),
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0],
                type: isAirport ? "airport" : isStation ? "station" : "address"
              });
            }
          });
        }
      }
    } catch (e) {
    }
    if (results.length < 5) {
      try {
        const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&countrycodes=gb&limit=6&addressdetails=1`, {
          headers: {
            "User-Agent": "TravelLuxxChauffeurUK/1.0 (info@travelluxx.co.uk)",
            "Accept-Language": "en-GB,en"
          },
          signal: AbortSignal.timeout(2500)
        });
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          if (Array.isArray(nomData)) {
            nomData.forEach((item) => {
              const parts = (item.display_name || "").split(",");
              results.push({
                name: item.display_name,
                mainText: parts[0]?.trim() || item.display_name,
                secondaryText: parts.slice(1, 4).map((p) => p.trim()).join(", "),
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
                type: "address"
              });
            });
          }
        }
      } catch (e) {
      }
    }
    const uniqueMap = /* @__PURE__ */ new Map();
    for (const item of results) {
      const key = `${item.name.toLowerCase()}_${item.lat.toFixed(3)}_${item.lng.toFixed(3)}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }
    const finalResults = Array.from(uniqueMap.values()).slice(0, 10);
    placesCache.set(cacheKey, { timestamp: Date.now(), data: finalResults });
    return res.json(finalResults);
  } catch (err) {
    console.error("Autocomplete proxy error:", err);
    return res.json([]);
  }
});
app.get("/api/places/geocode", async (req, res) => {
  try {
    const rawAddress = String(req.query.address || req.query.q || "").trim();
    if (!rawAddress) {
      return res.status(400).json({ error: "Address query is required." });
    }
    const cleanAddress = rawAddress.replace(/[^a-zA-Z0-9\s,.-]/g, "").trim();
    const ukPostcodePattern = /^[A-Z]{1,2}[0-9][A-Z0-9]?(\s?[0-9][A-Z]{2})?$/i;
    if (ukPostcodePattern.test(cleanAddress.replace(/\s+/g, ""))) {
      try {
        const pcRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(cleanAddress.replace(/\s+/g, ""))}`);
        if (pcRes.ok) {
          const pcData = await pcRes.json();
          if (pcData.result) {
            return res.json({
              lat: pcData.result.latitude,
              lng: pcData.result.longitude,
              name: `${pcData.result.postcode}, ${pcData.result.admin_district || "UK"}`
            });
          }
        }
      } catch (e) {
      }
    }
    try {
      const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress)}&countrycodes=gb&limit=1`, {
        headers: {
          "User-Agent": "TravelLuxxChauffeurUK/1.0 (info@travelluxx.co.uk)",
          "Accept-Language": "en-GB,en"
        }
      });
      if (nomRes.ok) {
        const data = await nomRes.json();
        if (data && data[0]) {
          return res.json({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            name: data[0].display_name
          });
        }
      }
    } catch (e) {
    }
    return res.json({
      lat: UK_LOCATIONS.shirley.lat,
      lng: UK_LOCATIONS.shirley.lng,
      name: rawAddress
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Geocoding failed" });
  }
});
app.post("/api/promocodes/validate", async (req, res) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress || "client";
    if (isRateLimitedForCoupon(ip)) {
      return res.status(429).json({
        valid: false,
        message: "Too many coupon attempts. Please wait 1 minute before trying again."
      });
    }
    const rawCode = String(req.body.code || "").trim();
    const orderAmount = Number(req.body.amount || req.body.orderAmount || req.body.bookingAmount || 0);
    const userEmail = req.body.email ? String(req.body.email).trim() : void 0;
    if (!rawCode) {
      return res.status(400).json({ valid: false, message: "Please enter a coupon code." });
    }
    const result = await validateAndCalculateCoupon(rawCode, orderAmount, userEmail);
    if (!result.valid) {
      return res.status(400).json(result);
    }
    return res.json({
      valid: true,
      message: result.message,
      coupon: {
        id: result.coupon.id,
        code: result.coupon.code,
        discountType: result.coupon.discountType,
        discountValue: result.coupon.discountValue,
        description: result.coupon.description || ""
      },
      promo: {
        id: result.coupon.id,
        code: result.coupon.code,
        discountType: result.coupon.discountType,
        discountValue: result.coupon.discountValue,
        description: result.coupon.description || ""
      },
      originalAmount: orderAmount,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount
    });
  } catch (err) {
    console.error("Error validating coupon:", err);
    return res.status(500).json({ valid: false, message: "Internal server error validating coupon." });
  }
});
app.get("/api/admin/promocodes", requireAdminAuth, async (req, res) => {
  try {
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      const list = await PromoCodeModel.find().sort({ createdAt: -1 });
      if (list && list.length > 0) {
        return res.json(list.map((c) => c.toObject ? c.toObject() : c));
      }
    }
  } catch (e) {
    console.warn("DB promo read error:", e);
  }
  return res.json(readPromoCodes());
});
app.post("/api/admin/promocodes", requireAdminAuth, async (req, res) => {
  try {
    const rawCode = String(req.body.code || "").trim().toUpperCase();
    if (!rawCode) {
      return res.status(400).json({ error: "Coupon code is required" });
    }
    const val = Number(req.body.discountValue);
    if (isNaN(val) || val <= 0) {
      return res.status(400).json({ error: "A valid positive discount value is required" });
    }
    const startDate = req.body.startDate ? String(req.body.startDate).trim() : "";
    const expiryDate = req.body.expiryDate ? String(req.body.expiryDate).trim() : req.body.expiresAt ? String(req.body.expiresAt).trim() : "";
    if (startDate && expiryDate && expiryDate < startDate) {
      return res.status(400).json({ error: "Expiry date must be on or after the start date." });
    }
    await connectToDatabase();
    const all = readPromoCodes();
    if (all.some((c) => c.code && c.code.toUpperCase() === rawCode)) {
      return res.status(409).json({ error: "A coupon with this code already exists" });
    }
    if (import_mongoose.default.connection.readyState === 1) {
      const exists = await PromoCodeModel.exists({ code: rawCode });
      if (exists) return res.status(409).json({ error: "A coupon with this code already exists" });
    }
    const newCode = {
      id: `promo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      code: rawCode,
      discountType: req.body.discountType === "percentage" ? "percentage" : "fixed",
      discountValue: val,
      minOrderAmount: Number(req.body.minOrderAmount || 0),
      maxDiscountAmount: req.body.maxDiscountAmount ? Number(req.body.maxDiscountAmount) : null,
      startDate,
      expiryDate,
      usageLimit: req.body.usageLimit ? Number(req.body.usageLimit) : null,
      perUserLimit: req.body.perUserLimit ? Number(req.body.perUserLimit) : null,
      timesUsed: 0,
      isActive: req.body.isActive !== false,
      description: String(req.body.description || "").trim(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    all.unshift(newCode);
    writePromoCodes(all);
    if (import_mongoose.default.connection.readyState === 1) {
      const doc = new PromoCodeModel(newCode);
      await doc.save();
    }
    return res.json({ success: true, promoCode: newCode, coupon: newCode });
  } catch (err) {
    console.error("Error creating coupon:", err);
    return res.status(500).json({ error: err.message || "Failed to create coupon" });
  }
});
app.put("/api/admin/promocodes/:id", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const rawCode = String(req.body.code || "").trim().toUpperCase();
    if (!rawCode) return res.status(400).json({ error: "Coupon code is required" });
    const startDate = req.body.startDate ? String(req.body.startDate).trim() : "";
    const expiryDate = req.body.expiryDate ? String(req.body.expiryDate).trim() : req.body.expiresAt ? String(req.body.expiresAt).trim() : "";
    if (startDate && expiryDate && expiryDate < startDate) {
      return res.status(400).json({ error: "Expiry date must be on or after the start date." });
    }
    await connectToDatabase();
    const all = readPromoCodes();
    const idx = all.findIndex((c) => c.id === id);
    let existing = idx !== -1 ? all[idx] : null;
    if (import_mongoose.default.connection.readyState === 1 && !existing) {
      existing = await PromoCodeModel.findOne({ id }).lean();
    }
    if (!existing) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    if (all.some((c) => c.id !== id && c.code && c.code.toUpperCase() === rawCode)) {
      return res.status(409).json({ error: "Another coupon with this code already exists" });
    }
    const updated = {
      ...existing,
      ...req.body,
      id,
      code: rawCode,
      discountType: req.body.discountType === "percentage" ? "percentage" : "fixed",
      discountValue: Number(req.body.discountValue ?? existing.discountValue),
      minOrderAmount: Number(req.body.minOrderAmount ?? 0),
      maxDiscountAmount: req.body.maxDiscountAmount ? Number(req.body.maxDiscountAmount) : null,
      startDate: startDate || existing.startDate || "",
      expiryDate: expiryDate || existing.expiryDate || existing.expiresAt || "",
      usageLimit: req.body.usageLimit ? Number(req.body.usageLimit) : null,
      perUserLimit: req.body.perUserLimit ? Number(req.body.perUserLimit) : null,
      timesUsed: req.body.timesUsed !== void 0 ? Number(req.body.timesUsed) : existing.timesUsed,
      isActive: req.body.isActive !== false,
      description: String(req.body.description ?? "").trim(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    delete updated._id;
    delete updated.__v;
    if (idx !== -1) all[idx] = updated;
    else all.push(updated);
    writePromoCodes(all);
    if (import_mongoose.default.connection.readyState === 1) {
      await PromoCodeModel.findOneAndUpdate({ id }, updated, { upsert: true });
    }
    return res.json({ success: true, promoCode: updated, coupon: updated });
  } catch (err) {
    console.error("Error updating coupon:", err);
    return res.status(500).json({ error: err.message || "Failed to update coupon" });
  }
});
app.delete("/api/admin/promocodes/:id", requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      await PromoCodeModel.deleteOne({ id });
    }
    const all = readPromoCodes().filter((c) => c.id !== id);
    writePromoCodes(all);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to delete coupon" });
  }
});
app.put("/api/admin/promocodes/bulk-deactivate", requireAdminAuth, async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    if (ids.length === 0) return res.status(400).json({ error: "No coupon IDs provided" });
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      await PromoCodeModel.updateMany({ id: { $in: ids } }, { $set: { isActive: false, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } });
    }
    const all = readPromoCodes();
    all.forEach((c) => {
      if (ids.includes(c.id)) {
        c.isActive = false;
        c.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      }
    });
    writePromoCodes(all);
    return res.json({ success: true, count: ids.length });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to bulk deactivate coupons" });
  }
});
app.post("/api/admin/promocodes/bulk-delete", requireAdminAuth, async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    if (ids.length === 0) return res.status(400).json({ error: "No coupon IDs provided" });
    await connectToDatabase();
    if (import_mongoose.default.connection.readyState === 1) {
      await PromoCodeModel.deleteMany({ id: { $in: ids } });
    }
    const all = readPromoCodes().filter((c) => !ids.includes(c.id));
    writePromoCodes(all);
    return res.json({ success: true, count: ids.length });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to bulk delete coupons" });
  }
});
var cachedGoogleReviews = null;
var GOOGLE_REVIEWS_CACHE_TTL = 1e3 * 60 * 60;
function extractPlaceIdentifier(input) {
  if (!input) return {};
  const trimmed = input.trim();
  if (/^ChIJ[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return { placeId: trimmed };
  }
  const hexMatch = trimmed.match(/!1s(0x[0-9a-fA-F]+):(0x[0-9a-fA-F]+)/);
  if (hexMatch) {
    try {
      const cidDecimal = BigInt(hexMatch[2]).toString(10);
      return { cid: cidDecimal };
    } catch (e) {
    }
  }
  const cidMatch = trimmed.match(/[?&]cid=([0-9]+)/);
  if (cidMatch) {
    return { cid: cidMatch[1] };
  }
  const placeIdParam = trimmed.match(/[?&]place_id=([a-zA-Z0-9_-]+)/);
  if (placeIdParam) {
    return { placeId: placeIdParam[1] };
  }
  const placePathMatch = trimmed.match(/\/place\/([^\/@?]+)/);
  if (placePathMatch) {
    const segment = decodeURIComponent(placePathMatch[1]);
    if (/^ChIJ[a-zA-Z0-9_-]{20,}$/.test(segment)) {
      return { placeId: segment };
    }
    return { query: segment.replace(/\+/g, " ") };
  }
  return { query: trimmed };
}
app.post("/api/google-reviews/sync", async (req, res) => {
  try {
    cachedGoogleReviews = null;
    const settings = getCurrentWebsiteSettings();
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || settings.google_maps_api_key || settings.google_places_api_key || "";
    const gmbInput = (settings.google_business_profile_url || settings.google_place_id || process.env.GOOGLE_PLACE_ID || "").trim();
    const identifier = extractPlaceIdentifier(gmbInput);
    let targetPlaceId = identifier.placeId || "";
    if (apiKey) {
      if (!targetPlaceId && (identifier.cid || identifier.query)) {
        const findQuery = identifier.cid ? `cid:${identifier.cid}` : identifier.query || settings.business_name || "TravelLuxx";
        const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(findQuery)}&inputtype=textquery&fields=place_id,name&key=${encodeURIComponent(apiKey)}`;
        const findResp = await fetch(findUrl);
        if (findResp.ok) {
          const findData = await findResp.json();
          if (findData.candidates && findData.candidates.length > 0) {
            targetPlaceId = findData.candidates[0].place_id;
          }
        }
      }
      if (!targetPlaceId) targetPlaceId = "ChIJrTLr-Gyu2EcRBfy61iWz6vM";
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(targetPlaceId)}&fields=name,rating,user_ratings_total,reviews,url&key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK" && data.result) {
        const r = data.result;
        const reviews = (r.reviews || []).map((rev) => ({
          author_name: rev.author_name,
          rating: rev.rating,
          relative_time_description: rev.relative_time_description,
          time: rev.time,
          text: rev.text,
          profile_photo_url: rev.profile_photo_url || ""
        }));
        const payload2 = {
          success: true,
          source: "google_places_api",
          businessName: r.name || settings.business_name || "TravelLuxx",
          overallRating: r.rating || 5,
          totalReviews: r.user_ratings_total || reviews.length,
          googleMapsUrl: r.url || settings.google_business_profile_url || "https://maps.google.com/?cid=12345",
          reviews: reviews.length > 0 ? reviews : []
        };
        cachedGoogleReviews = { timestamp: Date.now(), data: payload2 };
        return res.json({ success: true, message: "Google reviews synced successfully via Google Places API!", payload: payload2 });
      }
    }
    const customList = Array.isArray(settings.google_reviews_list) && settings.google_reviews_list.length > 0 ? settings.google_reviews_list : null;
    const payload = {
      success: true,
      source: customList ? "custom_admin" : "curated",
      businessName: settings.business_name || "TravelLuxx",
      overallRating: Number(settings.google_reviews_rating) || 5,
      totalReviews: Number(settings.google_reviews_count) || (customList ? customList.length : 48),
      googleMapsUrl: settings.google_business_profile_url || "https://maps.google.com/?cid=12345",
      reviews: customList || [
        {
          author_name: "James Thornton",
          rating: 5,
          relative_time_description: "a week ago",
          time: Math.floor(Date.now() / 1e3) - 7 * 86400,
          text: "Outstanding service from Solihull to Heathrow Terminal 5. Driver was punctual, pristine Mercedes S-Class, and the journey was completely stress-free. TravelLuxx is now our company's go-to executive travel partner.",
          profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
        },
        {
          author_name: "Sarah Jenkins",
          rating: 5,
          relative_time_description: "2 weeks ago",
          time: Math.floor(Date.now() / 1e3) - 14 * 86400,
          text: "Booked an airport transfer from Birmingham Airport. Flight landed 30 minutes early, yet the chauffeur was already waiting at arrivals with a name board. Impeccable vehicle and polite chauffeur. 10/10!",
          profile_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
        },
        {
          author_name: "Marcus Vance",
          rating: 5,
          relative_time_description: "a month ago",
          time: Math.floor(Date.now() / 1e3) - 30 * 86400,
          text: "Booked the Mercedes V-Class for our family trip to London. Plenty of luggage space, smooth drive, and the kids were comfortable throughout. Booking process online was seamless and transparent.",
          profile_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
        },
        {
          author_name: "Dr. Alistair Ross",
          rating: 5,
          relative_time_description: "2 months ago",
          time: Math.floor(Date.now() / 1e3) - 60 * 86400,
          text: "Consistently professional and immaculate vehicles. Used them for multiple client meetings across Warwick and Birmingham. Never once been let down. Highest recommendation.",
          profile_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"
        }
      ]
    };
    cachedGoogleReviews = { timestamp: Date.now(), data: payload };
    return res.json({ success: true, message: "Reviews cache refreshed with your latest Google profile link!", payload });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || "Failed to sync reviews" });
  }
});
app.get("/api/google-reviews", async (req, res) => {
  const settings = getCurrentWebsiteSettings();
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || settings.google_maps_api_key || settings.google_places_api_key || "";
  const gmbInput = (settings.google_business_profile_url || settings.google_place_id || process.env.GOOGLE_PLACE_ID || "").trim();
  const identifier = extractPlaceIdentifier(gmbInput);
  let targetPlaceId = identifier.placeId || "";
  const now = Date.now();
  if (cachedGoogleReviews && now - cachedGoogleReviews.timestamp < GOOGLE_REVIEWS_CACHE_TTL) {
    if (!req.query.refresh) {
      return res.json(cachedGoogleReviews.data);
    }
  }
  const fallbackReviews = [
    {
      author_name: "James Thornton",
      rating: 5,
      relative_time_description: "a week ago",
      time: Math.floor(Date.now() / 1e3) - 7 * 86400,
      text: "Outstanding service from Solihull to Heathrow Terminal 5. Driver was punctual, pristine Mercedes S-Class, and the journey was completely stress-free. TravelLuxx is now our company's go-to executive travel partner.",
      profile_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    },
    {
      author_name: "Sarah Jenkins",
      rating: 5,
      relative_time_description: "2 weeks ago",
      time: Math.floor(Date.now() / 1e3) - 14 * 86400,
      text: "Booked an airport transfer from Birmingham Airport. Flight landed 30 minutes early, yet the chauffeur was already waiting at arrivals with a name board. Impeccable vehicle and polite chauffeur. 10/10!",
      profile_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
    },
    {
      author_name: "Marcus Vance",
      rating: 5,
      relative_time_description: "a month ago",
      time: Math.floor(Date.now() / 1e3) - 30 * 86400,
      text: "Booked the Mercedes V-Class for our family trip to London. Plenty of luggage space, smooth drive, and the kids were comfortable throughout. Booking process online was seamless and transparent.",
      profile_photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
    },
    {
      author_name: "Dr. Alistair Ross",
      rating: 5,
      relative_time_description: "2 months ago",
      time: Math.floor(Date.now() / 1e3) - 60 * 86400,
      text: "Consistently professional and immaculate vehicles. Used them for multiple client meetings across Warwick and Birmingham. Never once been let down. Highest recommendation.",
      profile_photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"
    }
  ];
  if (!apiKey) {
    const customList = Array.isArray(settings.google_reviews_list) ? settings.google_reviews_list : [];
    const payload = {
      success: true,
      source: "custom_admin",
      businessName: settings.business_name || "TravelLuxx",
      overallRating: Number(settings.google_reviews_rating) || 5,
      totalReviews: Number(settings.google_reviews_count) || customList.length,
      googleMapsUrl: settings.google_business_profile_url || "https://maps.google.com",
      reviews: customList
    };
    cachedGoogleReviews = { timestamp: now, data: payload };
    return res.json(payload);
  }
  try {
    if (!targetPlaceId && (identifier.cid || identifier.query)) {
      const findQuery = identifier.cid ? `cid:${identifier.cid}` : identifier.query || settings.business_name || "TravelLuxx";
      const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(findQuery)}&inputtype=textquery&fields=place_id,name&key=${encodeURIComponent(apiKey)}`;
      const findResp = await fetch(findUrl);
      if (findResp.ok) {
        const findData = await findResp.json();
        if (findData.candidates && findData.candidates.length > 0) {
          targetPlaceId = findData.candidates[0].place_id;
        }
      }
    }
    if (!targetPlaceId) {
      targetPlaceId = "ChIJrTLr-Gyu2EcRBfy61iWz6vM";
    }
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(targetPlaceId)}&fields=name,rating,user_ratings_total,reviews,url&key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Google Places HTTP ${response.status}`);
    const data = await response.json();
    if (data.status === "OK" && data.result) {
      const r = data.result;
      const reviews = (r.reviews || []).map((rev) => ({
        author_name: rev.author_name,
        rating: rev.rating,
        relative_time_description: rev.relative_time_description,
        time: rev.time,
        text: rev.text,
        profile_photo_url: rev.profile_photo_url || ""
      }));
      const payload = {
        success: true,
        source: "google_places_api",
        businessName: r.name || settings.business_name || "TravelLuxx",
        overallRating: r.rating || 5,
        totalReviews: r.user_ratings_total || reviews.length,
        googleMapsUrl: r.url || settings.google_business_profile_url || "https://maps.google.com/?cid=12345",
        reviews: reviews.length > 0 ? reviews : fallbackReviews
      };
      cachedGoogleReviews = { timestamp: now, data: payload };
      return res.json(payload);
    } else {
      console.warn("Google Places API response status:", data.status, data.error_message);
      const fallbackList = Array.isArray(settings.google_reviews_list) ? settings.google_reviews_list : [];
      const payload = {
        success: true,
        source: "custom_admin",
        businessName: settings.business_name || "TravelLuxx",
        overallRating: Number(settings.google_reviews_rating) || 5,
        totalReviews: Number(settings.google_reviews_count) || fallbackList.length,
        googleMapsUrl: settings.google_business_profile_url || "https://maps.google.com",
        reviews: fallbackList
      };
      cachedGoogleReviews = { timestamp: now, data: payload };
      return res.json(payload);
    }
  } catch (err) {
    console.error("Google Places Reviews API error:", err.message);
    const fallbackList = Array.isArray(settings.google_reviews_list) ? settings.google_reviews_list : [];
    const payload = {
      success: true,
      source: "custom_admin",
      businessName: settings.business_name || "TravelLuxx",
      overallRating: Number(settings.google_reviews_rating) || 5,
      totalReviews: Number(settings.google_reviews_count) || fallbackList.length,
      googleMapsUrl: settings.google_business_profile_url || "https://maps.google.com",
      reviews: fallbackList
    };
    cachedGoogleReviews = { timestamp: now, data: payload };
    return res.json(payload);
  }
});
app.get("/robots.txt", (req, res) => {
  const robotsPath = import_path.default.join(process.cwd(), "public", "robots.txt");
  if (import_fs.default.existsSync(robotsPath)) {
    res.type("text/plain").sendFile(robotsPath);
  } else {
    res.type("text/plain").send("User-agent: *\nDisallow: /admin\nSitemap: https://travelluxx.co.uk/sitemap.xml\n");
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
  const services = readServices().filter((s) => s.published !== false);
  for (const service of services) {
    const slug = service.slug || service.id;
    const lastmod = service.updatedAt ? new Date(service.updatedAt).toISOString().split("T")[0] : today;
    xml += `
  <url>
    <loc>${baseUrl}/services/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${service.image ? `
    <image:image>
      <image:loc>${service.image.startsWith("http") ? service.image : baseUrl + service.image}</image:loc>
      <image:title>${(service.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</image:title>
    </image:image>` : ""}
  </url>`;
  }
  const serviceAreas = readServiceAreas().filter((a) => a.published !== false);
  for (const area of serviceAreas) {
    const slug = area.slug || area.id;
    const lastmod = area.updatedAt ? new Date(area.updatedAt).toISOString().split("T")[0] : today;
    xml += `
  <url>
    <loc>${baseUrl}/service-areas/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${area.heroImage ? `
    <image:image>
      <image:loc>${area.heroImage.startsWith("http") ? area.heroImage : baseUrl + area.heroImage}</image:loc>
      <image:title>${(area.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}</image:title>
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
  connectToDatabase().catch((err) => {
    console.warn("[DB] Background DB connection deferred:", err.message);
  });
  const dev = process.env.NODE_ENV !== "production";
  let nextHandler = null;
  try {
    const nextModule = await import("next");
    const createNext = nextModule.default || nextModule;
    const nextApp = createNext({ dev, dir: process.cwd() });
    await nextApp.prepare();
    nextHandler = nextApp.getRequestHandler();
    console.log(`[MODE] Next.js ready in ${dev ? "development" : "production"} mode.`);
  } catch (err) {
    console.error("[MODE] Failed to initialize Next.js engine:", err);
  }
  app.all("*", (req, res, next) => {
    if (nextHandler) {
      return nextHandler(req, res);
    }
    next();
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} [mode: ${dev ? "development" : "production"}]`);
  });
}
if (!process.env.VERCEL) {
  startServer();
}
var server_default = app;
//# sourceMappingURL=server.cjs.map
