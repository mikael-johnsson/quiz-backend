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
      dbName: "quiz",
      // 🔥 FAIL FAST - don't wait 300s
      serverSelectionTimeoutMS: 2000, // 2s max server discovery
      connectTimeoutMS: 5000, // 5s max connection
      socketTimeoutMS: 10000, // 10s socket timeout
      maxPoolSize: 1,
      // 🔥 FORCE IPv4 (Vercel IPv6 issues)
      family: 4,
      // 🔥 Direct connection (skip replica set discovery)
      autoIndex: false,
      retryWrites: false,
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

app.listen(port, async () => {
  try {
    await connectDB();
    console.log("Connection state:", mongoose.connection.readyState); // 1 means connected
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
});

export default connectDB;
