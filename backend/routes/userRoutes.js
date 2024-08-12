// Packages
import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";

// variables
const router = express.Router();

// Routes
router.route("/").post(createUser); // Create User [Post]
router.post("/auth", loginUser);
router.post("/logout", logoutUser);

// Export router
export default router;
