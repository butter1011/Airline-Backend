const AirlineScore = require("../models/airlineScoresSchema");
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

  console.log("airlineScore:", airlineScore);

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
    airlineAirport.overall = updateOverallScore(airlineAirport);

    await airlineAirport.save();
  }

  return airlineScore;
};

const updateClassScore = (currentScore, newScore, totalReviews) => {
  if (currentScore) {
    return (currentScore * (totalReviews - 1) + newScore) / totalReviews;
  }
  return newScore;
};

const updateOverallScore = (airlineAirport) => {
  const scores = [
    airlineAirport.firstClass,
    airlineAirport.buinessClass,
    airlineAirport.economyClass,
    airlineAirport.pey,
  ].filter((score) => score !== undefined);

  if (scores.length > 0) {
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
  return 0;
};

module.exports = {
  calculateAirlineScores,
};
