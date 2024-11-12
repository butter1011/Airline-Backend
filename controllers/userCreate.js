const UserInfo = require("../models/userInfo");

const createUserInfo = async (req, res) => {
  const { name, whatsappNumber, email } = {
    name: req.body.name,
    whatsappNumber: req.body.whatsappNumber,
    email: req.body.email,
  };

  if (!email && !whatsappNumber) {
    printf("🌹🌹🌹Welcome! new User entered in our HomePage! ");
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
      console.log("Welcome! new User entered in our HomePage! ", userInfo.name);
    } else {
      res.json({ name: userInfo.name, userState: 1 });
      console.log("👌👌👌Successfully Logged in!", userInfo.name);
    }
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};
module.exports = { createUserInfo };
