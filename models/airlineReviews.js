const mongoose = require("mongoose");

const airlineReviewSchema = new mongoose.Schema({
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

  departure_arrival: {
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

  onboard_service: {
    type: Object,
    required: true,
  },

  food_beverage: {
    type: Object,
    required: true,
  },

  entertainment_wifi: {
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

const AirlineReview = mongoose.model("AirlineReview", airlineReviewSchema);

module.exports = AirlineReview;
