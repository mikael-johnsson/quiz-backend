import express from "express";
import {
  deleteQuestion,
  getQuestionById,
  getQuestions,
  postQuestion,
  replaceQuestion,
} from "../controllers/questionsController";

const questionsRouter = express.Router();

questionsRouter.get("/", getQuestions);
questionsRouter.get("/:id", getQuestionById);
questionsRouter.post("/", postQuestion);
questionsRouter.delete("/:id", deleteQuestion);
questionsRouter.put("/:id", replaceQuestion);

export default questionsRouter;
