const mongoose = require("mongoose");

const airportReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserInfo",
    required: true,
  },

  from: {
    type: String,
    required: true,
  },

  to: {
    type: String,
    required: true,
  },

  airline: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
  },

  class_travel: {
    type: String,
    enum: ["Economy", "Business", "First", "Premium Economy"],
    required: true,
  },

  airport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
    required: true,
  },

  accessibility: {
    type: Object,
    required: true,
  },

  wait_times: {
    type: Object,
    required: true,
  },

  helpfulness: {
    type: Object,
    required: true,
  },

  ambience_comfort: {
    type: Object,
    required: true,
  },

  food_beverage: {
    type: Object,
    required: true,
  },

  amenities: {
    type: Object,
    required: true,
  },

  comment: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const AirportReview = mongoose.model("AirportReview", airportReviewSchema);

module.exports = AirportReview;
