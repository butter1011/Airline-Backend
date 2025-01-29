const mongoose = require("mongoose");

const airportReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInfo",
    required: true,
  },

  airport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
    required: true,
  },

  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
  },
  classTravel: {
    type: String,
    enum: ["Economy", "Business", "First", "Premium Economy", "First"],
    required: true,
  },

  accessibility: {
    type: Object,
    required: true,
  },

  waitTimes: {
    type: Object,
    required: true,
  },

  helpfulness: {
    type: Object,
    required: true,
  },

  ambienceComfort: {
    type: Object,
    required: true,
  },

  foodBeverage: {
    type: Object,
    required: true,
  },

  amenities: {
    type: Object,
    required: true,
  },

  comment: {
    type: String,
    trim: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  rating: {
    type: [String],
    required: false,
    default: [],
  },

  imageUrls: {
    type: [String],
    required: false,
    default: [],
  },

  score: {
    type: Number,
    required: false,
    default: 0,
  },
});

const AirportReview = mongoose.model("AirportReview", airportReviewSchema);

module.exports = AirportReview;
