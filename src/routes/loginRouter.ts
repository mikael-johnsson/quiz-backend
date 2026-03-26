import express from "express";
import { loginUser } from "../controllers/loginController";
import jwt from "jsonwebtoken";
import { connectDB } from "../app";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  try {
    console.log("Attempting login");
    await connectDB();
    const { email, password } = req.body;
    const loggedInUser = await loginUser(email, password);
    console.log("loggedInUser", loggedInUser);
    if (loggedInUser) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT secret not defined");
      }
      const token = jwt.sign(loggedInUser, secret, { expiresIn: "1h" });
      res
        .status(200)
        .cookie("quiz_login", token, {
          httpOnly: true,
          maxAge: 10 * 60 * 1000,
          sameSite: "none",
          secure: true,
        })
        .json(loggedInUser);
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
