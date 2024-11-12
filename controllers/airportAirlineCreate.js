/// Create the Airline and Airport api
/// Check if the airline/airport already exists
const AirlineAirport = require("../models/airlinePortLists");

const createAirlineAirport = async (req, res) => {
  try {
    const { name, is_airline } = req.body;

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
      is_airline,
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
const getAirlineAirport = async (req, res) => {
  try {
    const airlineAirports = await AirlineAirport.find();

    res.status(200).json({
      message: "Airline/Airport data retrieved successfully",
      data: airlineAirports,
    });
  } catch (error) {
    console.error("Error fetching airline/airport data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createAirlineAirport,
  getAirlineAirport,
};
