import { Request, Response } from "express";
import { questions } from "../app";
import { Question, SearchResult } from "../types";
import mainFilter from "../utils/questionFilter";
import { log } from "console";

export const questionsController = (req: Request, res: Response) => {
  console.log("Start controller");

  const filteredQuestions: Question[] = mainFilter(questions, req.query as any);
  if (filteredQuestions.length !== 0) {
    let searchResult: SearchResult = {
      totalResults: filteredQuestions.length,
      questions: filteredQuestions,
      statusCode: 200,
    };
    console.log("Returning data");

    res.status(200).json(searchResult);
  } else {
    console.log("404");
    res.status(404).send("Didn't find any questions that match those filters");
  }
};
