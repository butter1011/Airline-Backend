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

  businessClassCount: {
    type: Number,
    default: 0,
  },

  economyClassCount: {
    type: Number,
    default: 0,
  },

  peyCount: {
    type: Number,
    default: 0,
  },

  businessClass: {
    type: Number,
    default: 0,
  },

  economyClass: {
    type: Number,
    default: 0,
  },

  pey: {
    type: Number,
    default: 0,
  },

  overall: {
    type: Number,
    default: 0,
  },

  location: {
    type: String,
    required: false,
  },

  isIncreasing: {
    type: Boolean,
    default: false,
  },

  logoImage: {
    type: String,
    required: false,
  },

  backgroundImage: {
    type: String,
    required: false,
  },

  descriptionBio: {
    type: String,
    required: false,
  },

  trendingBio: {
    type: String,
    required: false,
  },

  perksBio: {
    type: String,
    required: false,
  },

  iataCode: {
    type: String,
    required: false,
  },

  countryCode: {
    type: String,
    required: false,
  },

  scoreHistory: [
    {
      score: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
      },
    },
  ],
});

const AirlineAirport = mongoose.model("AirlineAirport", airlineAirportSchema);

module.exports = AirlineAirport;
