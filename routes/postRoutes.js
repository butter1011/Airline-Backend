const express = require("express");
const router = express.Router();
const {
  createAirlineAirport,
  updateAirlineAirport,
  initializeClassCounts,
} = require("../controllers/airportAirlineController");
const {
  createUserInfo,
  editUserInfo,
  badgeEditUserInfo,
  uploadAvatar,
} = require("../controllers/userInfoController");
const {
  createAirportReview,
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
router.post("/api/v1/editUser/avatar", uploadAvatar);

router.post("/api/v1/badgeEditUser", badgeEditUserInfo);
router.post("/api/v1/airport-review", createAirportReview);
router.post("/api/v1/airline-review", createAirlineReview);
router.post("/api/v1/airline-review/update", updateAirlineReview);
router.post("/api/v1/boarding-pass", createBoardingPass);
router.post("/api/v1/boarding-pass/update", updateBoardingPass);

// Postman API
router.post("/api/v1/airline-airport/create", createAirlineAirport);
router.post("/api/v1/airline-airport/update", updateAirlineAirport);
router.post("/api/v1/airline-airport/init", initializeClassCounts);

module.exports = router;
