/// Create the Airline and Airport api
/// Check if the airline/airport already exists
const axios = require("axios");
const AirlineAirport = require("../models/airlinePortListsSchema");

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
    const airlineAirports = await AirlineAirport.find().sort({ overall: -1 });

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
    console.log("---------------------------");
    
    const { id, score } = req.body;

    const updatedAirlineAirport = await AirlineAirport.findByIdAndUpdate(
      id,
      {
        $push: { scoreHistory: score }
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
module.exports = {
  createAirlineAirport,
  getAirlineAirport,
  updateAirlineAirport,
  initializeClassCounts,
  getAirlineAirportLists,
  createAirlineByCirium,
  createAirportByCirium,
  updateScoreHistory,
};
