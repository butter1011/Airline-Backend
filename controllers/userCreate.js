const UserInfo = require("../models/userInfo");

const createUserInfo = async (req, res) => {
  try {
    const { firstName, lastName, email, whatsappNumber } = req.body;

    if (!email && !whatsappNumber) {
      return res.status(400).json({
        success: false,
        message: "Either email or WhatsApp number is required",
      });
    }

    const newUserInfo = new UserInfo({
      firstName,
      lastName,
      email,
      whatsappNumber,
    });

    const savedUserInfo = await newUserInfo.save();

    res.status(201).json({
      success: true,
      data: savedUserInfo,
      message: "User information created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating user information",
      error: error.message,
    });
  }
};

module.exports = { createUserInfo };
