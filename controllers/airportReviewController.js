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

const getAirportReviewByAirportId = async (req, res) => {
  try {
    const { airportId } = req.params;

    const reviews = await AirportReview.findById(airportId)
      .populate({
        path: "reviewer",
        select: "name profilePhoto",
        model: UserInfo,
      })
      .populate({
        path: "airport",
        select: "name",
        model: AirlineAirport,
      })
      .populate({
        path: "airline",
        select: "name",
        model: AirlineAirport,
      })
      .sort({ rating: -1 });

    const formattedReviews = reviews.map((review) => ({
      id: review._id,
      reviewer: {
        name: review.reviewer.name,
        profilePhoto: review.reviewer.profilePhoto,
      },
      from: {
        name: review.from.name,
      },
      to: {
        name: review.to.name,
      },
      airline: {
        name: review.airline.name,
      },
      classTravel: review.classTravel,
      comment: review.comment,
      rating: review.rating,
    }));

    if (!reviews) {
      return res.status(404).json({ message: "Airport review not found" });
    }

    res.status(200).json({
      message: "Airport review retrieved successfully",
      formattedReviews,
    });
  } catch (error) {
    console.error("Error retrieving airport review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createAirportReview, getAirportReviewByAirportId };
