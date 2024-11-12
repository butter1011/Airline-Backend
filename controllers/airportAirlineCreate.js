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

module.exports = {
  createAirlineAirport,
};
