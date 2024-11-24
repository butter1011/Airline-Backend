/// Create the Airline and Airport api
/// Check if the airline/airport already exists
const AirlineAirport = require("../models/airlinePortListsSchema");
const AirportReview = require("../models/airportReviewsSchema");

///
/// Create the Airline and Airport api
const createAirlineAirport = async (req, res) => {
  try {
    const { name, isAirline } = req.body;

    // Check if an airline/airport with the same name already exists
    const existingAirlineAirport = await AirlineAirport.findOne({ name });

    if (existingAirlineAirport) {
      return res.status(401).json({
        success: false,
        message: "Airline/Airport with this name already exists",
      });
    }

    const newAirlineAirport = new AirlineAirport({
      name,
      isAirline,
    });

    const savedAirlineAirport = await newAirlineAirport.save();

    res.status(201).json({
      success: true,
      data: savedAirlineAirport,
      message: "Airline/Airport created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating Airline/Airport",
      error: error.message,
    });
  }
};

///
/// Get the Airline and Airport api
const getAirlineAirport = async (req, res) => {
  try {
    const airlineAirports = await AirlineAirport.find().sort({ overall: -1 });

    res.status(200).json({
      message: "Airline/Airport data retrieved successfully",
      data: airlineAirports,
    });
  } catch (error) {
    console.error("Error fetching airline/airport data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAirlineAirportLists = async (req, res) => {
  try {
    const airlineList = await AirlineAirport.find({ isAirline: true })
      .select("name logoImage overall")
      .sort({ overall: -1 });
    const airportList = await AirlineAirport.find({ isAirline: false })
      .select("name logoImage overall")
      .sort({ overall: -1 });

    res.status(200).json({
      success: true,
      message: "Airline and Airport lists retrieved successfully",
      data: {
        airlines: airlineList,
        airports: airportList,
      },
    });
  } catch (error) {
    console.error("Error fetching airline and airport lists:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving Airline and Airport lists",
      error: error.message,
    });
  }
};

///
/// Update the Airline and Airport api

const updateAirlineAirport = async (req, res) => {
  try {
    const {
      id,
      name,
      isAirline,
      totalReviews,
      firstClass,
      buinessClass,
      economyClass,
      pey,
      overall,
      location,
      logoImage,
      backgroundImage,
      descriptionBio,
      trendingBio,
      perksBio,
      iataCode,
    } = req.body;

    const updatedAirlineAirport = await AirlineAirport.findByIdAndUpdate(
      id,
      {
        name,
        isAirline,
        totalReviews,
        firstClass,
        buinessClass,
        economyClass,
        pey,
        overall,
        location,
        logoImage,
        backgroundImage,
        descriptionBio,
        trendingBio,
        perksBio,
        iataCode,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAirlineAirport) {
      return res.status(404).json({
        success: false,
        message: "Airline/Airport not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedAirlineAirport,
      message: "Airline/Airport updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating Airline/Airport",
      error: error.message,
    });
  }
};

///
/// Get the airport review by user id
const getAirportReviewByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await AirportReview.find({ reviewer: userId })
      .populate({
        path: "reviewer",
        select: "name profilePhoto",
        model: "UserInfo",
      })
      .populate({
        path: "airport",
        select: "name",
        model: "AirlineAirport",
      })
      .populate({
        path: "airline",
        select: "name",
        model: "AirlineAirport",
      })
      .sort({ date: -1 });

    if (!reviews || reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this user" });
    }

    const formattedReviews = reviews.map((review) => ({
      id: review._id,
      reviewer: {
        name: review.reviewer.name,
        profilePhoto: review.reviewer.profilePhoto,
      },
      airport: {
        name: review.airport.name,
      },
      airline: review.airline
        ? {
            name: review.airline.name,
          }
        : null,
      comment: review.comment,
      date: review.date,
    }));

    res.status(200).json({
      message: "User reviews retrieved successfully",
      reviews: formattedReviews,
    });
  } catch (error) {
    console.error("Error retrieving user reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAirportReviewByUserId,
  createAirlineAirport,
  getAirlineAirport,
  updateAirlineAirport,
  getAirlineAirportLists,
};
