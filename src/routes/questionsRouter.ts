import express from "express";
import { questionsController } from "../controllers/questionsController";

const questionsRouter = express.Router();

questionsRouter.get("/api/questions", (req, res) => {
  console.log("Router");

  questionsController(req, res);
});

export default questionsRouter;
