const mongoose = require("mongoose");

const airlineAirportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  is_airline: {
    type: Boolean,
    required: true,
  },

  total_reviews: {
    type: Number,
    default: 0,
  },

  first_class: {
    type: Number,
  },

  buiness_class: {
    type: Number,
  },

  economy_class: {
    type: Number,
  },

  pey: {
    type: Number,
  },

  overall: {
    type: Number,
    default: 0,
  },
});

const AirlineAirport = mongoose.model("AirlineAirport", airlineAirportSchema);

module.exports = AirlineAirport;
