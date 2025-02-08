const express = require("express");
const router = express.Router();
const {
  getAirlineAirport,
  getAirlineAirportLists,
  getFilteredAirlineLists,
  getFilteredFeedLists,
  getCategoryRatings,
  getTopReviews,
  getUserReviews,
} = require("../controllers/airportAirlineController");
const { getAirlineReviews } = require("../controllers/airlineReviewController");
const { getAirportReviews } = require("../controllers/airportReviewController");
const {
  getBoardingPass,
  checkPnrExists,
  boardingPassDetails,
} = require("../controllers/boardingPassController");
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
router.get("/api/v2/boarding-pass/check-pnr", checkPnrExists);
router.get("/api/v2/boarding-pass/details", boardingPassDetails);
router.get("/api/v2/airline-list", getFilteredAirlineLists);
router.get("/api/v2/feed-list", getFilteredFeedLists);
router.get("/api/v2/category-ratings", getCategoryRatings);
router.get("/api/v2/top-reviews", getTopReviews);
router.get("/api/v2/user-reviews", getUserReviews);

module.exports = router;
