const express = require("express");
const router = express.Router();
const {
  createAirlineAirport,
  getAirlineAirport,
} = require("../controllers/airportAirlineCreate");
const { createUserInfo } = require("../controllers/userCreate");
const { createAirportReview } = require("../controllers/airportReviewCreate");
const { createAirlineReview } = require("../controllers/airlineReviewCreate");

/// Post api
router.post("/api/v1/user", createUserInfo);
router.post("/api/v1/airline-airport", createAirlineAirport);
router.post("/api/v1/airport-review", createAirportReview);
router.post("/api/v1/airline-review", createAirlineReview);

/// Get api
router.get("/api/v1/airline-airport", getAirlineAirport);
module.exports = router;
