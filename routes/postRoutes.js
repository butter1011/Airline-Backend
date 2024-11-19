const express = require("express");
const router = express.Router();
const {
  createAirlineAirport,
  updateAirlineAirport,
} = require("../controllers/airportAirlineController");
const {
  createUserInfo,
  editUserInfo,
  badgeEditUserInfo,
} = require("../controllers/userInfoController");
const {
  createAirportReview,
} = require("../controllers/airportReviewController");
const {
  createAirlineReview,
  gettingReviewData,
} = require("../controllers/airlineReviewController");

/// Post api
router.post("/api/v1/user", createUserInfo);
router.post("/api/v1/editUser", editUserInfo);
router.post("/api/v1/badgeEditUser", badgeEditUserInfo);
router.post("/api/v1/airline-airport", createAirlineAirport);
router.post("/api/v1/airport-review", createAirportReview);
router.post("/api/v1/airline-review", createAirlineReview);
router.post("/api/v1/airline/profile/review", gettingReviewData);

/// Unused API
router.post("/api/v1/airport-review", createAirportReview);

// Postman API
router.post("/api/v1/airline-airport/create", createAirlineAirport);
router.post("/api/v1/airline-airport/update", updateAirlineAirport);

module.exports = router;
