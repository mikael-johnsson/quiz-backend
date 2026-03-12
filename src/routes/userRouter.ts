import express from "express";
import { createUser } from "../controllers/usersController";
import connectDB from "../app";

export const userRouter = express.Router();

userRouter.post("/", async (req, res) => {
  try {
    await connectDB();
    const userData = req.body;
    const user = await createUser(userData);
    if (user) {
      res
        .status(200)
        .json({ message: "User created successfully", user: user });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});
