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

// Export Controllers
export { createUser };
