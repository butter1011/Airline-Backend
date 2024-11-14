const AirlineReview = require("../models/airlineReviewsSchema");

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

    res.status(200).json(reviews);
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
};
