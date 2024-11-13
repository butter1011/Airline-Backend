const mongoose = require("mongoose");

const airlineScoreSchema = new mongoose.Schema({
  object_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirlineAirport",
    required: true,
  },

  departure_arrival: {
    type: Number,
  },

  comfort: {
    type: Number,
  },

  cleanliness: {
    type: Number,
  },

  onboard_service: {
    type: Number,
  },

  food_beverage: {
    type: Number,
  },

  entertainment_wifi: {
    type: Number,
  },
});

const AirlineScore = mongoose.model("AirlineScore", airlineScoreSchema);

module.exports = AirlineScore;
