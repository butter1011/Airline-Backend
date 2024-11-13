const AirportReview = require("../models/airportReviewsSchema");

const createAirportReview = async (req, res) => {
  try {
    const {
      reviewer,
      from,
      to,
      airport,
      accessibility,
      wait_times,
      helpfulness,
      ambience_comfort,
      food_beverage,
      amenities,
      comment,
    } = req.body;

    const newAirportReview = new AirportReview({
      reviewer,
      from,
      to,
      airport,
      accessibility,
      wait_times,
      helpfulness,
      ambience_comfort,
      food_beverage,
      amenities,
      comment,
    });

    const savedReview = await newAirportReview.save();

    res.status(201).json({
      message: "Airport review created successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error creating airport review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.getAirportReviews = async (req, res) => {
//   try {
//     const reviews = await AirportReview.find()
//       .populate("reviewer", "username")
//       .populate("airport", "name");

//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error("Error fetching airport reviews:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.getAirportReviewById = async (req, res) => {
//   try {
//     const review = await AirportReview.findById(req.params.id)
//       .populate("reviewer", "username")
//       .populate("airport", "name");

//     if (!review) {
//       return res.status(404).json({ message: "Airport review not found" });
//     }

//     res.status(200).json(review);
//   } catch (error) {
//     console.error("Error fetching airport review:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.updateAirportReview = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const updatedReview = await AirportReview.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updatedReview) {
//       return res.status(404).json({ message: "Airport review not found" });
//     }

//     res.status(200).json({
//       message: "Airport review updated successfully",
//       review: updatedReview,
//     });
//   } catch (error) {
//     console.error("Error updating airport review:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.deleteAirportReview = async (req, res) => {
//   try {
//     const deletedReview = await AirportReview.findByIdAndDelete(req.params.id);

//     if (!deletedReview) {
//       return res.status(404).json({ message: "Airport review not found" });
//     }

//     res.status(200).json({
//       message: "Airport review deleted successfully",
//       review: deletedReview,
//     });
//   } catch (error) {
//     console.error("Error deleting airport review:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
module.exports = { createAirportReview };
