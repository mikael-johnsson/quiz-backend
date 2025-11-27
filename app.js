const express = require("express"); // express is now an function
const app = express();

app.use(express.json());
//installera cors paketet, sen app.cors()

//import hard coded data from data.json
const data = require("./data.json");
const questions = data.questions;

//define a route
app.get("/", (req, res) => {
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

//returns json to frontend when api call made.
// if not correct json, it wont send.
// CORS should be fixed earlier so its not needed on every single endpoint
app.get("/api/questions", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (questions) {
    res.status(200);
    res.json(questions);
  } else {
    res.status(404);
    res.send("No questions found");
  }
});

//använda parameter i route
app.get("/api/questions/:id", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  const question = questions.find((q) => q.id === parseInt(req.params.id));
  if (!question) res.status(404).send("Didn't find question");
  res.send(question);
});

//LATER

//POST - posting questions to the "database",
// in this case to the temporary list on the server
app.post("/api/questions", (req, res) => {
  if (!req.body.question) {
    //input validation on question
    res.status(400).send("Error message"); //sending status message
    return; //returning because we dont want to add an empty question to database
  }
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
