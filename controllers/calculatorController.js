const AirlineScore = require("../models/airlineScoresSchema");
const AirportScore = require("../models/airportScoresSchema");
const AirlineAirport = require("../models/airlinePortListsSchema");

///
/// Calculate the scores for an airline review
const calculateAirlineScores = async (airlineReview) => {
  const categories = [
    "departureArrival",
    "comfort",
    "cleanliness",
    "onboardService",
    "foodBeverage",
    "entertainmentWifi",
  ];

  let totalLikes = 0;
  let totalDislikes = 0;

  // Count total likes and dislikes across all categories
  categories.forEach((category) => {
    const categoryData = airlineReview[category];

    Object.values(categoryData).forEach((value) => {
      if (value === true) totalLikes++;
      if (value === false) totalDislikes++;
    });
  });

  // Calculate the final composite score
  let totalFeedback = totalLikes + totalDislikes;
  let compositeScore = totalFeedback > 0 
    ? 5 + ((totalLikes - totalDislikes) / totalFeedback) * 5 
    : 5;
  compositeScore = Math.min(Math.max(compositeScore, 1), 10);

  // Save or update airline score in database
  let airlineScore = await AirlineScore.findOne({
    airlineId: airlineReview.airline.toString(),
  });

  if (airlineScore) {
    airlineScore.count += 1;
    airlineScore.overall =
      (airlineScore.overall * (airlineScore.count - 1) + compositeScore) /
      airlineScore.count;
    await airlineScore.save();
  } else {
    airlineScore = new AirlineScore({
      airlineId: airlineReview.airline.toString(),
      overall: compositeScore,
      count: 1,
    });
    await airlineScore.save();
  }

  // Update the airline's overall rating
  const airlineAirport = await AirlineAirport.findById(
    airlineReview.airline.toString()
  );

  if (airlineAirport) {
    airlineAirport.totalReviews += 1;
    const previousOverallScore = airlineAirport.overall || 0;
    airlineAirport.overall =
      (previousOverallScore * (airlineAirport.totalReviews - 1) + compositeScore) /
      airlineAirport.totalReviews;

    airlineAirport.isIncreasing = airlineAirport.overall > previousOverallScore;
    airlineAirport.scoreHistory.push({
      score: airlineAirport.overall,
      timestamp: new Date(),
    });

    await airlineAirport.save();
  }

  return compositeScore;
};

/// Calculate the scores for an airport review
const calculateAirportScores = async (airportReview) => {
  const categories = [
    "accessibility",
    "waitTimes",
    "helpfulness",
    "ambienceComfort",
    "foodBeverage",
    "amenities",
  ];

  let totalLikes = 0;
  let totalDislikes = 0;

  // Count total likes and dislikes across all categories
  categories.forEach((category) => {
    const categoryData = airportReview[category];

    Object.values(categoryData).forEach((value) => {
      if (value === true) totalLikes++;
      if (value === false) totalDislikes++;
    });
  });

  // Calculate the final composite score
  let totalFeedback = totalLikes + totalDislikes;
  let compositeScore = totalFeedback > 0 
    ? 5 + ((totalLikes - totalDislikes) / totalFeedback) * 5 
    : 5;
  compositeScore = Math.min(Math.max(compositeScore, 1), 10);

  // Save or update airport score in database
  let airportScore = await AirportScore.findOne({
    airportId: airportReview.airport.toString(),
  });

  if (airportScore) {
    airportScore.count += 1;
    airportScore.overall =
      (airportScore.overall * (airportScore.count - 1) + compositeScore) /
      airportScore.count;
    await airportScore.save();
  } else {
    airportScore = new AirportScore({
      airportId: airportReview.airport.toString(),
      overall: compositeScore,
      count: 1,
    });
    await airportScore.save();
  }

  // Update the airport's overall rating
  const airlineAirport = await AirlineAirport.findById(
    airportReview.airport.toString()
  );

  if (airlineAirport) {
    airlineAirport.totalReviews += 1;
    const previousOverallScore = airlineAirport.overall || 0;
    airlineAirport.overall =
      (previousOverallScore * (airlineAirport.totalReviews - 1) + compositeScore) /
      airlineAirport.totalReviews;

    airlineAirport.isIncreasing = airlineAirport.overall > previousOverallScore;
    airlineAirport.scoreHistory.push({
      score: airlineAirport.overall,
      timestamp: new Date(),
    });

    await airlineAirport.save();
  }

  return compositeScore;
};


///
/// Update the class-specific scores
const updateClassScore = (currentScore, newScore, count) => {
  return (currentScore * (count - 1) + newScore) / count;
};

///
/// Update the overall score
const updateOverallScore = (airlineAirport, newScore) => {
  return (
    (airlineAirport.overall * (airlineAirport.totalReviews - 1) + newScore) /
    airlineAirport.totalReviews
  );
};

module.exports = {
  calculateAirlineScores,
  calculateAirportScores,
};
