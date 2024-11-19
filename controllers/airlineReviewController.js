const AirlineAirport = require("../models/airlinePortListsSchema");
const AirlineReview = require("../models/airlineReviewsSchema");
const UserInfo = require("../models/userInfoSchema");
const { countries, continents } = require("countries-list");
const locationToContinentMap = require("./city.json");

const getContinentForLocation = (location) => {
  if (!location) {
    console.log("Location is undefined or null");
    return "Unknown";
  }

  const normalizedLocation = location.trim().toLowerCase();
  console.log(`Normalized location: ${normalizedLocation}`);

  // Check our custom map first
  if (locationToContinentMap[normalizedLocation]) {
    console.log(
      `Custom map match found: ${normalizedLocation} (${locationToContinentMap[normalizedLocation]})`
    );
    return locationToContinentMap[normalizedLocation];
  }

  // Check countries from countries-list
  for (const [code, country] of Object.entries(countries)) {
    if (country.name.toLowerCase() === normalizedLocation) {
      const continent = continents[country.continent];
      console.log(`Country match found: ${country.name} (${continent})`);
      return continent;
    }
  }

  // If no exact match, try partial matching
  for (const [code, country] of Object.entries(countries)) {
    if (
      country.name.toLowerCase().includes(normalizedLocation) ||
      normalizedLocation.includes(country.name.toLowerCase())
    ) {
      const continent = continents[country.continent];
      console.log(
        `Partial country match found: ${country.name} (${continent})`
      );
      return continent;
    }
  }

  console.log(`No match found for: ${normalizedLocation}`);
  return "Unknown";
};
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

    res.status(201).json({
      message: "Airline review created successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error creating airline review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAirlineReviews = async (req, res) => {
  try {
    const reviews = await AirlineReview.find()
      .populate({
        path: "reviewer",
        select: "name profilePhoto",
        model: UserInfo,
      })
      .populate({
        path: "airline",
        select: "name location",
        model: AirlineAirport,
      });

    const formattedReviews = reviews.map((review) => ({
      id: review._id,
      reviewer: {
        name: review.reviewer.name,
        profilePhoto: review.reviewer.profilePhoto,
      },
      from: {
        name: review.from.name,
        country: review.from.location,
      },
      to: {
        name: review.to.name,
        country: review.to.location,
      },
      airline: {
        name: review.airline.name,
      },
      classTravel: review.classTravel,
      comment: review.comment,
      date: review.date,
    }));

    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error("Error fetching airline reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const gettingReviewData = async (req, res) => {
  try {
    console.log(req.body);
    const reviews = await AirlineReview.find()
      .populate({
        path: "reviewer",
        select: "_id",
        model: UserInfo,
      })
      .populate({
        path: "airline",
        select: "name location isAirline overall",
        model: AirlineAirport,
      })
      .find({ reviewer: req.body._id });
    //   res.status(200).json(reviews);
    console.log(reviews);
    const formattedReviews = reviews.map((review) => ({
      id: review._id,

      location: review.airline.location,
      airline: review.airline.name,
      isAirline: review.airline.isAirline,
      overall: review.airline.overall,
      classTravel: review.classTravel,
      userId: review.reviewer._id,
      continent: getContinentForLocation(review.airline.location),
      // comment: review.comment,
      date: review.date,
    }));

    console.log(formattedReviews);
    res.status(200).json({ data: formattedReviews });
  } catch (error) {
    console.error("Error fetching airline reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// exports.getAirlineReviewById = async (req, res) => {
//   try {
//     const review = await AirlineReview.findById(req.params.id)
//       .populate("reviewer", "username")
//       .populate("airline", "name");

//     if (!review) {
//       return res.status(404).json({ message: "Airline review not found" });
//     }

//     res.status(200).json(review);
//   } catch (error) {
//     console.error("Error fetching airline review:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.updateAirlineReview = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const updatedReview = await AirlineReview.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedReview) {
//       return res.status(404).json({ message: "Airline review not found" });
//     }

//     res.status(200).json({
//       message: "Airline review updated successfully",
//       review: updatedReview,
//     });
//   } catch (error) {
//     console.error("Error updating airline review:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.deleteAirlineReview = async (req, res) => {
//   try {
//     const deletedReview = await AirlineReview.findByIdAndDelete(req.params.id);

//     if (!deletedReview) {
//       return res.status(404).json({ message: "Airline review not found" });
//     }

//     res.status(200).json({
//       message: "Airline review deleted successfully",
//       review: deletedReview,
//     });
//   } catch (error) {
//     console.error("Error deleting airline review:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

module.exports = {
  createAirlineReview,
  getAirlineReviews,
  gettingReviewData,
};
