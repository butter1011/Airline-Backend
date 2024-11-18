const mongoose = require("mongoose");

const airlineScoreSchema = new mongoose.Schema({
  airlineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
    required: true,
    unique: true,
  },

  departureArrival: {
    type: Number,
  },

  comfort: {
    type: Number,
  },

  cleanliness: {
    type: Number,
  },

  onboardService: {
    type: Number,
  },

  foodBeverage: {
    type: Number,
  },

  entertainmentWifi: {
    type: Number,
  },

  count: {
    type: Number,
    default: 0,
  },
});

const AirlineScore = mongoose.model("AirlineScore", airlineScoreSchema);

module.exports = AirlineScore;
