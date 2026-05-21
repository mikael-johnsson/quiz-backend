import express from "express";
import cors from "cors";
import landingPageRouter from "./routes/landingPageRouter";
import questionsRouter from "./routes/questionsRouter";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userRouter } from "./routes/userRouter";
import loginRouter from "./routes/loginRouter";
import logoutRouter from "./routes/logoutRouter";
import { meRouter } from "./routes/meRouter";
import cookieParser from "cookie-parser";
import { json } from "express";
import { quizRouter } from "./routes/quizRouter";

dotenv.config();
const uri: string | undefined = process.env.MONGODB_URI;

if (!uri) {
  throw Error("Could not find URI to database");
}

const app = express();
app.use(json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://quiz-frontend-tawny-eight.vercel.app",
    "https://quiz-frontend-next.vercel.app",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/", landingPageRouter);
app.use("/questions", questionsRouter);
app.use("/users", userRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/me", meRouter);
app.use("/quiz", quizRouter);

const port = process.env.PORT || 3000;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "quiz",
      serverSelectionTimeoutMS: 2000, // 2s max server discovery
      connectTimeoutMS: 5000, // 5s max connection
      maxPoolSize: 1,
      family: 4,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("✅ MongoDB connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

// Only use locally
if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.listen(port, async () => {
    try {
      await connectDB();
      console.log("Connection state:", mongoose.connection.readyState); // 1 means connected
      console.log(`Server is running on port ${port}`);
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  });
}
export { connectDB };
export default app;
