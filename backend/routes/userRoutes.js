// Packages
import express from "express";
import { createUser } from "../controllers/userController.js";

// variables
const router = express.Router();

// Routes
router.route("/").post(createUser); // Create User [Post]

// Export router
export default router;
