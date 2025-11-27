import express, { Request, Response } from "express";
import cors from "cors";

import questionFilter from "./controllers/questionFilter";
import { Question, SearchResult } from "./types";

import data from "../data.json";
import { log } from "console";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

const questions: Question[] = (data as any).questions || [];

app.get("/", (req: Request, res: Response) => {
  res.send(
    `<h1>Quiz Database</h1>
    <p>Skriv in någon av dessa URL:s för att testa API:et</p>
    <ul>
        <li><em>/api/questions</em> - för att se alla frågor</li>
        <li><em>/api/questions/'siffra'</em> - för att se enskild fråga</li>
    </ul>
    `
  );
});

app.get("/api/questions", (req: Request, res: Response) => {
  const filteredQuestions: Question[] = questionFilter(
    questions,
    req.query as any
  );
  if (filteredQuestions.length !== 0) {
    let searchResult: SearchResult = {
      totalResults: filteredQuestions.length,
      questions: filteredQuestions,
      statusCode: 200,
    };
    res.status(200);
    res.json(searchResult);
  } else {
    res.status(404).send("Didn't find any questions that match those filters");
  }
});

app.get("/api/questions/:id", (req: Request, res: Response) => {
  const id = parseInt((req.params as any).id);
  const question = questions.find((q) => q.id === id);
  if (!question)
    return res
      .status(404)
      .send("Didn't find question, your searched for questions by id");
  res.send(question);
});

// get themes for readme
const getThemes = () => {
  let themeArray: string[] = [];
  questions.forEach((question) => {
    question.themes?.forEach((theme) => {
      if (!themeArray.includes(theme)) {
        themeArray.push(theme);
      }
    });
  });
  console.log("This is the full themeArray", themeArray);
};
getThemes();

// app.post("/api/questions", (req: Request, res: Response) => {
//   if (!req.body.question) {
//     res.status(400).send("Error message");
//     return;
//   }
//   const question: Question = {
//     id: questions.length + 1,
//     question: req.body.question,
//     answer: req.body.answer,
//   };
//   questions.push(question);
//   res.send(question);
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));
