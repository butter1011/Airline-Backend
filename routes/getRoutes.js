const express = require("express");
const router = express.Router();
const {
  getAirlineAirport, getAirlineAirportLists
} = require("../controllers/airportAirlineController");
const { getAirlineReviews } = require("../controllers/airlineReviewController");
const { getAirportReviews } = require("../controllers/airportReviewController");
const { getBoardingPass } = require("../controllers/boardingPassController");
const { getAirlineScore } = require("../controllers/airlineScoreController");
const { getAirportScore } = require("../controllers/airportScoreController");

// Get api
router.get("/api/v2/airline-airport", getAirlineAirport);
router.get("/api/v2/airline-reviews", getAirlineReviews);
router.get("/api/v2/airport-reviews", getAirportReviews);
router.get("/api/v2/boarding-pass", getBoardingPass);
router.get("/api/v2/airline-score", getAirlineScore);
router.get("/api/v2/airport-score", getAirportScore);
router.get("/api/v2/airline-airport/lists", getAirlineAirportLists);


module.exports = router;
