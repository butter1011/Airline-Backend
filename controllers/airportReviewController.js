const AirportReview = require("../models/airportReviewsSchema");

const createAirportReview = async (req, res) => {
  try {
    const {
      reviewer,
      from,
      to,
      airport,
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
      from,
      to,
      airport,
      accessibility,
      waitTimes,
      helpfulness,
      ambienceComfort,
      foodBeverage,
      amenities,
      comment,
    });

    const savedReview = await newAirportReview.save();

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
