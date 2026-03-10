import express from "express";

export const logoutRouter = express.Router();

logoutRouter.post("/", (req, res) => {
  res.clearCookie("auth_quiz").json({ message: "Logout successful" });
});

export default logoutRouter;
