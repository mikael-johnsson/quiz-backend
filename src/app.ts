import express from "express";
import cors from "cors";
import { landingPageRouter } from "./routes/landingPageRouter";
import questionsRouter from "./routes/questionsRouter";
import { password } from "../mongoPassword";

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

//Database
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://mikael-johnsson:${password}@quiz-db-test.jez5rbj.mongodb.net/?appName=Quiz-DB-test`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// CRUD
// Post = insert, insertOne(), insertmany()
// Read = query
// Update = update
// Delete = delete
const database = client.db("Quiz-DB-test");
console.log(database);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));
