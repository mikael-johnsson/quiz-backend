import dotenv from "dotenv";
import { QuestionModel, QuizModel } from "../models/types";

dotenv.config();

const uri: string | undefined = process.env.MONGODB_URI;

/**
 * Create and persist a new Quiz document.
 * Validates the input ids, ensures the referenced questions exist,
 * and stores the quiz with initial `amountOfSaves`.
 *
 * @param questionIds - array of question `id` values (numbers)
 * @param createdBy - identifier for who created the quiz (email or user id)
 */
export const createQuiz = async (questionIds: number[], createdBy: string) => {
  try {
    // ensure DB URI is available
    if (!uri) return { status: 500, message: "Could not find URI to database" };

    // basic payload validation
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return {
        status: 400,
        message: "Quiz must contain at least one question id",
      };
    }

    if (typeof createdBy !== "string" || createdBy.trim() === "") {
      return { status: 400, message: "Quiz must contain createdBy" };
    }

    // remove duplicate ids to avoid redundant DB queries / storage
    const uniqueQuestionIds = [...new Set(questionIds)];

    // verify each question id exists in the questions collection
    const questionsInDatabase = await QuestionModel.find({
      id: { $in: uniqueQuestionIds },
    });

    if (questionsInDatabase.length !== uniqueQuestionIds.length) {
      // at least one id was not found — return client-friendly error
      return {
        status: 404,
        message: "One or more question ids could not be found",
      };
    }

    // create the quiz document; `amountOfSaves` starts at 1
    const quiz = await QuizModel.create({
      questions: uniqueQuestionIds,
      createdBy: createdBy.trim(),
      amountOfSaves: 1,
    });

    return {
      status: 201,
      message: "Quiz saved successfully",
      quiz,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong when creating quiz",
      error: error,
    };
  }
};

/**
 * Retrieve quizzes. When `populate` is true, replace stored question ids
 * with the full question documents fetched from the questions collection.
 *
 * @param createdBy - optional filter to only return quizzes created by this identifier
 * @param populate - when true, return full question objects instead of ids
 */
export const getQuizzes = async (
  createdBy?: string,
  populate: boolean = false,
) => {
  try {
    if (!uri) return { status: 500, message: "Could not find URI to database" };

    const filter = createdBy ? { createdBy } : {};
    const quizzes = await QuizModel.find(filter);

    if (!populate) return quizzes;

    // populate questions for each quiz and preserve the original id order
    const populatedQuizzes: any[] = [];
    for (const q of quizzes) {
      // fetch question docs for the ids present in this quiz
      const questionDocs = await QuestionModel.find({
        id: { $in: q.questions },
      });
      // map them by id for quick lookup
      const idMap = new Map<number, any>();
      questionDocs.forEach((d: any) => idMap.set(d.id, d));
      // reconstruct ordered array based on stored id order
      const ordered = q.questions
        .map((qid: number) => idMap.get(qid))
        .filter(Boolean);
      populatedQuizzes.push({ ...q.toObject(), questions: ordered });
    }

    return populatedQuizzes;
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong when getting quizzes",
      error: error,
    };
  }
};

/**
 * Return a single quiz by its MongoDB `_id`. When `populate` is true,
 * replace question ids with the full question documents.
 *
 * @param id - MongoDB `_id` of the quiz document
 * @param populate - when true, include full question objects
 */
export const getQuizById = async (id: string, populate: boolean = false) => {
  try {
    if (!uri) return { status: 500, message: "Could not find URI to database" };

    let quiz;
    try {
      quiz = await QuizModel.findById(id);
    } catch (castError: any) {
      // MongoDB throws CastError for invalid ObjectId format
      if (castError.name === "CastError") {
        return { status: 400, message: "Invalid quiz id format" };
      }
      throw castError;
    }

    if (!quiz) {
      return { status: 404, message: "Could not find quiz with that id" };
    }

    if (!populate) return quiz;

    // fetch and order question documents to match stored id order
    const questionDocs = await QuestionModel.find({
      id: { $in: quiz.questions },
    });
    const idMap = new Map<number, any>();
    questionDocs.forEach((d: any) => idMap.set(d.id, d));
    const ordered = quiz.questions
      .map((qid: number) => idMap.get(qid))
      .filter(Boolean);

    return { ...quiz.toObject(), questions: ordered };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong when getting quiz",
      error: error,
    };
  }
};

/**
 * Increment the `amountOfSaves` counter for a quiz.
 * This returns the updated quiz document on success.
 */
export const incrementQuizSaveCount = async (id: string) => {
  try {
    if (!uri) return { status: 500, message: "Could not find URI to database" };

    let quiz;
    try {
      quiz = await QuizModel.findById(id);
    } catch (castError: any) {
      // MongoDB throws CastError for invalid ObjectId format
      if (castError.name === "CastError") {
        return { status: 400, message: "Invalid quiz id format" };
      }
      throw castError;
    }

    if (!quiz) {
      return { status: 404, message: "Could not find quiz with that id" };
    }

    quiz.amountOfSaves += 1;
    const response = await quiz.save();

    return {
      status: 200,
      message: "Quiz save count incremented",
      quiz: response,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong when updating quiz",
      error: error,
    };
  }
};

/**
 * Decrement the `amountOfSaves` counter for a quiz.
 * Ensures the counter does not go below zero.
 */
export const decrementQuizSaveCount = async (id: string) => {
  try {
    if (!uri) return { status: 500, message: "Could not find URI to database" };

    let quiz;
    try {
      quiz = await QuizModel.findById(id);
    } catch (castError: any) {
      // MongoDB throws CastError for invalid ObjectId format
      if (castError.name === "CastError") {
        return { status: 400, message: "Invalid quiz id format" };
      }
      throw castError;
    }

    if (!quiz) {
      return { status: 404, message: "Could not find quiz with that id" };
    }

    // Prevent negative counts
    if (quiz.amountOfSaves <= 0) {
      return { status: 400, message: "Quiz save count is already zero" };
    }

    quiz.amountOfSaves -= 1;
    const response = await quiz.save();

    return {
      status: 200,
      message: "Quiz save count decremented",
      quiz: response,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Something went wrong when decrementing quiz saves",
      error: error,
    };
  }
};
