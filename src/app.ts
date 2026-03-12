import express from "express";
import cors from "cors";
import landingPageRouter from "./routes/landingPageRouter";
import questionsRouter from "./routes/questionsRouter";
import dotenv from "dotenv";
// import { run } from "./database/quiz_database";
import mongoose from "mongoose";
import { userRouter } from "./routes/userRouter";
import loginRouter from "./routes/loginRouter";
import logoutRouter from "./routes/logoutRouter";
import { meRouter } from "./routes/meRouter";
import cookieParser from "cookie-parser";

dotenv.config();
const uri: string | undefined = process.env.MONGODB_URI;

if (!uri) {
  throw Error("Could not find URI to database");
}

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://quiz-frontend-tawny-eight.vercel.app/",
  ],
};
app.use(cors());

app.use("/", landingPageRouter);
app.use("/api/questions", questionsRouter);
app.use("/users", userRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/me", meRouter);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  try {
    await mongoose.connect(uri, { dbName: "quiz" });
    console.log("Connection state:", mongoose.connection.readyState); // 1 means connected
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
});
