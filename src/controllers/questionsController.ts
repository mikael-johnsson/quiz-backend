import { Question, QuestionModel } from "../models/types";
// import { getClient } from "../database/quiz_database";
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
 * @returns an array with questions from database or empty array
 */
export const getQuestions = async (
  isApproved: string | undefined,
  themes: string[] | undefined,
  difficulties: string[] | undefined,
  createdBy: string | undefined,
) => {
  try {
    if (!uri) return { status: 500, message: "Could not find URI to database" };
    // const client = getClient(uri);
    // const db = client.db("quiz");
    // const collection = db.collection("questions");

    const filter = await buildQueryFilter(
      isApproved,
      themes as string | string[],
      difficulties as string | string[],
      createdBy as string,
    );

    let questions: Question[] = await QuestionModel.find(filter);

    return questions;
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Error when getting questions",
      error: error,
    };
  }
};

/**
 * Returns a question to the user based on id from request params
 * @param req the users request
 * @param res the response sent back
 * @returns null
 */
export const getQuestionById = async (id: string) => {
  try {
    if (!uri) return { status: 500, message: "Could not find database URL" };
    // const client = getClient(uri);
    // const db = client.db("quiz");
    // const collection = db.collection("questions");
    const question: Question[] = await QuestionModel.find({
      id: JSON.parse(id),
    });
    return question;
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Error when getting question",
      error: error,
    };
  }
};

/**
 * Posts a question to the database
 * @param req the users request (containing the question property in the body)
 * @param res the response sent back (error obj or response obj from MongoDB)
 * @returns
 */
export const postQuestion = async (
  question: string,
  answer: string,
  questionType: string,
  themes: string[],
  difficulty: string,
  createdBy: string,
) => {
  try {
    const date = new Date();

    const newQuestion: Question = {
      id: Date.now(),
      question: question,
      answer: answer,
      questionType: questionType,
      themes: themes,
      difficulty: difficulty,
      createdBy: createdBy,
      createdWhen: date.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      isApproved: false,
    };
    const noUndefinedProperties = Object.values(newQuestion).every(
      (val) => val !== undefined,
    );
    if (noUndefinedProperties) {
      if (!uri) return { status: 500, message: "No contact with database" };
      // const client = getClient(uri);
      // const db = client.db("quiz");
      // const collection = db.collection("questions");
      const response = await QuestionModel.insertOne(newQuestion);
      return {
        status: 203,
        message: "Question added to database.",
        response: response,
      };
    } else {
      return {
        status: 400,
        message: "Question did not contain all needed properties",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong",
      error: error,
    };
  }
};

/**
 * Deletes question from database based on id in request params
 * @param req the users request
 * @param res the reponse sent back (error obj or response obj from MongoDB)
 * @returns null
 */
export const deleteQuestion = async (id: string) => {
  try {
    if (!uri) return { status: 500, message: "Could not find database URL" };
    // const client = getClient(uri);
    // const db = client.db("quiz");
    // const collection = db.collection("questions");

    const response = await QuestionModel.deleteOne({ id: +id });

    if (response.deletedCount > 0)
      return { status: 204, message: "Question deleted", response: response };
    return { status: 500, message: "Could not delete that question" };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong",
      error: error,
    };
  }
};

/**
 *
 * @param req users request containing newQuestion
 * @param res response sent to user, MongoDBs response if status 200
 * @returns null
 */
export const replaceQuestion = async (id: string, question: Question) => {
  try {
    if (!uri) return { status: 500, message: "Could not find database URL" };
    // const client = getClient(uri);
    // const db = client.db("quiz");
    // const collection = db.collection("questions");

    const questionToUpdate = await QuestionModel.find({ id: +id });
    if (questionToUpdate) {
      const response = await QuestionModel.replaceOne({ id: +id }, question);
      return { status: 200, message: "Question replaced", response: response };
    } else {
      return {
        status: 404,
        message: "Couldn't find question with that id in database",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong",
      error: error,
    };
  }
};

// here create updateQuestion (only update certain properties)
// use updateOne()
