const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    flyertype: {
      type: String,
      required: false,
      default: "Business Class",
    },
    topReviewer: {
      type: String,
      required: false,
      default: "TopReviewer",
    },
    whatsappNumber: {
      type: String,
      required: false,
    },
    points: {
      type: Number,
      required: false,
      default: +500,
    },
    badges: {
      type: Number,
      required: false,
      default: +9,
    },
    travelHistory: {
      type: Object,
      required: false,
      unique: false,
    },
    preferences: {
      type: Object,
      required: false,
      unique: false,
    },
    profilePhoto: {
      type: String,
      required: false,
      unique: false,
    },
    bio: {
      type: String,
      required: false,
      default: "I am TopReviewer",
    },
    favoriteAirlines: {
      type: String,
      required: false,
      default: "British Airways",
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
