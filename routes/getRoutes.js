const express = require("express");
const router = express.Router();
const { getAirlineAirport } = require("../controllers/airportAirlineCreate");
const { getUserInfo } = require("../controllers/userInfoController");

/// Get api
router.get("/api/v2/airline-airport", getAirlineAirport);
router.get("/api/v2/userinfo/:id", getUserInfo);

module.exports = router;
