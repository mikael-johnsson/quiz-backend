import express from "express";
import {
  getQuestionById,
  getQuestions,
} from "../controllers/questionsController";

const questionsRouter = express.Router();

questionsRouter.get("/", getQuestions);
questionsRouter.get("/:id", getQuestionById);

export default questionsRouter;
