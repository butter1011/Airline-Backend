const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const {
  createAirlineAirport,
  updateAirlineAirport,
  initializeClassCounts,
  createAirlineByCirium,
  createAirportByCirium,
  updateScoreHistory,
  deleteAirlineAirport,
} = require("../controllers/airportAirlineController");
const {
  createUserInfo,
  editUserInfo,
  badgeEditUserInfo,
  increaseUserPoints,
} = require("../controllers/userInfoController");
const {
  createAirportReview,
  updateAirportReview,
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
router.post("/api/v1/increase-user-points", increaseUserPoints);
router.post("/api/v1/badgeEditUser", badgeEditUserInfo);
router.post("/api/v1/airport-review", createAirportReview);
router.post("/api/v1/airline-review", createAirlineReview);
router.post("/api/v1/boarding-pass", createBoardingPass);
router.post("/api/v1/boarding-pass/update", updateBoardingPass);
router.post("/api/v1/airline-review/update", updateAirlineReview);
router.post("/api/v1/airport-review/update", updateAirportReview);
router.post("/api/v1/airline-airport/delete", deleteAirlineAirport);

// Postman API
router.post("/api/v1/airline-airport/create", createAirlineAirport);
router.post("/api/v1/airline-cirium/create", createAirlineByCirium);
router.post("/api/v1/airline-airport/update", updateAirlineAirport);
router.post("/api/v1/airline-airport/init", initializeClassCounts);
router.post("/api/v1/airline-airport/update-score", updateScoreHistory);

module.exports = router;
