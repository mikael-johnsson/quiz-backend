import { Request, Response } from "express";
import { Question, SearchResult } from "../models/types";
import { getClient } from "../database/quiz_database";
import dotenv from "dotenv";
import { buildQueryFilter } from "../utils/buildQueryFilter";

dotenv.config();

// URI to the MongoDB database
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

  let questions: Question[] = await collection.find(filter).toArray();

  if (questions.length !== 0) {
    let searchResult: SearchResult = {
      totalResults: questions.length,
      questions: questions,
      statusCode: 200,
    };

    res.status(200).json(searchResult);
  } else {
    res.status(404).send("Didn't find any questions that match those filters");
  }
};

/**
 * Returns a question to the user based on id from request params
 * @param req the users request
 * @param res the response sent back
 * @returns null
 */
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

/**
 * Posts a question to the database
 * @param req the users request (containing the question property in the body)
 * @param res the response sent back (error obj or response obj from MongoDB)
 * @returns
 */
export const postQuestion = async (req: Request, res: Response) => {
  try {
    const date = new Date();

    const { question, answer, questionType, themes, difficulty, createdBy } =
      req.body;
    const newQuestion: Question = {
      id: Date.now(),
      question: question,
      answer: answer,
      questionType: questionType,
      themes: themes,
      difficulty: difficulty,
      createdBy: createdBy,
      createdWhen: date.toString(),
      isApproved: false,
    };
    if (!uri) return;
    const client = getClient(uri);
    const db = client.db("quiz");
    const collection = db.collection("questions");
    const response = await collection.insertOne(newQuestion);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

/**
 * Deletes question from database based on id in request params
 * @param req the users request
 * @param res the reponse sent back (error obj or response obj from MongoDB)
 * @returns null
 */
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    if (!uri) return;
    const { id } = req.params;
    const client = getClient(uri);
    const db = client.db("quiz");
    const collection = db.collection("questions");
    const response = await collection.deleteOne({ id: id });
    res.status(203).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

//Något här funkar inte
export const replaceQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    if (+id !== question.id) {
      res.status(400).send("Parameter Id and Body Id does not match");
    }

    if (!uri) return;
    const client = getClient(uri);
    const db = client.db("quiz");
    const collection = db.collection("questions");
    const response = await collection.replaceOne({ id: +id }, question);

    if (response.ok) {
      res.status(200).json(response);
    } else {
      res.status(400).json(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
