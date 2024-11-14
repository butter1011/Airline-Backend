const express = require("express");
const router = express.Router();
const {
  createAirlineAirport,
} = require("../controllers/airportAirlineController");
const { createUserInfo } = require("../controllers/userInfoController");
const {
  createAirportReview,
} = require("../controllers/airportReviewController");
const {
  createAirlineReview,
} = require("../controllers/airlineReviewController");

/// Post api
router.post("/api/v1/user", createUserInfo);
router.post("/api/v1/airline-airport", createAirlineAirport);
router.post("/api/v1/airport-review", createAirportReview);
router.post("/api/v1/airline-review", createAirlineReview);
router.post("")

module.exports = router;
