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

  let compositeScore =
    Object.values(scores).reduce((sum, score) => sum + score, 0) /
    categories.length;
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
    airlineAirport.totalReviews += 1;
    const classType = airlineReview.classTravel.toLowerCase();

    switch (classType) {
      case "business":
        airlineAirport.businessClassCount += 1;
        airlineAirport.businessClass = updateClassScore(  
          airlineAirport.businessClass,
          compositeScore,
          airlineAirport.buinessClassCount
        );
        console.log(airlineAirport.businessClassCount);
        console.log(airlineAirport.businessClass);
        break;
      case "economy":
        airlineAirport.economyClassCount += 1;
        airlineAirport.economyClass = updateClassScore(
          airlineAirport.economyClass,
          compositeScore,
          airlineAirport.economyClassCount
        );
        console.log(airlineAirport.economyClassCount);
        console.log(airlineAirport.economyClass)
        break;
      case "premium economy":
        airlineAirport.peyCount += 1;
        airlineAirport.pey = updateClassScore(
          airlineAirport.pey,
          compositeScore,
          airlineAirport.peyCount
        );
        break;
    }

    const previousOverallScore = airlineAirport.overall || 0;
    airlineAirport.overall = updateOverallScore(airlineAirport, compositeScore);
    airlineAirport.isIncreasing = airlineAirport.overall > previousOverallScore;

    await airlineAirport.save();
  }

  return airlineScore;
}; ///
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

  const scores = {};
  let totalLikes = 0;
  let totalDislikes = 0;

  categories.forEach((category) => {
    const categoryData = airportReview[category];
    let categoryLikes = 0;
    let categoryDislikes = 0;

    Object.entries(categoryData).forEach((value) => {
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

  let compositeScore =
    Object.values(scores).reduce((sum, score) => sum + score, 0) /
    categories.length;
  compositeScore = Math.min(Math.max(compositeScore, 1), 10);

  let airportScore = await AirportScore.findOne({
    airportId: airportReview.airport.toString(),
  });

  // save the category scores to the database
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

  // Update the total reviews and class-specific scores
  const airlineAirport = await AirlineAirport.findById(
    airportReview.airport.toString()
  );

  if (airlineAirport) {
    // Increment total reviews
    airlineAirport.totalReviews += 1;

    // Update overall score
    const previousOverallScore = airlineAirport.overall || 0;
    airlineAirport.overall = updateOverallScore(airlineAirport, compositeScore);

    // Update isIncreasing flag based on overall score change
    airlineAirport.isIncreasing = newOverallScore > previousOverallScore;
    console.log(await airlineAirport.save());
  }

  return airportScore;
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
