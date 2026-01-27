import express from "express";
import { landingPageController } from "../controllers/landingPageController";

const landingPageRouter = express.Router();

landingPageRouter.get("/", landingPageController);

export default landingPageRouter;
