const UserInfo = require("../models/userInfo");

const createUserInfo = async (req, res) => {
  const { name, whatsappNumber, email } = req.body;

  if (!email && !whatsappNumber) {
    return res.status(400).json({
      success: false,
      message: "Either email or WhatsApp number is required",
    });
  }

  try {
    // Check if user already exists
    let existingUser;
    if (email) {
      existingUser = await UserInfo.findOne({ email: email });
    } else if (whatsappNumber) {
      existingUser = await UserInfo.findOne({
        whatsappNumber: whatsappNumber,
      });
    }

    if (existingUser) {
      return res.json({ name: existingUser.name, userState: 1 });
    }

    // Create new user if doesn't exist
    const newUser = new UserInfo({
      name,
      email,
      whatsappNumber,
    });

    console.log(newUser);

    await newUser.save();
    res.json({ name: newUser.name, userState: 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { createUserInfo };
