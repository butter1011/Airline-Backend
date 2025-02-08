/// Create the Airline and Airport api
/// Check if the airline/airport already exists
const axios = require("axios");
const AirlineAirport = require("../models/airlinePortListsSchema");
const AirlineReview = require("../models/airlineReviewsSchema");
const AirportReview = require("../models/airportReviewsSchema");
const AirlineScore = require("../models/airlineScoresSchema");
const AirportScore = require("../models/airportScoresSchema");
const UserInfo = require("../models/userInfoSchema");

///
/// Create the Airline and Airport api

const initializeClassCounts = async (req, res) => {
  try {
    const airlineAirports = await AirlineAirport.find();

    const updates = await Promise.all(
      airlineAirports.map(async (item) => {
        const updated = await AirlineAirport.findByIdAndUpdate(
          item._id,
          {
            $set: {
              businessClassCount: 0,
              peyCount: 0,
              economyClassCount: 0,
            },
          },
          { new: true, runValidators: true }
        );
        return updated;
      })
    );

    res.status(200).json({
      success: true,
      message: "Class counts initialized successfully",
      data: updates,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error initializing class counts",
      error: error.message,
    });
  }
};
const createAirlineAirport = async (req, res) => {
  try {
    const { name, isAirline } = req.body;

    // Check if an airline/airport with the same name already exists
    const existingAirlineAirport = await AirlineAirport.findOne({ name });

    if (existingAirlineAirport) {
      return res.status(401).json({
        success: false,
        message: "Airline/Airport with this name already exists",
      });
    }

    const newAirlineAirport = new AirlineAirport({
      name,
      isAirline,
    });

    const savedAirlineAirport = await newAirlineAirport.save();

    res.status(201).json({
      success: true,
      data: savedAirlineAirport,
      message: "Airline/Airport created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating Airline/Airport",
      error: error.message,
    });
  }
};

///
/// Get the Airline and Airport api
const getAirlineAirport = async (req, res) => {
  try {
    const airlineAirports = await AirlineAirport.find().sort({
      overall: -1,
    });

    res.status(200).json({
      message: "Airline/Airport data retrieved successfully",
      data: airlineAirports,
    });
  } catch (error) {
    console.error("Error fetching airline/airport data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
///
/// Update the Airline and Airport api
const updateAirlineAirport = async (req, res) => {
  try {
    const {
      id,
      name,
      isAirline,
      totalReviews,
      firstClass,
      businessClass,
      economyClass,
      pey,
      overall,
      location,
      logoImage,
      backgroundImage,
      descriptionBio,
      trendingBio,
      perksBio,
      iataCode,
      countryCode,
    } = req.body;

    const updateFields = {
      name,
      isAirline,
      totalReviews,
      firstClass,
      businessClass,
      economyClass,
      pey,
      overall,
      location,
      logoImage,
      iataCode,
      countryCode,
    };

    if (descriptionBio !== null) {
      updateFields.descriptionBio = descriptionBio;
    }

    if (trendingBio !== null) {
      updateFields.trendingBio = trendingBio;
    }

    if (perksBio !== null) {
      updateFields.perksBio = perksBio;
    }

    if (backgroundImage !== null) {
      updateFields.backgroundImage = backgroundImage;
    }

    const updatedAirlineAirport = await AirlineAirport.findByIdAndUpdate(
      { _id: id },
      updateFields,
      { new: true, runValidators: true }
    );
    if (!updatedAirlineAirport) {
      return res.status(404).json({
        success: false,
        message: "Airline/Airport not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedAirlineAirport,
      message: "Airline/Airport updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating Airline/Airport",
      error: error.message,
    });
  }
};

///
/// Uodate the ScoreHistory api
const updateScoreHistory = async (req, res) => {
  try {
    const { id, score } = req.body;

    const updatedAirlineAirport = await AirlineAirport.findByIdAndUpdate(
      id,
      {
        $push: { scoreHistory: score },
      },
      { new: true, runValidators: true }
    );

    if (!updatedAirlineAirport) {
      return res.status(404).json({
        success: false,
        message: "Airline/Airport not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedAirlineAirport,
      message: "Score history updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating score history",
      error: error.message,
    });
  }
};

///
/// Get the Airline and Airport api
const getAirlineAirportLists = async (req, res) => {
  try {
    const airlineList = await AirlineAirport.find({ isAirline: true })
      .select("name logoImage overall")
      .sort({ overall: -1 });
    const airportList = await AirlineAirport.find({ isAirline: false })
      .select("name logoImage overall")
      .sort({ overall: -1 });
    res.status(200).json({
      success: true,
      message: "Airline and Airport lists retrieved successfully",
      data: {
        airlines: airlineList,
        airports: airportList,
      },
    });
  } catch (error) {
    console.error("Error fetching airline and airport lists:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving Airline and Airport lists",
      error: error.message,
    });
  }
};

const createAirlineByCirium = async (req, res) => {
  try {
    const airlineDataByCirium = await axios.get(
      "https://api.flightstats.com/flex/airlines/rest/v1/json/active",
      {
        params: {
          appId: process.env.CIRIUM_APP_ID,
          appKey: process.env.CIRIUM_APP_KEY,
        },
      }
    );
    const promises = airlineDataByCirium.data.airlines.map(async (airline) => {
      if (!airline.iata) return;

      const existingAirline = await AirlineAirport.findOne({
        name: airline.name,
      });

      if (!existingAirline) {
        const newAirline = new AirlineAirport({
          name: airline.name,
          isAirline: true,
          iataCode: airline.iata,
          perksBio:
            "Enjoy exclusive perks with us, including priority boarding, complimentary meals, and lounge access. Our frequent flyer program rewards your loyalty with upgrades and discounts. Travel better with our thoughtful amenities!",
          trendingBio:
            "Join the travelers who love flying with us! We offer in-flight Wi-Fi, personalized meals, and seamless connections. Stay tuned for our latest promotions and make the most of your journey!",
          descriptionBio:
            "We provide a top-notch flying experience with a modern fleet and friendly service. Enjoy comfortable seating and support from booking to landing. Travel with us for a smooth and enjoyable journey!",
        });
        return await newAirline.save();
      }
    });

    await Promise.all(promises);

    res.status(200).json({
      success: true,
      message: "Airlines created successfully",
    });
  } catch (error) {
    console.error("Error creating airlines:", error);
    res.status(500).json({
      success: false,
      message: "Error creating airlines",
      error: error.message,
    });
  }
};

const createAirportByCirium = async (req, res) => {
  try {
    const airportDataByCirium = await axios.get(
      "https://api.flightstats.com/flex/airports/rest/v1/json/active",
      {
        params: {
          appId: process.env.CIRIUM_APP_ID,
          appKey: process.env.CIRIUM_APP_KEY,
        },
      }
    );

    const promises = airportDataByCirium.data.airports.map(async (airport) => {
      if (!airport.iata) return;

      const existingAirport = await AirlineAirport.findOne({
        name: airport.name,
      });

      if (!existingAirport) {
        const newAirport = new AirlineAirport({
          name: airport.name,
          isAirline: false,
          iataCode: airport.iata,
          city: airport.city,
          perksBio:
            "Enjoy great perks like free meals, lounge access, and miles on every flight. Travel better with us!",
          trendingBio:
            "Fly smarter! Get first-class upgrades, free Wi-Fi, and compensation for delays. Join the trend today!",
          descriptionBio:
            "Welcome aboard! We focus on your comfort and safety with friendly service and modern planes. Let’s make your journey memorable!",
          countryCode: airport.countryCode,
        });
        return await newAirport.save();
      }
    });

    await Promise.all(promises);

    res.status(200).json({
      success: true,
      message: "Airlines created successfully",
    });
  } catch (error) {
    console.error("Error creating airlines:", error);
    res.status(500).json({
      success: false,
      message: "Error creating airlines",
      error: error.message,
    });
  }
};

//

const getFilteredAirlineLists = async (req, res) => {
  try {
    const { airType, flyerClass, searchQuery, page = 1 } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    let query = {};
    let sort = { overall: -1 };

    // If searchQuery exists, search by name based on airType
    if (searchQuery && searchQuery !== "") {
      query = {
        name: { $regex: searchQuery, $options: "i" },
      };
    } else {
      // Original filtering logic when no search query exists
      if (airType && airType.toLowerCase() !== "all") {
        query.isAirline = airType.toLowerCase() === "airline";
      }

      // Apply class-specific sorting
      if (flyerClass && flyerClass !== "All") {
        switch (flyerClass) {
          case "Business":
            sort = { businessClass: -1 };
            break;
          case "Premium Economy":
            sort = { pey: -1 };
            break;
          case "Economy":
            sort = { economyClass: -1 };
            break;
        }
      }
    }

    const airlineAirports = await AirlineAirport.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const totalCount = await AirlineAirport.countDocuments(query);
    const hasMore = totalCount > skip + limit;

    res.status(200).json({
      success: true,
      data: airlineAirports,
      hasMore,
      currentPage: parseInt(page),
      message: "Airline and airport lists retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching airline and airport lists:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching airline and airport lists",
      error: error.message,
    });
  }
};

const getFilteredFeedLists = async (req, res) => {
  try {
    const { airType, flyerClass, page = 1, searchQuery = "" } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    let results = [];
    let query = {};
    let totalCount = 0;

    // If searchQuery exists, create a search query and ignore other filters
    if (searchQuery && searchQuery.trim() !== "") {
      if (airType.toLowerCase() === "airline") {
        results = await AirlineReview.find()
          .populate({
            path: "airline",
            match: { name: { $regex: searchQuery, $options: "i" } },
            select: "name countryCode _id businessClass pey economyClass",
            model: AirlineAirport,
          })
          .populate({
            path: "reviewer",
            select: "name profilePhoto _id",
            model: UserInfo,
          })
          .populate({
            path: "from",
            select: "name _id city",
            model: AirlineAirport,
          })
          .populate({
            path: "to",
            select: "name _id city",
            model: AirlineAirport,
          })
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit);

        // Filter out reviews where airline is null (due to match condition)
        results = results.filter((review) => review.airline !== null);
        totalCount = await AirlineReview.find()
          .populate({
            path: "airline",
            match: { name: { $regex: searchQuery, $options: "i" } },
            model: AirlineAirport,
          })
          .then(docs => docs.filter(doc => doc.airline !== null).length);
      } else if (airType.toLowerCase() === "airport") {
        results = await AirportReview.find()
          .populate({
            path: "airport",
            match: { name: { $regex: searchQuery, $options: "i" } },
            select: "name _id",
            model: AirlineAirport,
          })
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
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit);

        // Filter out reviews where airport is null (due to match condition)
        results = results.filter((review) => review.airport !== null);
        totalCount = await AirportReview.find()
          .populate({
            path: "airport",
            match: { name: { $regex: searchQuery, $options: "i" } },
            model: AirlineAirport,
          })
          .then(docs => docs.filter(doc => doc.airport !== null).length);
      }
    } else {
      // Original filtering logic when no search query exists
      if (airType.toLowerCase() === "airline") {
        query = flyerClass !== "All" ? { classTravel: flyerClass } : {};
        results = await AirlineReview.find(query)
          .populate({
            path: "reviewer",
            select: "name profilePhoto _id",
            model: UserInfo,
          })
          .populate({
            path: "airline",
            select: "name countryCode _id businessClass pey economyClass",
            model: AirlineAirport,
          })
          .populate({
            path: "from",
            select: "name _id city",
            model: AirlineAirport,
          })
          .populate({
            path: "to",
            select: "name _id city",
            model: AirlineAirport,
          })
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit);
        
        totalCount = await AirlineReview.countDocuments(query);
      } else if (airType.toLowerCase() === "airport") {
        query = flyerClass !== "All" ? { classTravel: flyerClass } : {};
        results = await AirportReview.find(query)
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
            path: "airport",
            select: "name _id",
            model: AirlineAirport,
          })
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit);
        
        totalCount = await AirportReview.countDocuments(query);
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      hasMore: totalCount > skip + limit,
      currentPage: parseInt(page),
      message: "Review feeds retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching review feeds: ", error);
    res.status(500).json({
      success: false,
      message: "Error fetching review feeds",
      error: error.message,
    });
  }
};
const getCategoryRatings = async (req, res) => {
  try {
    const { id, type } = req.query;

    if (type === "airline") {
      const airlineScores = await AirlineScore.findOne({ airlineId: id });

      if (!airlineScores) {
        return res.status(200).json({
          success: true,
          data: {
            departureArrival: 0,
            comfort: 0,
            cleanliness: 0,
            onboardService: 0,
            foodBeverage: 0,
            entertainmentWifi: 0,
            count: 0,
          },
        });
      }

      res.status(200).json({
        success: true,
        data: airlineScores,
      });
    } else if (type === "airport") {
      const airportScores = await AirportScore.findOne({ airportId: id });

      if (!airportScores) {
        return res.status(200).json({
          success: true,
          data: {
            accessibility: 0,
            waitTimes: 0,
            helpfulness: 0,
            ambienceComfort: 0,
            foodBeverage: 0,
            amenities: 0,
            count: 0,
          },
        });
      }

      res.status(200).json({
        success: true,
        data: airportScores,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error fetching category ratings",
      error: error.message,
    });
  }
};

const getTopReviews = async (req, res) => {
  try {
    const limit = 5;

    // Get top reviews from both collections
    const [airlineReviews, airportReviews] = await Promise.all([
      AirlineReview.find()
        .populate({
          path: "reviewer",
          select: "name profilePhoto _id",
          model: UserInfo,
        })
        .populate({
          path: "airline",
          select: "name countryCode _id logoImage",
          model: AirlineAirport,
        })
        .populate({
          path: "from",
          select: "name _id city",
          model: AirlineAirport,
        })
        .populate({
          path: "to",
          select: "name _id city",
          model: AirlineAirport,
        })
        .sort({ score: -1 }),
      AirportReview.find()
        .populate({
          path: "reviewer",
          select: "name profilePhoto _id",
          model: UserInfo,
        })
        .populate({
          path: "airline",
          select: "name _id logoImage",
          model: AirlineAirport,
        })
        .populate({
          path: "airport",
          select: "name _id logoImage",
          model: AirlineAirport,
        })
        .sort({ score: -1 }),
    ]);

    // Combine and sort all reviews by score
    const allReviews = [...airlineReviews, ...airportReviews]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    res.status(200).json({
      success: true,
      data: allReviews,
      message: "Top reviews retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching top reviews",
      error: error.message,
    });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.query;

    const [airlineReviews, airportReviews] = await Promise.all([
      AirlineReview.find({ reviewer: userId })
        .populate({
          path: "reviewer",
          select: "name profilePhoto _id",
          model: UserInfo,
        })
        .populate({
          path: "airline",
          select: "name countryCode _id logoImage",
          model: AirlineAirport,
        })
        .populate({
          path: "from",
          select: "name _id city",
          model: AirlineAirport,
        })
        .populate({
          path: "to",
          select: "name _id city",
          model: AirlineAirport,
        })
        .sort({ date: -1 }),

      AirportReview.find({ reviewer: userId })
        .populate({
          path: "reviewer",
          select: "name profilePhoto _id",
          model: UserInfo,
        })
        .populate({
          path: "airline",
          select: "name _id logoImage",
          model: AirlineAirport,
        })
        .populate({
          path: "airport",
          select: "name _id logoImage",
          model: AirlineAirport,
        })
        .sort({ date: -1 }),
    ]);

    const allUserReviews = [...airlineReviews, ...airportReviews].sort(
      (a, b) => b.date - a.date
    );

    res.status(200).json({
      success: true,
      data: allUserReviews,
      message: "User reviews retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user reviews",
      error: error.message,
    });
  }
};

const deleteAirlineAirport = async (req, res) => {
  try {
    const { id, isAirline } = req.body;

    // Delete the review based on isAirline flag
    let deletedReview;
    if (isAirline) {
      deletedReview = await AirlineReview.findByIdAndDelete(id);
    } else {
      deletedReview = await AirportReview.findByIdAndDelete(id);
    }

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: deletedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};
module.exports = {
  createAirlineAirport,
  getAirlineAirport,
  updateAirlineAirport,
  initializeClassCounts,
  getAirlineAirportLists,
  createAirlineByCirium,
  createAirportByCirium,
  updateScoreHistory,
  getFilteredAirlineLists,
  getFilteredFeedLists,
  getCategoryRatings,
  getTopReviews,
  getUserReviews,
  deleteAirlineAirport,
};
