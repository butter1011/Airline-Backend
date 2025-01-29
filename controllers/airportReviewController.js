const AirlineAirport = require("../models/airlinePortListsSchema");
const AirportReview = require("../models/airportReviewsSchema");
const AirportScore = require("../models/airportScoresSchema");
const UserInfo = require("../models/userInfoSchema");
const { calculateAirportScores } = require("./calculatorController");
const WebSocket = require("ws");
const { getWebSocketInstance } = require("../utils/websocket");
const crypto = require("crypto");

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
      imageUrls,
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
      imageUrls,
    });

    let compositeScore = await calculateAirportScores(newAirportReview);
    newAirportReview.score = compositeScore;

    const savedReview = await newAirportReview.save();
    const populatedReview = await AirportReview.findById(savedReview._id)
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
            review: populatedReview,
          })
        );
      });
    }

    res.status(201).json({
      message: "Airport review created successfully",
      data: populatedReview,
    });
  } catch (error) {
    console.error("Error creating airport review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateAirportReview = async (req, res) => {
  try {
    const { feedbackId, user_id, isFavorite } = req.body;

    const existingReview = await AirportReview.findById(feedbackId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    let updatedRating = [...(existingReview.rating || [])];
    if (isFavorite) {
      if (!updatedRating.includes(user_id)) {
        updatedRating.push(user_id);
      }
    } else {
      updatedRating = updatedRating.filter((id) => id !== user_id);
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

    const formattedReviews = {
      _id: updatedReview._id,
      reviewer: {
        name: updatedReview.reviewer.name,
        profilePhoto: updatedReview.reviewer.profilePhoto,
        _id: updatedReview.reviewer._id,
      },
      airport: {
        name: updatedReview.airport.name,
        _id: updatedReview.airport._id,
      },
      airline: {
        name: updatedReview.airline.name,
        _id: updatedReview.airline._id,
      },
      classTravel: updatedReview.classTravel,
      comment: updatedReview.comment,
      date: updatedReview.date,
      rating: updatedReview.rating,
    };
    res.status(200).json({
      success: true,
      data: formattedReviews,
    });
  } catch (error) {
    console.error("Error updating airline review:", error);
    res.status(500).json({ success: false });
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
        select: "name countryCode city _id businessClass pey economyClass", // Added countryCode to select
        model: AirlineAirport,
      })
      .populate({
        path: "airline",
        select: "name _id",
        model: AirlineAirport,
      });

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
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
        city: review.airport.city,
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
      imageUrls: review.imageUrls,
      countryCode: review.airport.countryCode,
      score: review.score,
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
