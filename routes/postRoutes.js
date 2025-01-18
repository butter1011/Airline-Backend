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
} = require("../controllers/airportAirlineController");
const {
  createUserInfo,
  editUserInfo,
  badgeEditUserInfo,
  uploadUserAvatar,
  increaseUserPoints,
} = require("../controllers/userInfoController");
const {
  createAirportReview,
  updateAirportReview,
  uploadAirportMedia,
} = require("../controllers/airportReviewController");
const {
  createAirlineReview,
  uploadAirlineMedia,
  updateAirlineReview,
} = require("../controllers/airlineReviewController");
const {
  createBoardingPass,
  updateBoardingPass,
} = require("../controllers/boardingPassController");

/// Post api
router.post("/api/v1/user", createUserInfo);
router.post("/api/v1/editUser", editUserInfo);
router.post(
  "/api/v1/editUser/avatar",
  upload.single("avatar"),
  uploadUserAvatar
);
router.post("/api/v1/increase-user-points", increaseUserPoints);
router.post("/api/v1/badgeEditUser", badgeEditUserInfo);
router.post("/api/v1/airport-review", createAirportReview);
router.post("/api/v1/airline-review", createAirlineReview);
router.post("/api/v1/boarding-pass", createBoardingPass);
router.post("/api/v1/boarding-pass/update", updateBoardingPass);
router.post(
  "/api/v1/airline-review/upload-media",
  upload.single("files"),
  uploadAirlineMedia
);
router.post(
  "/api/v1/airport-review/upload-media",
  upload.single("files"),
  uploadAirportMedia
);

router.post("/api/v1/airline-review/update", updateAirlineReview);
router.post("/api/v1/airport-review/update", updateAirportReview);

// Postman API
router.post("/api/v1/airline-airport/create", createAirlineAirport);
router.post("/api/v1/airline-cirium/create", createAirlineByCirium);
router.post("/api/v1/airport-cirium/create", createAirportByCirium);
router.post("/api/v1/airline-airport/update", updateAirlineAirport);
router.post("/api/v1/airline-airport/init", initializeClassCounts);
router.post("/api/v1/airline-airport/init", initializeClassCounts);
router.post("/api/v1/airline-airport/update-score", updateScoreHistory);

module.exports = router;
