import mongoose, { InferSchemaType, Schema } from "mongoose";
import { UserDTO } from "./User";

export type QuizCreatedBy = {
  id: string;
  firstname: string;
};

export interface Quiz {
  questions: number[];
  createdBy: QuizCreatedBy;
  amountOfSaves: number;
  createdWhen?: string;
  quizName: string;
}

const quizSchema = new Schema({
  questions: [{ type: Number, required: true }],
  createdBy: {
    id: { type: String, required: true },
    firstname: { type: String, required: true },
  },
  amountOfSaves: { type: Number, default: 1 },
  createdWhen: {
    type: String,
    default: new Date().toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  },
  quizName: { type: String, required: true },
});

export type QuizFromDB = mongoose.HydratedDocument<
  InferSchemaType<typeof quizSchema>
>;
export const QuizModel = mongoose.model("Quiz", quizSchema);

export type SavedQuizMutationResult = {
  user: UserDTO;
  changed: boolean;
};
