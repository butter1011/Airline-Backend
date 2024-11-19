const AirlineScore = require("../models/airlineScoresSchema");
const AirportScore = require("../models/airportScoresSchema");
const AirlineAirport = require("../models/airlinePortListsSchema");

const calculateAirlineScores = async (airlineReview) => {
  const categories = [
    "departureArrival",
    "comfort",
    "cleanliness",
    "onboardService",
    "foodBeverage",
    "entertainmentWifi",
  ];

  const scores = {};
  let totalLikes = 0;
  let totalDislikes = 0;

  categories.forEach((category) => {
    const categoryData = airlineReview[category];
    let categoryLikes = 0;
    let categoryDislikes = 0;

    Object.values(categoryData).forEach((value) => {
      if (value === true) categoryLikes++;
      if (value === false) categoryDislikes++;
    });

    totalLikes += categoryLikes;
    totalDislikes += categoryDislikes;

    const totalCategoryFeedbacks = categoryLikes + categoryDislikes;
    let compositeCategoryScore;

    if (totalCategoryFeedbacks > 0) {
      compositeCategoryScore = (categoryLikes / totalCategoryFeedbacks) * 10;
    } else {
      compositeCategoryScore = 5; // Default score if no feedbacks
    }

    compositeCategoryScore = Math.min(Math.max(compositeCategoryScore, 1), 10);
    scores[category] = compositeCategoryScore;
  });

  const totalFeedbacks = totalLikes + totalDislikes;
  let compositeScore;

  if (totalFeedbacks > 0) {
    compositeScore = (totalLikes / totalFeedbacks) * 10;
  } else {
    compositeScore = 5; // Default score if no feedbacks
  }

  compositeScore = Math.min(Math.max(compositeScore, 1), 10);

  let airlineScore = await AirlineScore.findOne({
    airlineId: airlineReview.airline.toString(),
  });

  if (airlineScore) {
    airlineScore.count += 1;
    categories.forEach((category) => {
      airlineScore[category] =
        (airlineScore[category] * (airlineScore.count - 1) + scores[category]) /
        airlineScore.count;
    });
    await airlineScore.save();
  } else {
    airlineScore = new AirlineScore({
      airlineId: airlineReview.airline.toString(),
      ...scores,
      count: 1,
    });
    await airlineScore.save();
  }
  const airlineAirport = await AirlineAirport.findById(
    airlineReview.airline.toString()
  );

  if (airlineAirport) {
    // Increment total reviews
    airlineAirport.totalReviews += 1;

    // Update class-specific scores
    const classType = airlineReview.classTravel.toLowerCase();
    if (classType === "first") {
      airlineAirport.firstClass = updateClassScore(
        airlineAirport.firstClass,
        compositeScore,
        airlineAirport.totalReviews
      );
    } else if (classType === "business") {
      airlineAirport.buinessClass = updateClassScore(
        airlineAirport.buinessClass,
        compositeScore,
        airlineAirport.totalReviews
      );
    } else if (classType === "economy") {
      airlineAirport.economyClass = updateClassScore(
        airlineAirport.economyClass,
        compositeScore,
        airlineAirport.totalReviews
      );
    } else if (classType === "premium economy") {
      airlineAirport.pey = updateClassScore(
        airlineAirport.pey,
        compositeScore,
        airlineAirport.totalReviews
      );
    }
    // Update overall score
    const previousOverallScore = airlineAirport.overall || 0;
    airlineAirport.overall = updateOverallScore(airlineAirport);

    // Update isIncreasing flag based on overall score change
    airlineAirport.isIncreasing =
      airlineAirport.overall > previousOverallScore;
    await airlineAirport.save();
  }

  return airlineScore;
};

const calculateAirportScores = async (airportReview) => {
  const categories = [
    "accessibility",
    "waitTimes",
    "helpfulness",
    "ambienceComfort",
    "foodBeverage",
    "amenities",
  ];

  const scores = {};
  let totalLikes = 0;
  let totalDislikes = 0;

  categories.forEach((category) => {
    const categoryData = airportReview[category];
    let categoryLikes = 0;
    let categoryDislikes = 0;

    Object.entries(categoryData).forEach(([key, value]) => {
      if (value === true) categoryLikes++;
      if (value === false) categoryDislikes++;
    });

    totalLikes += categoryLikes;
    totalDislikes += categoryDislikes;

    const totalCategoryFeedbacks = categoryLikes + categoryDislikes;
    let compositeCategoryScore;

    if (totalCategoryFeedbacks > 0) {
      compositeCategoryScore = (categoryLikes / totalCategoryFeedbacks) * 10;
    } else {
      compositeCategoryScore = 5; // Default score if no feedbacks
    }

    compositeCategoryScore = Math.min(Math.max(compositeCategoryScore, 1), 10);
    scores[category] = compositeCategoryScore;
  });

  const totalFeedbacks = totalLikes + totalDislikes;
  let compositeScore;

  if (totalFeedbacks > 0) {
    compositeScore = (totalLikes / totalFeedbacks) * 10;
  } else {
    compositeScore = 5; // Default score if no feedbacks
  }

  compositeScore = Math.min(Math.max(compositeScore, 1), 10);

  let airportScore = await AirportScore.findOne({
    airportId: airportReview.airport.toString(),
  });

  if (airportScore) {
    airportScore.count += 1;
    categories.forEach((category) => {
      airportScore[category] =
        (airportScore[category] * (airportScore.count - 1) + scores[category]) /
        airportScore.count;
    });
    await airportScore.save();
  } else {
    airportScore = new AirportScore({
      airportId: airportReview.airport.toString(),
      ...scores,
      count: 1,
    });
    await airportScore.save();
  }

  const airlineAirport = await AirlineAirport.findById(
    airportReview.airport.toString()
  );

  if (airlineAirport) {
    // Increment total reviews
    airlineAirport.totalReviews += 1;

    // Update overall score
    const previousOverallScore = airlineAirport.overall || 0;
    const newOverallScore = updateOverallScore(airlineAirport, compositeScore);

    if (!isNaN(newOverallScore)) {
      airlineAirport.overall = newOverallScore;

      // Update isIncreasing flag based on overall score change
      airlineAirport.isIncreasing = newOverallScore > previousOverallScore;
      await airlineAirport.save();
    } else {
      console.error("Invalid overall score calculated:", newOverallScore);
      airlineAirport.overall = previousOverallScore; // Keep the previous score if new score is NaN
      await airlineAirport.save();
    }
  }

  return airportScore;
};

const updateClassScore = (currentScore, newScore, totalReviews) => {
  if (currentScore !== undefined && currentScore !== null) {
    return (currentScore * (totalReviews - 1) + newScore) / totalReviews;
  }
  return newScore;
};

const updateOverallScore = (airlineAirport, newScore) => {
  if (airlineAirport.overall !== undefined && airlineAirport.overall !== null) {
    const updatedScore = (airlineAirport.overall * (airlineAirport.totalReviews - 1) + newScore) / airlineAirport.totalReviews;
    return isNaN(updatedScore) ? airlineAirport.overall : updatedScore;
  }
  return newScore || 0;
};

module.exports = {
  calculateAirlineScores,
  calculateAirportScores,
};
