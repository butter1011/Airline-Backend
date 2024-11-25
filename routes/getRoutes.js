const express = require("express");
const router = express.Router();
const {
  getAirlineAirport,
  getAirlineAirportLists,
  getAirportReviewByUserId,
} = require("../controllers/airportAirlineController");
const { getUserInfo } = require("../controllers/userInfoController");
const {
  getAirlineReviews,
  getAirlineReviewsByAirlineId,
  getReviewsByUserId,
} = require("../controllers/airlineReviewController");

const {
  getAirportReviewByAirportId,
} = require("../controllers/airportReviewController");

// Get api
router.get("/api/v2/airline-airport", getAirlineAirport);
router.get("/api/v2/airline-reviews", getAirlineReviews);
router.get("/api/v2/airport-reviews", getAirlineReviews);
router.get("/api/v2/userinfo/:id", getUserInfo);
router.get("/api/v2/airline-airport/lists", getAirlineAirportLists);


router.get("/api/v2/airline-reviews/user/:userId", getReviewsByUserId);
router.get("/api/v2/airport-reviews/user/:userId", getAirportReviewByUserId);

router.get("/api/v2/airline-reviews/:airlineId", getAirlineReviewsByAirlineId);
router.get("/api/v2/airport-reviews/:airportId", getAirportReviewByAirportId);

module.exports = router;
