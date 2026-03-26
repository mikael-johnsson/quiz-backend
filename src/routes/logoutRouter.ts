import express from "express";
import { connectDB } from "../app";

export const logoutRouter = express.Router();

logoutRouter.post("/", async (_, res) => {
  await connectDB();

  res.clearCookie("quiz_login").json({ message: "Logout successful" });
});

export default logoutRouter;
