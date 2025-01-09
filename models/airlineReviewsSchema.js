const mongoose = require("mongoose");

const airlineReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInfo",
    required: true,
  },

  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
    required: true,
  },

  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
    required: true,
  },

  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
    required: true,
  },

  classTravel: {
    type: String,
    enum: ["Economy", "Business", "Premium Economy", "First"],
    required: true,
  },

  departureArrival: {
    type: Object,
    required: true,
  },

  comfort: {
    type: Object,
    required: true,
  },

  cleanliness: {
    type: Object,
    required: true,
  },

  onboardService: {
    type: Object,
    required: true,
  },

  foodBeverage: {
    type: Object,
    required: true,
  },

  entertainmentWifi: {
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
    type: Object,
    required: false,
    default: {},
  },

  images: {
    type: [String],
    required: false,
    default: [],
  },

  videos: {
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

const AirlineReview = mongoose.model("AirlineReview", airlineReviewSchema);

module.exports = AirlineReview;
