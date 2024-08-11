// packages
import path from "path";
import e from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// utils
import connectDB from "./config/db.js";
dotenv.config();
const app = e();
const port = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => res.send("Succesfully connected to the Homepage"));

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () => console.log(`Listening on port ${port}`));
