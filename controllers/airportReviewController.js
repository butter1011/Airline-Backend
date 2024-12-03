const AirlineAirport = require("../models/airlinePortListsSchema");
const AirportReview = require("../models/airportReviewsSchema");
const AirportScore = require("../models/airportScoresSchema");
const UserInfo = require("../models/userInfoSchema");
const { calculateAirportScores } = require("./calculatorController");
const { getWebSocketInstance } = require("../utils/websocket");

///
/// Create a new airport review
const createAirportReview = async (req, res) => {
  try {
    const {
      reviewer,
      airport,
      airline,
      classTravel,
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
      classTravel,
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
      data: savedReview,
    });
  } catch (error) {
    console.error("Error creating airport review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateAirportReview = async (req, res) => {
  try {
    const { feedbackId, user_id, reactionType } = req.body;
    console.log("Received request to update airport review:", req.body);

    const existingReview = await AirportReview.findById(feedbackId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    let updatedRating = existingReview.rating || {};
    console.log("Updated Rating:", updatedRating);

    if (!updatedRating.hasOwnProperty(user_id)) {
      updatedRating[user_id] = reactionType;
    } else {
      updatedRating[user_id] = reactionType;
    }

    const updatedReview = await AirportReview.findByIdAndUpdate(
      feedbackId,
      {
        $set: {
          rating: updatedRating,
        },
      },
      { new: true }
    )
      .populate({
        path: "reviewer",
        select: "name profilePhoto _id",
        model: UserInfo,
      })
      .populate({
        path: "airline",
        select: "name _id",
        model: AirlineAirport,
      })
      .populate({
        path: "airport",
        select: "name _id",
        model: AirlineAirport,
      });


    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found after update" });
    }

    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating airline review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAirportReviews = async (req, res) => {

  try {
    const reviews = await AirportReview.find()
      .populate({
        path: "reviewer",
        select: "name profilePhoto _id",
        model: UserInfo,
      })
      .populate({
        path: "airport",
        select: "name countryCode _id businessClass pey economyClass", // Added countryCode to select
        model: AirlineAirport,
      })
      .populate({
        path: "airline",
        select: "name _id",
        model: AirlineAirport,
      });

    const formattedReviews = reviews.map((review) => ({
      id: review._id,
      reviewer: {
        name: review.reviewer.name,
        profilePhoto: review.reviewer.profilePhoto,
        _id: review.reviewer._id,
      },
      airport: {
        name: review.airport.name,
        _id: review.airport._id,
        businessClass: review.airport.businessClass,
        pey: review.airport.pey,
        economyClass: review.airport.economyClass,
      },
      airline: review.airline
        ? {
            name: review.airline.name,
            _id: review.airline._id,
          }
        : null,
      classTravel: review.classTravel,
      comment: review.comment,
      date: review.date,
      rating: review.rating,
      countryCode: review.airport.countryCode, // Added countryCode here
    }));

    res.status(200).json({
      success: true,
      data: formattedReviews,
    });
  } catch (error) {
    console.error("Error fetching airline reviews:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createAirportReview,
  updateAirportReview,
  getAirportReviews,
};
