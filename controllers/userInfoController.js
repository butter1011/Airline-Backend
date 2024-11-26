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
      return res.json({ userData: existingUser, userState: 1 });
    }

    // Create new user if doesn't exist
    let newUser = new UserInfo({
      name: name,
      email: email,
      whatsappNumber: whatsappNumber,
    });
    await newUser.save();

    res.json({ userData: newUser, userState: 0 });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

///
/// Edit user
const editUserInfo = async (req, res) => {
  let { name, bio, _id } = req.body;
  let editingUser = null;

  try {
    // Check if user already exists
    editingUser = await UserInfo.findOne({ _id: _id });
    // Create new user if doesn't exist
    editingUser.name = name;
    editingUser.bio = bio;

    await editingUser.save();
    res.json({ userData: editingUser, userState: 1 });
  } catch (error) {
    console.error("Error editingUser:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

///
/// BadgeEdit user
const badgeEditUserInfo = async (req, res) => {
  let { selectedbadges, _id } = req.body;
  let badgeEditingUser = null;
  try {
    // Check if user already exists
    badgeEditingUser = await UserInfo.findOne({ _id: _id });
    // Create new user if doesn't exist
    badgeEditingUser.selectedbadges = selectedbadges;

    await badgeEditingUser.save();
    res.json({ userData: badgeEditingUser, userState: 1 });
  } catch (error) {
    console.error("Error editingUser:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = {
  createUserInfo,
  getUserInfo,
  editUserInfo,
  badgeEditUserInfo,
};
