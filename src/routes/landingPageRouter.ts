import express from "express";
import { landingPageController } from "../controllers/landingPageController";
import connectDB from "../app";

const landingPageRouter = express.Router();

landingPageRouter.get("/", async (req, res) => {
  await connectDB();
  const page = landingPageController(res);
  res.status(200).send(page);
});

export default landingPageRouter;
