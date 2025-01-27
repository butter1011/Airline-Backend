const AirlineAirport = require("../models/airlinePortListsSchema");
const AirlineReview = require("../models/airlineReviewsSchema");
const UserInfo = require("../models/userInfoSchema");
const { calculateAirlineScores } = require("./calculatorController");
const WebSocket = require("ws");
const { getWebSocketInstance } = require("../utils/websocket");
const { uploadFileToS3 } = require("../utils/awsUpload");
const crypto = require("crypto");
// const { updateAirportReview } = require("./airportReviewController");

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

    // Generate a unique ID for the review
    console.log("newAirlineReview:", newAirlineReview);

    const compositeScore = await calculateAirlineScores(newAirlineReview);
    newAirlineReview.score = compositeScore;

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
        select: "name _id city",
        model: AirlineAirport,
      })
      .populate({
        path: "to",
        select: "name _id city",
        model: AirlineAirport,
      });

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
              review: populatedReview,
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
  console.log("req.body:", req.body);
  try {
    const { feedbackId, user_id, isFavorite } = req.body;

    const existingReview = await AirlineReview.findById(feedbackId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    let updatedRating = [...(existingReview.rating || [])];
    if (isFavorite) {
      console.log("user_id:", user_id,);
      if (!updatedRating.includes(user_id)) {
        updatedRating.push(user_id);
      }
    } else {
      updatedRating = updatedRating.filter(id => id !== user_id);
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
        select: "name _id city",
        model: AirlineAirport,
      })
      .populate({
        path: "to",
        select: "name _id city",
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
        city: updatedReview.from.city,
      },
      to: {
        name: updatedReview.to.name,
        _id: updatedReview.to._id,
        city: updatedReview.to.city,
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
    console.log("Formatted Reviews:", formattedReviews);
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
/// upload the media to the s3 bucket
const uploadAirlineMedia = async (req, res) => {
  console.log("Received request to upload media", req.body);
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const file = req.file;
    const reviewId = req.body.id;
    const mediaType = req.body.type; // 'image' or 'video'

    const fileType = file.originalname.split(".")[1].toLowerCase();
    const url = await uploadFileToS3(
      file.buffer,
      `review/${
        mediaType === "image"
          ? "airline"
          : mediaType === "video"
          ? "airline"
          : "airport"
      }/${crypto.randomUUID()}.${fileType}`
    );


    const review = await AirlineReview.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    if (mediaType === "image") {
      if (!review.images) {
        review.images = [];
      }
      review.images.push(url);
    } else {
      if (!review.videos) {
        review.videos = [];
      }
      review.videos.push(url);
    }

    const updateReview = await review.save();

    res.json({ data: updateReview, success: true });
  } catch (error) {
    console.error(`Error uploading ${req.body.type}:`, error);
    res
      .status(500)
      .json({ success: false, error: `${req.body.type} upload failed` });
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
        select: "name _id city",
        model: AirlineAirport,
      })
      .populate({
        path: "to",
        select: "name _id city",
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
        city: review.from.city,
      },
      to: {
        name: review.to.name,
        _id: review.to._id,
        city: review.to.city,
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
      images: review.images,
      videos: review.videos,
      countryCode: review.airline.countryCode,
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
    });
  }
};
module.exports = {
  createAirlineReview,
  getAirlineReviews,
  uploadAirlineMedia,
  updateAirlineReview,
};
