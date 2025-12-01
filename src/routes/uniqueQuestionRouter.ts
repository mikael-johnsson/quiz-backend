import express, { Request, Response } from "express";
import { questions } from "../app";

export const uniqueQuestionRouter = express.Router();

uniqueQuestionRouter.get(
  "/api/questions/:id",
  (req: Request, res: Response) => {
    const id = parseInt((req.params as any).id);
    const question = questions.find((q) => q.id === id);
    if (!question)
      return res
        .status(404)
        .send("Didn't find question, your searched for questions by id");
    res.send(question);
  }
);
