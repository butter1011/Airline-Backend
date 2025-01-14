const mongoose = require("mongoose");

const boardingPassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    airlineName: {
      type: String,
      required: true,
    },

    departureAirportCode: {
      type: String,
      required: true,
    },

    departureAirportName: {
      type: String,
      required: true,
    },

    departureCountryCode: {
      type: String,
      required: true,
    },

    departureTime: {
      type: String,
      required: true,
    },

    arrivalAirportCode: {
      type: String,
      required: true,
    },

    arrivalAirportName: {
      type: String,
      required: true,
    },

    arrivalCountryCode: {
      type: String,
      required: true,
    },

    arrivalTime: {
      type: String,
      required: true,
    },

    classOfTravel: {
      type: String,
      required: true,
    },

    airlineCode: {
      type: String,
      required: true,
    },

    flightNumber: {
      type: String,
      required: true,
    },

    visitStatus: {
      type: String,
      required: true,
    },

    isFlightReviewed: {
      type: Boolean,
      required: true,
    },

    isDepartureAirportReviewed: {
      type: Boolean,
      required: true,
    },

    isArrivalAirportReviewed: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BoardingPass = mongoose.model("BoardingPass", boardingPassSchema);

module.exports = BoardingPass;