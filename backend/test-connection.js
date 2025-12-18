const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb://admin:admin123@127.0.0.1:27017/paytm?authSource=admin";

console.log("Attempting to connect to MongoDB...");
console.log("Connection string:", MONGO_URL.replace(/:[^:@]+@/, ":****@"));

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    console.log("Database name:", mongoose.connection.db.databaseName);
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Mongo error:", err.message);
    process.exit(1);
  });
