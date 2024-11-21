const express = require("express");
const router = express.Router();
const {
  getAirlineAirport, getAirlineAirportLists
} = require("../controllers/airportAirlineController");
const { getUserInfo } = require("../controllers/userInfoController");
const { getAirlineReviews } = require("../controllers/airlineReviewController");

// Get api
router.get("/api/v2/airline-airport", getAirlineAirport);
router.get("/api/v2/airline-reviews", getAirlineReviews);
router.get("/api/v2/userinfo/:id", getUserInfo);
router.get("/api/v2/airline-airport/lists", getAirlineAirportLists);

module.exports = router;
