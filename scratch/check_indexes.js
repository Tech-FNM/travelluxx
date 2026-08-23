import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://info_db_user:rexkTuz4elj0srRx@cluster0.utakxdh.mongodb.net/travelluxx?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB!");
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  const indexes = await mongoose.connection.db.collection("bookings").indexes();
  console.log("Bookings Collection Indexes:");
  console.log(JSON.stringify(indexes, null, 2));
  
  await mongoose.disconnect();
}

run().catch(console.error);
