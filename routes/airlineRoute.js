const express = require("express");
const router = express.Router();
const { createAirlineAirport } = require("../controllers/create_airport_airline");

router.post("/api/v1/airline-airport", createAirlineAirport);

module.exports = router;
