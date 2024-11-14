const mongoose = require("mongoose");

const airlineAirportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  isAirline: {
    type: Boolean,
    required: true,
  },

  totalReviews: {
    type: Number,
    default: 0,
  },

  firstClass: {
    type: Number,
  },

  buinessClass: {
    type: Number,
  },

  economyClass: {
    type: Number,
  },

  pey: {
    type: Number,
  },

  overall: {
    type: Number,
    default: 0,
  },

  location: {
    type: String,
    required: false,
  },
});

const AirlineAirport = mongoose.model("AirlineAirport", airlineAirportSchema);

module.exports = AirlineAirport;
