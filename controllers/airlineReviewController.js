const AirlineAirport = require("../models/airlinePortListsSchema");
const AirlineReview = require("../models/airlineReviewsSchema");
const UserInfo = require("../models/userInfoSchema");
const { calculateAirlineScores } = require("./calculatorController");
const { broadcastUpdate } = require("../utils/websocket");
const createAirlineReview = async (req, res) => {
  try {
    const {
      reviewer,
      from,
      to,
      airline,
      classTravel,
      departureArrival,
      comfort,
      cleanliness,
      onboardService,
      foodBeverage,
      entertainmentWifi,
      comment,
    } = req.body;

    const newAirlineReview = new AirlineReview({
      reviewer,
      from,
      to,
      airline,
      classTravel,
      departureArrival,
      comfort,
      cleanliness,
      onboardService,
      foodBeverage,
      entertainmentWifi,
      comment,
    });

    const savedReview = await newAirlineReview.save();
    const airlineScore = await calculateAirlineScores(savedReview);

    await airlineScore.save();

    // Send WebSocket update
    const updatedAirlineAirports = await AirlineAirport.find();
    broadcastUpdate("airlineAirport", updatedAirlineAirports);

    res.status(201).json({
      message: "Airline review created successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error creating airline review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAirlineReviews = async (req, res) => {
  try {
    const reviews = await AirlineReview.find()
      .populate({
        path: "reviewer",
        select: "name profilePhoto",
        model: UserInfo,
      })
      .populate({
        path: "from to airline",
        select: "name location",
        model: AirlineAirport,
      });

    const formattedReviews = reviews.map((review) => ({
      id: review._id,
      reviewer: {
        name: review.reviewer.name,
        profilePhoto: review.reviewer.profilePhoto,
      },
      from: {
        name: review.from.name,
        country: review.from.location,
      },
      to: {
        name: review.to.name,
        country: review.to.location,
      },
      airline: {
        name: review.airline.name,
      },
      classTravel: review.classTravel,
      comment: review.comment,
      date: review.date,
    }));

    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error("Error fetching airline reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createAirlineReview,
  getAirlineReviews,
};
