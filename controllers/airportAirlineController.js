/// Create the Airline and Airport api
/// Check if the airline/airport already exists
const AirlineAirport = require("../models/airlinePortListsSchema");

///
/// Create the Airline and Airport api

const initializeClassCounts = async (req, res) => {
  try {
    const airlineAirports = await AirlineAirport.find();

    const updates = await Promise.all(
      airlineAirports.map(async (item) => {
        const updated = await AirlineAirport.findByIdAndUpdate(
          item._id,
          {
            $set: {
              businessClassCount: 0,
              peyCount: 0,
              economyClassCount: 0,
            },
          },
          { new: true, runValidators: true }
        );
        return updated;
      })
    );

    res.status(200).json({
      success: true,
      message: "Class counts initialized successfully",
      data: updates,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error initializing class counts",
      error: error.message,
    });
  }
};
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
      businessClass,
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
      countryCode,
    } = req.body;

    const updatedAirlineAirport = await AirlineAirport.findByIdAndUpdate(
      id,
      {
        name,
        isAirline,
        totalReviews,
        firstClass,
        businessClass,
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
        countryCode,
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

module.exports = {
  createAirlineAirport,
  getAirlineAirport,
  updateAirlineAirport,
  initializeClassCounts
};
