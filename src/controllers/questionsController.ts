import { Request, Response } from "express";
import { Question, SearchResult } from "../models/types";
import { getClient } from "../database/quiz_database";
import dotenv from "dotenv";
import { buildQueryFilter } from "../utils/buildQueryFilter";

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

  const { themes, difficulties, createdBy } = req.query;
  let isApproved = req.query.isApproved as any;

  const filter = await buildQueryFilter(
    isApproved,
    themes as string | string[],
    difficulties as string | string[],
    createdBy as string,
  );

  // let questions: Question[] = await collection.find(filter).toArray();
  let questions: Question[] = await collection
    .find({ createdBy: "Cornelia" })
    .toArray();

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
    res.status(200).json(question);
  }
};
