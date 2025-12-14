const mongoose = require("mongoose");

const MONGO_URL = "mongodb://localhost:27017/paytm?authSource=admin";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

const AccountSchema = new mongoose.Schema({
  balance: { Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const User = mongoose.model("User", UserSchema);
const Account = mongoose.model("Account", AccountSchema);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

module.exports = {
  User,
  Account,
};
