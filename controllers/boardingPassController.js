const BoardingPass = require("../models/boardingPassSchema");

const createBoardingPass = async (req, res) => {
  try {
    const {
      name,
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
      isFlightReviewed,
      isDepartureAirportReviewed,
      isArrivalAirportReviewed,
    } = req.body;

    const newBoardingPass = new BoardingPass({
      name,
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
      isFlightReviewed,
      isDepartureAirportReviewed,
      isArrivalAirportReviewed,
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
      isFlightReviewed,
      isDepartureAirportReviewed,
      isArrivalAirportReviewed,
    } = req.body;

    const updatedBoardingPass = await BoardingPass.findByIdAndUpdate(
      _id,
      {
        name,
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
        isFlightReviewed,
        isDepartureAirportReviewed,
        isArrivalAirportReviewed,
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

module.exports = {
  createBoardingPass,
  getBoardingPass,
  updateBoardingPass,
};
