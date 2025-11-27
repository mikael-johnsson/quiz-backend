// const themeFilter = (question, query) => {
//   if (!query.theme) return true;
//   return question.themes.includes(query.theme);
// };

// const difficultyFilter = (question, query) => {
//   if (!query.difficulty) return true;
//   return question.difficulty === query.difficulty;
// };

// const isApprovedFilter = (question, query) => {
//   if (!query.isApproved) return true;
//   return question.isApproved === query.isApproved;
// };

// const mainFilter = (questions, query) => {
//   return questions.filter(
//     (question) =>
//       themeFilter(question, query) &&
//       difficultyFilter(question, query) &&
//       isApprovedFilter(question, query)
//   );
// };

// module.exports = mainFilter;

// const randomizeQuestions = (questions) => {
//   let randomQuestions = [];
//   console.log("randomizer running...");

//   for (let i = 0; i < 5; i++) {
//     const randomX = Math.floor(Math.random() * questions.length);
//     randomQuestions.push(questions[randomX]);
//     questions.splice(randomX, 1);
//   }
//   return randomQuestions;
// };

// module.exports = randomizeQuestions;

// const express = require("express"); // express is now an function
// const app = express();
// app.use(express.json());

// //import cors and give access to requests from localhost:5173
// const cors = require("cors");
// const corsOptions = {
//   origin: "http://localhost:5173",
// };
// app.use(cors(corsOptions));

// const randomizer = require("./src/controllers/randomizer");
// const questionFilter = require("./src/controllers/questionFilter");

// const searchResult = {
//   totalResults: 0,
//   questions: [],
//   statusCode: 0,
// };

// //import hard coded data from data.json
// const data = require("./data.json");
// const questions = data.questions;

// //define a route
// app.get("/", (req, res) => {
//   res.send(
//     `<h1>Quiz Database</h1>
//     <p>Skriv in någon av dessa URL:s för att testa API:et</p>
//     <ul>
//         <li><em>/api/questions</em> - för att se alla frågor</li>
//         <li><em>/api/questions/'siffra'</em> - för att se enskild fråga</li>
//     </ul>
//     `
//   );
// });

// //returns json to frontend when api call made.
// // if not correct json, it wont send.
// // ?theme=<value>&difficulty=<value> in the url returns
// // all questions with that theme and difficulty level
// app.get("/api/questions", (req, res) => {
//   const filteredQuestions = questionFilter(questions, req.query);
//   if (filteredQuestions.length !== 0) {
//     searchResult.questions = filteredQuestions;
//     searchResult.totalResults = filteredQuestions.length;
//     searchResult.statusCode = 200;
//     res.status(200);
//     res.json(searchResult);
//   } else {
//     res.status(404).send("Didn't find any questions that match those filters");
//   }
// });

// //använda parameter i route
// app.get("/api/questions/:id", (req, res) => {
//   const question = questions.find((q) => q.id === parseInt(req.params.id));
//   if (!question)
//     res
//       .status(404)
//       .send("Didn't find question, your searched for questions by id");
//   res.send(question);
// });

// //LATER

// //POST - posting questions to the "database",
// // in this case to the temporary list on the server
// app.post("/api/questions", (req, res) => {
//   if (!req.body.question) {
//     //input validation on question
//     res.status(400).send("Error message"); //sending status message
//     return; //returning because we dont want to add an empty question to database
//   }
//   const question = {
//     id: questions.length + 1,
//     question: req.body.question,
//     answer: req.body.answer,
//   };
//   questions.push(question);
//   res.send(question);
// });

// //PORT
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port: ${port}`));
