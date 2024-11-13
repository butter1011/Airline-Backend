const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: false,
    },
    whatsappNumber: {
      type: String,
      required: false,
      unique: false,
    },
    points: {
      type: Number,
      required: false,
      default: 0,
    },
    badges: {
      type: Number,
      required: false,
      default: 0,
    },
    travelHistory: {
      type: Object,
      required: false,
    },
    preferences: {
      type: Object,
      required: false,
    },
    profilePhoto: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    favoriteAirlines: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      enum: ["English", "Chinese", "Russian"],
      required: false,
      default: "English",
    },
  },
  {
    timestamps: true,
  }
);

const UserInfo = mongoose.model("UserInfo", userInfoSchema);

module.exports = UserInfo;