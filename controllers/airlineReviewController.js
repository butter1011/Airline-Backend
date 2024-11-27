const AirlineAirport = require("../models/airlinePortListsSchema");
const AirlineReview = require("../models/airlineReviewsSchema");
const UserInfo = require("../models/userInfoSchema");
const { calculateAirlineScores } = require("./calculatorController");
const { getWebSocketInstance } = require("../utils/websocket");
const WebSocket = require("ws");

///
/// Create a new airline review
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
    const updatedAirlineAirports = await AirlineAirport.find().sort({
      overall: -1,
    });
    const updatedReviews = await AirlineReview.find()
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
        path: "from",
        select: "name _id",
        model: AirlineAirport,
      })
      .populate({
        path: "to",
        select: "name _id",
        model: AirlineAirport,
      })
      .sort({ rating: -1 });

    const formattedReviews = updatedReviews.map((review) => ({
      id: review._id,
      reviewer: {
        name: review.reviewer.name,
        profilePhoto: review.reviewer.profilePhoto,
        _id: review.reviewer._id,
      },
      from: {
        name: review.from.name,
        _id: review.from._id,
      },
      to: {
        name: review.to.name,
        _id: review.to._id,
      },
      airline: {
        name: review.airline.name,
        _id: review.airline._id,
      },
      classTravel: review.classTravel,
      comment: review.comment,
      date: review.date,
      rating: review.rating,
    }));

    const wss = getWebSocketInstance();

    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "airlineAirport",
              data: updatedAirlineAirports,
            })
          );
          client.send(
            JSON.stringify({
              type: "airlineReviews",
              data: formattedReviews,
            })
          );
        }
      });
    }

    res.status(201).json({
      message: "Airline review created successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error creating airline review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

///
/// Update an existing airline review
const updateAirlineReview = async (req, res) => {
  try {
    const { feedbackId, user_id, reactionType } = req.body;

    const existingReview = await AirlineReview.findById(feedbackId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    let updatedRating = existingReview.rating || {};

    if (!updatedRating.hasOwnProperty(user_id)) {
      updatedRating[user_id] = reactionType;
    } else {
      updatedRating[user_id] = reactionType;
    }

    const updatedReview = await AirlineReview.findByIdAndUpdate(
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
        path: "from",
        select: "name _id",
        model: AirlineAirport,
      })
      .populate({
        path: "to",
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

///
/// Get all airline reviews
const getAirlineReviews = async () => {
  const reviews = await AirlineReview.find()
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
      path: "from",
      select: "name _id",
      model: AirlineAirport,
    })
    .populate({
      path: "to",
      select: "name _id",
      model: AirlineAirport,
    })
    .sort({ rating: -1 });

  return reviews.map((review) => ({
    id: review._id,
    reviewer: {
      name: review.reviewer.name,
      profilePhoto: review.reviewer.profilePhoto,
      _id: review.reviewer._id,
    },
    from: {
      name: review.from.name,
      _id: review.from._id,
    },
    to: {
      name: review.to.name,
      _id: review.to._id,
    },
    airline: {
      name: review.airline.name,
      _id: review.airline._id,
    },
    classTravel: review.classTravel,
    comment: review.comment,
    date: review.date,
    rating: review.rating,
  }));
};

module.exports = {
  createAirlineReview,
  getAirlineReviews,
  updateAirlineReview,
};