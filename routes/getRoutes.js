const express = require("express");
const router = express.Router();
const { getAirlineAirport } = require("../controllers/airportAirlineCreate");

/// Get api
router.get("/api/v2/airline-airport", getAirlineAirport);
module.exports = router;
