import express from "express";
import { verifyToken } from "../utils/verifyToken";
import { connectDB } from "../app";

export const meRouter = express.Router();

meRouter.get("/", async (req, res) => {
  try {
    await connectDB();
    const cookie = req.cookies["quiz_login"];
    if (cookie) {
      const payload = verifyToken(cookie);
      res.status(200).json({ message: "Authenticated", payload });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
});
