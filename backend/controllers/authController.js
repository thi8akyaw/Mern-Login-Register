import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Register Controller
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    // Check user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create user (Password hashing is handled by User.js)
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Response
    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get User Profile
export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};