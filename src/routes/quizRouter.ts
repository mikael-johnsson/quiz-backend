import express from "express";
import { connectDB } from "../app";
import { authGuard } from "../middleware/authGuard";
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  incrementQuizSaveCount,
  decrementQuizSaveCount,
} from "../controllers/quizController";

export const quizRouter = express.Router();

/**
 * GET /quiz
 * List quizzes. Query params:
 * - `createdBy` (optional) to filter by creator
 * - `populate=true` (optional) to include full question objects
 */
quizRouter.get("/", async (req, res) => {
  try {
    await connectDB();
    const { createdBy, populate } = req.query;
    const populateFlag = String(populate) === "true";

    const quizzes = await getQuizzes(
      createdBy as string | undefined,
      populateFlag,
    );

    if (Array.isArray(quizzes)) {
      res.status(200).json(quizzes);
    } else {
      res.status(quizzes.status || 500).json(quizzes);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
});

/**
 * GET /quiz/:id
 * Fetch a single quiz by its MongoDB id. Supports `?populate=true`.
 */
quizRouter.get("/:id", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { populate } = req.query;
    const populateFlag = String(populate) === "true";

    const quiz = await getQuizById(id, populateFlag);
    if ((quiz as any).status) {
      res.status((quiz as any).status).json(quiz);
    } else {
      res.status(200).json(quiz);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
});

// kräver användare för alla endpoints under denna
quizRouter.use(authGuard);

/**
 * POST /quiz
 * Create a new saved quiz.
 * Body: { questions: (string|number)[] }
 * Questions are normalized to number[] internally.
 */
quizRouter.post("/", async (req, res) => {
  try {
    await connectDB();
    const { questions: rawQuestions } = req.body;
    const createdBy = req.user?.id;

    if (!createdBy) {
      return res.status(401).json({ message: "Invalid authenticated user" });
    }

    // normalize questions from strings/mixed input to number[]
    let questions: number[] = [];
    if (Array.isArray(rawQuestions)) {
      questions = rawQuestions
        .map((q: any) => {
          const parsed = typeof q === "string" ? parseInt(q, 10) : Number(q);
          return Number.isNaN(parsed) ? null : parsed;
        })
        .filter((q: any): q is number => q !== null);
    }

    // validate after parsing
    if (questions.length === 0) {
      return res.status(400).json({
        message:
          "Invalid questions: must provide a non-empty array of valid question ids",
      });
    }

    const response = await createQuiz(questions, createdBy);
    res.status(response.status || 500).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
});

/**
 * PATCH /quiz/:id/save
 * Increment the `amountOfSaves` counter for a quiz.
 */
quizRouter.patch("/:id/save", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const response = await incrementQuizSaveCount(id);
    res.status(response.status || 500).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
});

/**
 * PATCH /quiz/:id/unsave
 * Decrement the `amountOfSaves` counter for a quiz (no negative values).
 */
quizRouter.patch("/:id/unsave", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const response = await decrementQuizSaveCount(id);
    res.status(response.status || 500).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
});
