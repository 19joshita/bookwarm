import express from "express";
import User from "./../models/User.js";
import jwt from "jsonwebtoken";
const router = express.Router();
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All Fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be atleast 6 character." });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username should be at least 3 character." });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email Already exists." });
    }
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already exists." });
    }
    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
    const user = new User({
      username,
      email,
      password,
      profileImage,
    });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("error in register route", error);
    res.status(500).json({ message: "Error during the register route." });
  }
});

router.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const user = User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Crediancial" });
    const isPasswordCorrect = await user.comparePassword(password);
    if (isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credential" });
    const token = generateToken(user?._id);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImageß,
      },
    });
  } catch (error) {
    console.log("error in login route", error);
    res.status(500).json({ message: "Error during the login route." });
  }
});

export default router;
