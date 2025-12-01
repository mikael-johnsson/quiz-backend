import { Request, Response } from "express";
import { questions } from "../app";
import { Question, SearchResult } from "../types";
import mainFilter from "../utils/questionFilter";

export const getQuestions = (req: Request, res: Response) => {
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

export const getQuestionById = (req: Request, res: Response) => {
  const id = parseInt((req.params as any).id);
  const question = questions.find((q) => q.id === id);
  if (!question)
    return res
      .status(404)
      .send("Didn't find question, your searched for questions by id");
  res.send(question);
};
