const mongoose = require("mongoose");

const airportScoreSchema = new mongoose.Schema(
  {
    object_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AirlineAirport",
      required: true
    },
    accessibility: {
      type: Number,
    },
    wait_times: {
      type: Number,
    },
    helpfulness: {
      type: Number,
    },
    ambience_comfort: {
      type: Number,
    },
    food_beverage: {
      type: Number,
    },
    amenities: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const AirportScore = mongoose.model("AirportScore", airportScoreSchema);

module.exports = AirportScore;