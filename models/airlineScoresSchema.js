const mongoose = require("mongoose");

const airlineScoreSchema = new mongoose.Schema({
  objectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
    required: true,
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
});

const AirlineScore = mongoose.model("AirlineScore", airlineScoreSchema);

module.exports = AirlineScore;
