const mongoose = require("mongoose");

const airportScoreSchema = new mongoose.Schema({
  airportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
    required: true,
  },

  accessibility: {
    type: Number,
  },

  waitTimes: {
    type: Number,
  },

  helpfulness: {
    type: Number,
  },

  ambienceComfort: {
    type: Number,
  },

  foodBeverage: {
    type: Number,
  },

  amenities: {
    type: Number,
  },

  count: {
    type: Number,
    default: 0,
  },
});

const AirportScore = mongoose.model("AirportScore", airportScoreSchema);

module.exports = AirportScore;
