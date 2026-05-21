import express from "express";

export const logoutRouter = express.Router();

logoutRouter.post("/", async (_, res) => {
  res
    .status(200)
    .clearCookie("quiz_login", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .json({ message: "Logout successful" });
});

export default logoutRouter;
