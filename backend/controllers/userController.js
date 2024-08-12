// Utils
import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import brcypt from "bcryptjs";
import createToken from "../utils/createToken.js";

// Controllers
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill in all the inputs");
  }

  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).send("User already exists");

  //   password security
  const salt = await brcypt.genSalt();
  const hashedPassword = await brcypt.hash(password, salt);

  //   Creating new user
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      isAdmin: newUser.admin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid userdata");
  }
});

// Authentication - Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!email || !password) {
    throw new Error("Please fill in all the inputs");
  }

  if (existingUser) {
    // Compare user password with user in DB password
    const isPasswordValid = await brcypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordValid) {
      // Set cookie into the header
      createToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        password: existingUser.password,
        isAdmin: existingUser.admin,
      });
      // Exit the function after sending the response
      return;
    } else {
      throw new Error("Incorrect user credentials entered");
    }
  }
});

// Authentication - Logout
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out succesfully" });
});

// Export Controllers
export { createUser, loginUser, logoutUser };
