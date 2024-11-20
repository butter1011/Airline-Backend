/// Create the Airline and Airport api
/// Check if the airline/airport already exists
const AirlineAirport = require("../models/airlinePortListsSchema");
const { getWebSocketInstance } = require("../utils/websocket");
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
};
