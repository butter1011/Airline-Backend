const AirlineAirport = require("../models/airlinePortListsSchema");
const AirlineReview = require("../models/airlineReviewsSchema");
const UserInfo = require("../models/userInfoSchema");
const { calculateAirlineScores } = require("./calculatorController");
const WebSocket = require("ws");
const { getWebSocketInstance } = require("../utils/websocket");
const { uploadFileToS3 } = require("../utils/awsUpload");
const crypto = require("crypto");

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

    const populatedReview = await AirlineReview.findById(savedReview._id)
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
      .select("reviewer from to airline classTravel comment date");

    const airlineScore = await calculateAirlineScores(savedReview);
    await airlineScore.save();

    // Send WebSocket update
    const updatedAirlineAirports = await AirlineAirport.find().sort({
      overall: -1,
    });

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
        }
      });
    }

    res.status(201).json({
      message: "Airline review created successfully",
      data: populatedReview,
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
      return res.status(404).json({ success: false });
    }

    const formattedReviews = {
      _id: updatedReview._id,
      reviewer: {
        name: updatedReview.reviewer.name,
        profilePhoto: updatedReview.reviewer.profilePhoto,
        _id: updatedReview.reviewer._id,
      },
      from: {
        name: updatedReview.from.name,
        _id: updatedReview.from._id,
      },
      to: {
        name: updatedReview.to.name,
        _id: updatedReview.to._id,
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

///
/// upload the images
const uploadImagesAirline = async (req, res) => {
  console.log("Received request to upload images", req.body);
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const file = req.file;
    const reviewId = req.body.id;

    const fileType = file.originalname.split(".")[1].toLowerCase();
    const url = await uploadFileToS3(
      file.buffer,
      `review/airline/${crypto.randomUUID()}.${fileType}`
    );

    console.log("URL:", url);

    const review = await AirlineReview.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    if (!review.images) {
      review.images = [];
    }
    review.images.push(url);
    const updateReview = await review.save();

    res.json({ data: updateReview, success: true });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ success: false, error: "File upload failed" });
  }
};

///
/// Get all airline reviews
const getAirlineReviews = async (req, res) => {
  try {
    const reviews = await AirlineReview.find()
      .populate({
        path: "reviewer",
        select: "name profilePhoto _id",
        model: UserInfo,
      })
      .populate({
        path: "airline",
        select: "name countryCode _id businessClass pey economyClass",
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

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
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
        businessClass: review.airline.businessClass,
        pey: review.airline.pey,
        economyClass: review.airline.economyClass,
      },
      classTravel: review.classTravel,
      comment: review.comment,
      date: review.date,
      rating: review.rating,
      countryCode: review.airline.countryCode,
    }));

    res.status(200).json({
      success: true,
      data: formattedReviews,
    });
  } catch (error) {
    console.error("Error fetching airline reviews:", error);
    res.status(500).json({
      success: false,
    });
  }
};
module.exports = {
  createAirlineReview,
  getAirlineReviews,
  updateAirlineReview,
  uploadImagesAirline,
};
