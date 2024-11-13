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
  },
  {
    timestamps: true,
  }
);

const UserInfo = mongoose.model("UserInfo", userInfoSchema);

module.exports = UserInfo;
