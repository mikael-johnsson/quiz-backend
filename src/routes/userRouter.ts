import express from "express";
import { changePassword, createUser } from "../controllers/usersController";
import { connectDB } from "../app";
import { PasswordChangeBody } from "../models/types";

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

userRouter.put("/passwordchange", async (req, res) => {
  try {
    await connectDB();
    const passwordChangeData: PasswordChangeBody = req.body;
    const user = await changePassword(passwordChangeData);
    if (user) {
      res
        .status(200)
        .json({ message: "Password updated successfully", user: user });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
});
