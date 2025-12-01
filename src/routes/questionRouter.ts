import express, { Request, Response } from "express";
import { Question, SearchResult } from "../types";
import mainFilter from "../utils/questionFilter";
import { questions } from "../app";

export const questionRouter = express.Router();

questionRouter.get("/", (req: Request, res: Response) => {
  const filteredQuestions: Question[] = mainFilter(questions, req.query as any);
  if (filteredQuestions.length !== 0) {
    let searchResult: SearchResult = {
      totalResults: filteredQuestions.length,
      questions: filteredQuestions,
      statusCode: 200,
    };
    res.status(200).json(searchResult);
  } else {
    res.status(404).send("Didn't find any questions that match those filters");
  }
});
