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
  updateAirportReview
} = require("../controllers/airportReviewController");
const {
  createAirlineReview,
  updateAirlineReview,
} = require("../controllers/airlineReviewController");
const {
  createBoardingPass,
  updateBoardingPass,
} = require("../controllers/boardingPassController");

/// Post api
router.post("/api/v1/user", createUserInfo);
router.post("/api/v1/editUser", editUserInfo);
router.post("/api/v1/badgeEditUser", badgeEditUserInfo);
router.post("/api/v1/airport-review", createAirportReview);
router.post("/api/v1/airline-review", createAirlineReview);
router.post("/api/v1/boarding-pass", createBoardingPass);
router.post("/api/v1/boarding-pass/update", updateBoardingPass);
router.post("/api/v1/airline-review/update", updateAirlineReview);
router.post("/api/v1/airport-review/update", updateAirportReview);

// Postman API
router.post("/api/v1/airline-airport/create", createAirlineAirport);
router.post("/api/v1/airline-airport/update", updateAirlineAirport);


module.exports = router;
