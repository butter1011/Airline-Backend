const express = require("express");
const router = express.Router();
const {
  getAirlineAirport,
} = require("../controllers/airportAirlineController");
const { getAirlineReviews } = require("../controllers/airlineReviewController");
const { getBoardingPass } = require("../controllers/boardingPassController");

// Get api
router.get("/api/v2/airline-airport", getAirlineAirport);
router.get("/api/v2/airline-reviews", getAirlineReviews);
router.get("/api/v2/boarding-pass", getBoardingPass);

module.exports = router;
