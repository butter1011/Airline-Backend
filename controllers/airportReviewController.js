const AirlineAirport = require("../models/airlinePortListsSchema");
const AirportReview = require("../models/airportReviewsSchema");
const AirportScore = require("../models/airportScoresSchema");
const { calculateAirportScores } = require("./calculatorController");
const { getWebSocketInstance } = require("../utils/websocket");

const createAirportReview = async (req, res) => {
  try {
    const {
      reviewer,
      airport,
      airline,
      accessibility,
      waitTimes,
      helpfulness,
      ambienceComfort,
      foodBeverage,
      amenities,
      comment,
    } = req.body;

    const newAirportReview = new AirportReview({
      reviewer,
      airport,
      airline,
      accessibility,
      waitTimes,
      helpfulness,
      ambienceComfort,
      foodBeverage,
      amenities,
      comment,
    });

    const savedReview = await newAirportReview.save();

    let airportScore = await AirportScore.findOne({ airportId: airport });
    if (!airportScore) {
      airportScore = new AirportScore({ airportId: airport });
    }

    airportScore = await calculateAirportScores(savedReview, airportScore);
    await airportScore.save();

    // Send WebSocket update
    const updatedAirlineAirports = await AirlineAirport.find().sort({
      overall: -1,
    });
    const wss = getWebSocketInstance();
    // console.log("--------------------");
    // console.log(wss);
    // console.log("--------------------");

    if (wss) {
      wss.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: "airlineAirport",
            data: updatedAirlineAirports,
          })
        );
      });
    }

    res.status(201).json({
      message: "Airport review created successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error creating airport review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createAirportReview };
