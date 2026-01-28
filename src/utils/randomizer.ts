import { Question } from "../models/types";

const randomizeQuestions = (questions: Question[], count = 5): Question[] => {
  const pool = [...questions];
  const randomQuestions: Question[] = [];
  console.log("randomizer running...");

  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const randomX = Math.floor(Math.random() * pool.length);
    randomQuestions.push(pool[randomX]);
    pool.splice(randomX, 1);
  }
  return randomQuestions;
};

export default randomizeQuestions;
