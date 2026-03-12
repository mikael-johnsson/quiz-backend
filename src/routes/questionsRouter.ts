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
import pdfkit from "pdfkit";

const questionsRouter = express.Router();

questionsRouter.get("/", async (req, res) => {
  try {
    const { isApproved, themes, difficulties, createdBy }: getQuestionsQuery =
      req.query;

    const questions = await getQuestions(
      isApproved,
      themes,
      difficulties,
      createdBy,
    );

    if (Array.isArray(questions)) {
      if (questions.length !== 0) {
        let searchResult: SearchResult = {
          totalResults: questions.length,
          questions: questions,
          statusCode: 200,
        };
        const doc = new pdfkit({ size: "A4", margin: 50 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="quiz.pdf"');

        // Stream PDF directly to response
        doc.pipe(res);

        doc.fontSize(20).text("Ditt Quiz", { align: "center" });
        doc.moveDown();

        questions.forEach((q: Question, i) => {
          doc.fontSize(14).text(`${i + 1}. ${q.question}`);

          doc.fontSize(12).text(`Svar: ${q.answer}`, {
            indent: 10,
          });
          doc.fontSize(12).text(`Svårighetsgrad: ${q.difficulty}`, {
            indent: 10,
          });
          doc
            .fontSize(12)
            .text(`${q.themes ? `Tema: ${q.themes.join(", ")}` : ""}`, {
              indent: 10,
            });

          doc.moveDown();
        });

        doc.end();

        // res.status(200).json(searchResult);
      } else {
        res
          .status(404)
          .send("Didn't find any questions that match those filters");
      }
    } else {
      res.status(questions.status).json(questions);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
});

questionsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      res.status(400).json({ message: "Request did not contain id parameter" });

    const question = await getQuestionById(id);
    if (Array.isArray(question)) {
      if (question.length === 0) {
        res
          .status(404)
          .send(
            "Didn't find question, you searched for questions by id: " + id,
          );
      } else {
        res.status(200).json(question);
      }
    } else {
      res.status(question.status).json(question);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
});

questionsRouter.post("/", async (req, res) => {
  try {
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
    res.status(response.status).send(response);
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong", error: error };
  }
});

questionsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteQuestion(id);
    res.status(response.status).json(response); // this response is not showing on postman, but status works
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong", error: error };
  }
});

questionsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { question }: { question: Question } = req.body;

    if (+id !== question.id) {
      res.status(400).send("Parameter Id and Body Id does not match");
    }

    const noUndefinedProperties = Object.values(question).every(
      (val) => val !== undefined,
    );

    if (noUndefinedProperties) {
      const response = await replaceQuestion(id, question);
      res.status(response.status).json(response);
    } else {
      res
        .status(400)
        .send("Question posted did not contain the correct properties");
    }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Something went wrong", error: error };
  }
});

export default questionsRouter;
