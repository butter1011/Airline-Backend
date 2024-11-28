const AirlineScores = require("../models/airlineScoresSchema");

const getAirlineScore = async (req, res) => {
  try {
    const airlineScores = await AirlineScores.find();
    res.status(200).json({
      success: true,
      data: airlineScores,
      message: "Airline Scores retrieved successfully",
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
  getAirlineScore,
};
