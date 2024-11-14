const UserInfo = require("../models/userInfoSchema");

const createUserInfo = async (req, res) => {
  let { name, whatsappNumber, email } = req.body;
  let existingUser = null;

  if (!email && !whatsappNumber) {
    return res.status(400).json({
      success: false,
      message: "Either email or WhatsApp number is required",
    });
  }

  try {
    // Check if user already exists
    if (email) {
      existingUser = await UserInfo.findOne({ email: email });
    } else if (whatsappNumber) {
      existingUser = await UserInfo.findOne({
        whatsappNumber: whatsappNumber,
      });
    }

    if (existingUser) {
      return res.json({ existingUser, userState: 1 });
    }

    console.log("Creating new user", req.body);
    // Create new user if doesn't exist
    let newUser = new UserInfo({
      name: name,
      email: email,
      whatsappNumber: whatsappNumber,
    });
    await newUser.save();

    res.json({ name: newUser.name, userState: 0 });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Middleware function to get a single user info
const getUserInfo = async (req, res) => {
  let userInfo;
  try {
    userInfo = await UserInfo.findById(req.params.id);
    if (userInfo == null) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.json(userInfo);
};

module.exports = { createUserInfo, getUserInfo };
