const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
    },

    phoneNumber: {
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
