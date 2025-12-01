import express, { Request, Response } from "express";
import { landingPageController } from "../controllers/landingPageController";

export const landingPageRouter = express.Router();

landingPageRouter.get("/", landingPageController);
