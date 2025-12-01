import express, { Request, Response } from "express";
import { questions } from "../app";

export const uniqueQuestionRouter = express.Router();

uniqueQuestionRouter.get("/api/questions/:id", uniqueQuestionRouter);
