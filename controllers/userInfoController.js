const UserInfo = require("../models/userInfoSchema");
require("dotenv").config();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
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

const uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const file = req.file;
    const key = req.body.key;
    const url = await uploadFileToS3(file.buffer, key);
    res.json({ success: true, url });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ success: false, error: "File upload failed" });
  }
};

const uploadFileToS3 = (fileBuffer, fileName) => {
  const key = `${fileName}`;

  const uploadParams = {
    Bucket: "airlinereview",
    Key: key,
    Body: fileBuffer,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.log("Error", err);
        reject(err);
      }
      if (data) {
        console.log("Uploaded in", data.Location);
        resolve(data.Location);
      }
    });
  });
};

module.exports = {
  createUserInfo,
  editUserInfo,
  badgeEditUserInfo,
  uploadAvatar,
};
