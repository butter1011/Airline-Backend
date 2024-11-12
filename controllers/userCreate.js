const UserInfo = require("../models/userInfo");

const createUserInfo = async (req, res) => {
  const { name, whatsappNumber, email } = {
    name: req.body.name,
    whatsappNumber: req.body.whatsappNumber,
    email: req.body.email,
  };

  if (!email && !whatsappNumber) {
    return res.status(400).json({
      success: false,
      message: "Either email or WhatsApp number is required",
    });
  }

  try {
    // Check if user already exists
    let userInfo = await UserInfo.findOne({
      $or: [{ email }, { whatsappNumber }],
    });

    if (!userInfo) {
      // Create new user if doesn't exist
      userInfo = new UserInfo({
        name,
        email,
        whatsappNumber,
      });

      await userInfo.save();
      res.json({ name: userInfo.name, userState: 0 });
    } else {
      res.json({ name: userInfo.name, userState: 1 });
    }
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};
module.exports = { createUserInfo };
