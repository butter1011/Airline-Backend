const mongoose = require("mongoose");

const airportScoreSchema = new mongoose.Schema({
  objectId: {
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
});

const AirportScore = mongoose.model("AirportScore", airportScoreSchema);

module.exports = AirportScore;