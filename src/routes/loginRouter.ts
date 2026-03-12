import express from "express";
import { loginUser } from "../controllers/loginController";
import jwt from "jsonwebtoken";
import { connectDB } from "../app";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    const loginSuccess = await loginUser(email, password);
    if (loginSuccess) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT secret not defined");
      }
      const token = jwt.sign({ email }, secret, { expiresIn: "1h" });
      res
        .status(200)
        .cookie("auth_quiz", token, { httpOnly: true })
        .json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
});

export default loginRouter;
