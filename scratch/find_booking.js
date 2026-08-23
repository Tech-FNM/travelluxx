import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://info_db_user:rexkTuz4elj0srRx@cluster0.utakxdh.mongodb.net/travelluxx?retryWrites=true&w=majority&appName=Cluster0";

const BookingSchema = new mongoose.Schema({}, { strict: false });
const BookingModel = mongoose.model("Booking", BookingSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB!");
  
  const count = await BookingModel.countDocuments();
  console.log("Total bookings in MongoDB:", count);
  
  const spec = await BookingModel.findOne({ id: "WLC-2026-6658" });
  console.log("Search for WLC-2026-6658:", spec);
  
  const pendingCount = await BookingModel.countDocuments({ status: "Pending" });
  console.log("Total Pending bookings in MongoDB:", pendingCount);
  
  const confirmedCount = await BookingModel.countDocuments({ status: "Confirmed" });
  console.log("Total Confirmed bookings in MongoDB:", confirmedCount);
  
  await mongoose.disconnect();
}

run().catch(console.error);
