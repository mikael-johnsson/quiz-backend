const express = require("express"); // express is now an function
const app = express();

app.use(express.json());
//installera cors paketet, sen app.cors()

const questions = [
  { id: 1, question: "How tall is the Eiffel Tower?", answer: "368m" },
  { id: 2, question: "What is the capitol of Denmark", answer: "Copenhagen" },
  {
    id: 3,
    question: "Who is the president of Finland?",
    answer: "Alexander Stubb",
  },
  { id: 4, question: "What color is magenta?", answer: "Pink" },
];

//define a route
app.get("/", (req, res) => {
  res.send(`<h1>hipp1</h1>`);
});

//returns json to frontend when api call made.
// if not correct json, it wont send if not correct json.
// CORS should be fixed earlier so its not needed on every single endpoint
app.get("/api/questions", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.json(questions);
});

//använda parameter i route
app.get("/api/questions/:id", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const question = questions.find((q) => q.id === parseInt(req.params.id));
  if (!question) res.status(404).send("Didn't find question");
  res.send(question);
});

//använda flera parametrar i route
app.get("/api/questions/:id/:year", (req, res) => {
  res.send(req.params);
});

//query parameters (efter url:en ?sortBy=name)
app.get("/api/sort", (req, res) => {
  res.send(req.query);
});

//POST
app.post("/api/questions", (req, res) => {
  const question = {
    id: questions.length + 1,
    question: req.body.question,
    answer: req.body.answer,
  };
  questions.push(question);
  res.send(question);
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));
