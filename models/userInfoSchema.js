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

    selectedbadges: {
      type: String,
      required: false,
      default: "No Review",
    },

    badgeNumber: {
      type: Number,
      required: false,
      default: 6,
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

    badgeLists: {
      topReviewer: {
        type: Boolean,
        required: false,
        default: true,
      },

      AccessibleAdvocate: {
        type: Boolean,
        required: false,
        default: true,
      },

      atientVoyager: {
        type: Boolean,
        required: false,
        default: true,
      },

      NavigationalGuru: {
        type: Boolean,
        required: false,
        default: true,
      },

      ComfortConnoisseur: {
        type: Boolean,
        required: false,
        default: true,
      },

      CulinaryEnthusiast: {
        type: Boolean,
        required: false,
        default: true,
      },

      FacilityVirtuoso: {
        type: Boolean,
        required: false,
        default: true,
      },

      ServiceMaven: {
        type: Boolean,
        required: false,
        default: true,
      },

      SpotlessTraveler: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const UserInfo = mongoose.model("UserInfo", userInfoSchema);

module.exports = UserInfo;
