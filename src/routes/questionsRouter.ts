import express from "express";
import {
  deleteQuestion,
  getQuestionById,
  getQuestions,
  postQuestion,
  replaceQuestion,
} from "../controllers/questionsController";
import {
  getQuestionsQuery,
  PostQuestionBody,
  Question,
  SearchResult,
} from "../models/types";

const questionsRouter = express.Router();

questionsRouter.get("/", async (req, res) => {
  const { isApproved, themes, difficulties, createdBy }: getQuestionsQuery =
    req.query;

  const questions = await getQuestions(
    isApproved,
    themes,
    difficulties,
    createdBy,
  );

  if (questions && questions.length !== 0) {
    let searchResult: SearchResult = {
      totalResults: questions.length,
      questions: questions,
      statusCode: 200,
    };

    res.status(200).json(searchResult);
  } else {
    res.status(404).send("Didn't find any questions that match those filters");
  }
});

questionsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    res.status(400).json({ message: "Request did not contain id parameter" });

  const question = await getQuestionById(id);

  if (!question) {
    res
      .status(404)
      .send("Didn't find question, you searched for questions by id: " + id);
  } else {
    res.status(200).json(question);
  }
});

questionsRouter.post("/", async (req, res) => {
  const {
    question,
    answer,
    questionType,
    themes,
    difficulty,
    createdBy,
  }: PostQuestionBody = req.body;
  const response = await postQuestion(
    question,
    answer,
    questionType,
    themes,
    difficulty,
    createdBy,
  );
  res.status(response.status).send(response.message);
});

questionsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const response = await deleteQuestion(id);
  if (response.deletedCount > 0) {
    res.status(203).json(response);
  } else {
    res.status(500).json({ message: "something went wrong, nothing deleted" });
  }
});
questionsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { question }: { question: Question } = req.body;
  // here we should check if all properties of the question exists

  if (+id !== question.id) {
    res.status(400).send("Parameter Id and Body Id does not match");
  }

  const response = await replaceQuestion(id, question);

  if (response.modifiedCount > 0) {
    res.status(200).json(response);
  } else {
    res.status(400).json(response);
  }
});

export default questionsRouter;
