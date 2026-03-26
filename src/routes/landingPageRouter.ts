import express from "express";
import { landingPageController } from "../controllers/landingPageController";
import { connectDB } from "../app";

const landingPageRouter = express.Router();

landingPageRouter.get("/", async (_, res) => {
  await connectDB();

  const page = landingPageController();
  res.status(200).send(page);
});

export default landingPageRouter;
