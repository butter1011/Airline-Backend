const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
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
  uploadUserAvatar,
} = require("../controllers/userInfoController");
const {
  createAirportReview,
  updateAirportReview,
  uploadImagesAirport,
} = require("../controllers/airportReviewController");
const {
  createAirlineReview,
  updateAirlineReview,
  uploadImagesAirline,
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
router.post("/api/v1/badgeEditUser", badgeEditUserInfo);
router.post("/api/v1/airport-review", createAirportReview);
router.post("/api/v1/airline-review", createAirlineReview);
router.post("/api/v1/boarding-pass", createBoardingPass);
router.post("/api/v1/boarding-pass/update", updateBoardingPass);

router.post(
  "/api/v1/airline-review/upload-images",
  upload.single("files"),
  uploadImagesAirline
);
router.post(
  "/api/v1/airport-review/upload-images",
  upload.single("files"),
  uploadImagesAirport
);

router.post("/api/v1/airline-review/update", updateAirlineReview);
router.post("/api/v1/airport-review/update", updateAirportReview);

// Postman API
router.post("/api/v1/airline-airport/create", createAirlineAirport);
router.post("/api/v1/airline-airport/update", updateAirlineAirport);
router.post("/api/v1/airline-airport/init", initializeClassCounts);

module.exports = router;
