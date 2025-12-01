import express from "express";
import cors from "cors";
import { landingPageRouter } from "./routes/landingPageRouter";
import questionsRouter from "./routes/questionsRouter";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
// ["http://localhost:5173"]

app.use("/", landingPageRouter);
app.use("/api/questions", questionsRouter);

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
