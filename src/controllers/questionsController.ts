import { Request, Response } from "express";
import { data } from "../../data";
import { Query, Question, SearchResult } from "../types";
import mainFilter from "../utils/questionFilter";
import { getClient, getQuestionsFromDatabase } from "../database/quiz_database";
import dotenv from "dotenv";

dotenv.config();
const uri: string | undefined = process.env.MONGODB_URI;

// const questions: Question[] = data.questions || [];

export const getQuestions = async (req: Request, res: Response) => {
  const questions = await getQuestionsFromDatabase(uri);
  if (!questions) return;

  const filteredQuestions: Question[] = mainFilter(
    questions,
    req.query as Query,
  );
  if (filteredQuestions.length !== 0) {
    let searchResult: SearchResult = {
      totalResults: filteredQuestions.length,
      questions: filteredQuestions,
      statusCode: 200,
    };

    res.status(200).json(searchResult);
  } else {
    console.log("404");
    res.status(404).send("Didn't find any questions that match those filters");
  }

  // let searchResult: SearchResult = {
  //   totalResults: questions.length,
  //   questions: questions,
  //   statusCode: 200,
  // };
  // res.json(searchResult);
  // const thisQuery = req.query;
  // console.log(thisQuery);
};

export const getQuestionById = async (req: Request, res: Response) => {
  const questions = await getQuestionsFromDatabase(uri);
  if (!questions) return;
  const id = parseInt((req.params as any).id);
  const question = questions.find((q) => q.id === id);
  if (!question)
    return res
      .status(404)
      .send("Didn't find question, your searched for questions by id");
  res.send(question);
};
