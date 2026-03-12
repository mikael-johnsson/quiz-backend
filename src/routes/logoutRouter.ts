import express from "express";
import { connectDB } from "../app";

export const logoutRouter = express.Router();

logoutRouter.post("/", async (req, res) => {
  await connectDB();

  res.clearCookie("auth_quiz").json({ message: "Logout successful" });
});

export default logoutRouter;
