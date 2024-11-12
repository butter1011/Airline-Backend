const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
    },

    whatsappNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserInfo = mongoose.model("UserInfo", userInfoSchema);

module.exports = UserInfo;
