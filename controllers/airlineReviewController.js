const AirlineAirport = require("../models/airlinePortListsSchema");
const AirlineReview = require("../models/airlineReviewsSchema");
const UserInfo = require("../models/userInfoSchema");
const { calculateAirlineScores } = require("./calculatorController");
const { getWebSocketInstance } = require("../utils/websocket");
const WebSocket = require("ws");

// const { countries, continents } = require("countries-list");
// const locationToContinentMap = require("../json/city.json");

///
/// Create a new airline review
const createAirlineReview = async (req, res) => {
  try {
    const {
      reviewer,
      from,
      to,
      airline,
      classTravel,
      departureArrival,
      comfort,
      cleanliness,
      onboardService,
      foodBeverage,
      entertainmentWifi,
      comment,
    } = req.body;

    const newAirlineReview = new AirlineReview({
      reviewer,
      from,
      to,
      airline,
      classTravel,
      departureArrival,
      comfort,
      cleanliness,
      onboardService,
      foodBeverage,
      entertainmentWifi,
      comment,
    });

    const savedReview = await newAirlineReview.save();
    const airlineScore = await calculateAirlineScores(savedReview);

    await airlineScore.save();

    // Send WebSocket update
    const updatedAirlineAirports = await AirlineAirport.find().sort({
      overall: -1,
    });
    const updatedReviews = await getAirlineReviews();

    const wss = getWebSocketInstance();

    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: "airlineAirport",
              data: updatedAirlineAirports,
            })
          );
          client.send(
            JSON.stringify({
              type: "airlineReviews",
              data: updatedReviews,
            })
          );
        }
      });
    }

    res.status(201).json({
      message: "Airline review created successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error creating airline review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

///
/// Update an existing airline review
const updateAirlineReview = async (req, res) => {
  try {
    const { feedbackId, user_id, reactionType } = req.body;

    const existingReview = await AirlineReview.findById(feedbackId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    let updatedRating = { ...existingReview.rating };

    if (!updatedRating.hasOwnProperty(user_id)) {
      updatedRating[user_id] = reactionType;
    } else {
      updatedRating[user_id] = reactionType;
    }

    const updatedReview = await AirlineReview.findByIdAndUpdate(
      feedbackId,
      {
        $set: {
          rating: updatedRating,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating airline review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
///
/// Get all airline reviews
const getAirlineReviews = async (req, res) => {
  try {
    const reviews = await AirlineReview.find()
      .populate({
        path: "reviewer",
        select: "name profilePhoto _id",
        model: UserInfo,
      })
      .populate({
        path: "airline",
        select: "name _id",
        model: AirlineAirport,
      })
      .populate({
        path: "from",
        select: "name _id",
        model: AirlineAirport,
      })
      .populate({
        path: "to",
        select: "name _id",
        model: AirlineAirport,
      })
      .sort({ rating: -1 });

    const formattedReviews = reviews.map((review) => ({
      id: review._id,
      reviewer: {
        name: review.reviewer.name,
        profilePhoto: review.reviewer.profilePhoto,
        _id: review.reviewer._id,
      },
      from: {
        name: review.from.name,
        _id: review.from._id,
      },
      to: {
        name: review.to.name,
        _id: review.to._id,
      },
      airline: {
        name: review.airline.name,
        _id: review.airline._id,
      },
      classTravel: review.classTravel,
      comment: review.comment,
      date: review.date,
      rating: review.rating,
    }));

    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error("Error fetching airline reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ///
// /// Get the Continent for the given location
// const getContinentForLocation = (location) => {
//   if (!location) {
//     console.log("Location is undefined or null");
//     return "Unknown";
//   }

//   const normalizedLocation = location.trim().toLowerCase();
//   console.log(`Normalized location: ${normalizedLocation}`);

//   // Check our custom map first
//   if (locationToContinentMap[normalizedLocation]) {
//     console.log(
//       `Custom map match found: ${normalizedLocation} (${locationToContinentMap[normalizedLocation]})`
//     );
//     return locationToContinentMap[normalizedLocation];
//   }

//   // Check countries from countries-list
//   for (const [code, country] of Object.entries(countries)) {
//     if (country.name.toLowerCase() === normalizedLocation) {
//       const continent = continents[country.continent];
//       console.log(`Country match found: ${country.name} (${continent})`);
//       return continent;
//     }
//   }

//   // If no exact match, try partial matching
//   for (const [code, country] of Object.entries(countries)) {
//     if (
//       country.name.toLowerCase().includes(normalizedLocation) ||
//       normalizedLocation.includes(country.name.toLowerCase())
//     ) {
//       const continent = continents[country.continent];
//       console.log(
//         `Partial country match found: ${country.name} (${continent})`
//       );
//       return continent;
//     }
//   }

//   console.log(`No match found for: ${normalizedLocation}`);
//   return "Unknown";
// };

// ///
// /// Get a single airline review by ContinentID
// const gettingReviewData = async (req, res) => {
//   try {
//     const reviews = await AirlineReview.find()
//       .populate({
//         path: "reviewer",
//         select: "_id",
//         model: UserInfo,
//       })
//       .populate({
//         path: "airline",
//         select: "name location isAirline overall totalReviews isIncreasing",
//         model: AirlineAirport,
//       })
//       .find({ reviewer: req.body._id });
//     //   res.status(200).json(reviews);

//     const reviewsByContinent = {};

//     reviews.forEach((review) => {
//       const location = review.airline?.location || "Unknown";
//       console.log(`Processing location: ${location}`);
//       const continent = getContinentForLocation(location);

//       const reviewData = {
//         totalReviews: review.airline?.totalReviews || 0,
//         isIncreasing: review.airline?.isIncreasing || false,
//         id: review._id,
//         location: location,
//         continent: continent,
//         airline: review.airline?.name || "Unknown",
//         isAirline: review.airline?.isAirline || false,
//         overall: review.airline?.overall || 0,
//         classTravel: review.classTravel,
//         userId: review.reviewer?._id,
//         date: review.date,
//       };

//       if (!reviewsByContinent[continent]) {
//         reviewsByContinent[continent] = {
//           continent: continent,
//           data: [],
//         };
//       }
//       reviewsByContinent[continent].data.push(reviewData);
//     });
//     const formattedReviews = Object.values(reviewsByContinent);
//     res.status(200).json({ formattedReviews: formattedReviews });
//   } catch (error) {
//     console.error("Error fetching airline reviews:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

module.exports = {
  createAirlineReview,
  getAirlineReviews,
  updateAirlineReview,
};
