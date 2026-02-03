import express from "express";
import cors from "cors";
import landingPageRouter from "./routes/landingPageRouter";
import questionsRouter from "./routes/questionsRouter";
import dotenv from "dotenv";
import { run } from "./database/quiz_database";

dotenv.config();
const uri: string | undefined = process.env.MONGODB_URI;

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173"], // Lägg till frontends deployade URL när deployad
};
app.use(cors()); // allow all

app.use("/", landingPageRouter);
app.use("/api/questions", questionsRouter);

run(uri).catch(console.dir);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}`));
