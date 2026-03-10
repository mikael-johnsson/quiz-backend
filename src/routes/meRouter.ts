import express from "express";
import { verifyToken } from "../controllers/meController";

export const meRouter = express.Router();

meRouter.get("/", (req, res) => {
  try {
    const cookie = req.cookies["auth_quiz"];
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
