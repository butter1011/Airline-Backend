const BoardingPass = require("../models/boardingPassSchema");
const AirlineAirport = require("../models/airlinePortListsSchema");

const createBoardingPass = async (req, res) => {
  try {
    const {
      name,
      pnr,
      airlineName,
      departureAirportCode,
      departureCity,
      departureCountryCode,
      departureTime,
      arrivalAirportCode,
      arrivalCity,
      arrivalCountryCode,
      arrivalTime,
      classOfTravel,
      airlineCode,
      flightNumber,
      visitStatus,
      isReviewed,
    } = req.body;

    const newBoardingPass = new BoardingPass({
      name,
      pnr,
      airlineName,
      departureAirportCode,
      departureCity,
      departureCountryCode,
      departureTime,
      arrivalAirportCode,
      arrivalCity,
      arrivalCountryCode,
      arrivalTime,
      classOfTravel,
      airlineCode,
      flightNumber,
      visitStatus,
      isReviewed,
    });

    const savedBoardingPass = await newBoardingPass.save();

    res.status(201).json({
      message: "Boarding Pass created successfully",
      boardingPass: savedBoardingPass,
    });
  } catch (error) {
    console.error("Error creating boarding pass:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBoardingPass = async (req, res) => {
  try {
    const { name } = req.query;
    let boardingPasses;

    boardingPasses = await BoardingPass.find({ name: name }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      message: "Boarding passes retrieved successfully",
      boardingPasses: boardingPasses,
    });
  } catch (error) {
    console.error("Error retrieving boarding passes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBoardingPass = async (req, res) => {
  try {
    const {
      _id,
      name,
      pnr,
      airlineName,
      departureAirportCode,
      departureCity,
      departureCountryCode,
      departureTime,
      arrivalAirportCode,
      arrivalCity,
      arrivalCountryCode,
      arrivalTime,
      classOfTravel,
      airlineCode,
      flightNumber,
      visitStatus,
      isReviewed,
    } = req.body;

    const updatedBoardingPass = await BoardingPass.findByIdAndUpdate(
      _id,
      {
        name,
        pnr,
        airlineName,
        departureAirportCode,
        departureCity,
        departureCountryCode,
        departureTime,
        arrivalAirportCode,
        arrivalCity,
        arrivalCountryCode,
        arrivalTime,
        classOfTravel,
        airlineCode,
        flightNumber,
        visitStatus,
        isReviewed,
      },
      { new: true }
    );

    if (!updatedBoardingPass) {
      return res.status(404).json({ message: "Boarding pass not found" });
    }

    res.status(200).json({
      message: "Boarding pass updated successfully",
      boardingPass: updatedBoardingPass,
    });
  } catch (error) {
    console.error("Error updating boarding pass:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkPnrExists = async (req, res) => {
  try {
    const { pnr } = req.query;
    const existingBoardingPass = await BoardingPass.findOne({ pnr: pnr });
    res.status(200).json({ exists: !!existingBoardingPass });
  } catch (error) {
    console.error("Error checking PNR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const boardingPassDetails = async (req, res) => {
  try {
    const { airline, departure, arrival } = req.query;

    const [airlineData, departureData, arrivalData] = await Promise.all([
      AirlineAirport.findOne({ iataCode: airline }),
      AirlineAirport.findOne({ iataCode: departure }),
      AirlineAirport.findOne({ iataCode: arrival }),
    ]);

    if (!airlineData || !departureData || !arrivalData) {
      return res.status(404).json({
        message: "One or more requested details not found",
      });
    }

    res.status(200).json({
      airline: airlineData,
      departure: departureData,
      arrival: arrivalData,
    });
  } catch (error) {
    console.error("Error retrieving boarding pass details:", error);
    res.status(500).json({
      message: "Failed to retrieve boarding pass details",
      error: error.message,
    });
  }
};
module.exports = {
  createBoardingPass,
  getBoardingPass,
  updateBoardingPass,
  checkPnrExists,
  boardingPassDetails,
};
