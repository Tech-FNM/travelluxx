import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://info_db_user:rexkTuz4elj0srRx@cluster0.utakxdh.mongodb.net/travelluxx?retryWrites=true&w=majority&appName=Cluster0";

const BookingSchema = new mongoose.Schema({}, { strict: false });
const BookingModel = mongoose.model("Booking", BookingSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB!");
  
  const bookings = await BookingModel.find().sort({ createdAt: -1 }).limit(5);
  console.log("Last 5 Bookings in MongoDB:");
  console.log(JSON.stringify(bookings, null, 2));
  
  await mongoose.disconnect();
}

run().catch(console.error);
