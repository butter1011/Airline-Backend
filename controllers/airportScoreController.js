const AirportScores = require("../models/airportScoresSchema");

const getAirportScore = async (req, res) => {
  try {
    const airportScores = await AirportScores.find();
    res.status(200).json({
      success: true,
      data: airportScores,
      message: "Airport Scores retrieved successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error retrieving Airline Scores",
      error: error.message,
    });
  }
};
module.exports = {
  getAirportScore,
};
