import { Request, Response } from "express";
import { Query, Question, SearchResult } from "../types";
import { getClient } from "../database/quiz_database";
import dotenv from "dotenv";

dotenv.config();
const uri: string | undefined = process.env.MONGODB_URI;

export const getQuestions = async (req: Request, res: Response) => {
  if (!uri) return;
  const client = getClient(uri);
  const db = client.db("quiz");
  const collection = db.collection("questions");
  const query: Query = req.query;

  const filter = await buildFilter(query);
  let questions: Question[] = await collection.find(filter).toArray();

  console.log("QUESTIONS:", questions);

  if (questions.length !== 0) {
    let searchResult: SearchResult = {
      totalResults: questions.length,
      questions: questions,
      statusCode: 200,
    };

    res.status(200).json(searchResult);
  } else {
    console.log("404");
    res.status(404).send("Didn't find any questions that match those filters");
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  if (!uri) return;
  const client = getClient(uri);
  const db = client.db("quiz");
  const collection = db.collection("questions");
  const questions: Question[] = await collection.find({}).toArray();

  if (!questions) return;
  const id = parseInt((req.params as any).id);
  const question = questions.find((q) => q.id === id);
  if (!question)
    return res
      .status(404)
      .send("Didn't find question, your searched for questions by id");
  res.send(question);
};

// type Filter = {
//   themes?: string | string[] | {};
//   difficulty?: string | string[] | {};
//   isApproved?: boolean;
// };
const buildFilter = (query: Query) => {
  let filter: any = {};

  if (query.themes !== null && query.themes !== undefined) {
    if (Array.isArray(query.themes)) {
      filter.themes = { $in: query.themes };
    } else {
      filter.themes = query.themes;
    }
  }

  if (query.difficulties !== null && query.difficulties !== undefined) {
    if (Array.isArray(query.difficulties)) {
      filter.difficulty = { $in: query.difficulties };
    } else {
      filter.difficulty = query.difficulties;
    }
  }

  if (query.isApproved !== null && query.isApproved !== undefined) {
    if (typeof query.isApproved === "string") {
      filter.isApproved = query.isApproved === "true";
    } else {
      filter.isApproved = query.isApproved;
    }
  }
  return filter;
};
