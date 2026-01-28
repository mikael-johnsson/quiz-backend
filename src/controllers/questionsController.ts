import { Request, Response } from "express";
import { Question, SearchResult } from "../models/types";
import { getClient } from "../database/quiz_database";
import dotenv from "dotenv";
import { buildFilter } from "../utils/buildQueryFilter";

dotenv.config();
const uri: string | undefined = process.env.MONGODB_URI;

/**
 * connect to the database
 * build a filter based on the request queries
 * get the questions based on filter
 * return questions
 * @param req the users request
 * @param res the response sent back,
 * @returns null
 */
export const getQuestions = async (req: Request, res: Response) => {
  if (!uri) return;
  const client = getClient(uri);
  const db = client.db("quiz");
  const collection = db.collection("questions");

  const { themes, difficulties } = req.query;
  let isApproved = req.query.isApproved as any;

  const filter = await buildFilter(
    isApproved,
    themes as string | string[],
    difficulties as string | string[],
  );

  let questions: Question[] = await collection.find(filter).toArray();

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
  const question: Question = await collection
    .find({ id: JSON.parse(req.params.id) })
    .toArray();

  if (!question) {
    res
      .status(404)
      .send("Didn't find question, your searched for questions by id");
  } else {
    console.log("question is:", question);
    res.status(200).json(question);
  }
};
