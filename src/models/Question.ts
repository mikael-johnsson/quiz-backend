import mongoose, { InferSchemaType, Schema } from "mongoose";

export interface Question {
  id: number;
  question: string;
  questionType?: string;
  answer?: string;
  themes?: string[];
  difficulty?: string;
  isApproved?: boolean;
  createdBy?: string;
  createdWhen?: string;
}

export type getQuestionsQuery = {
  isApproved?: string;
  themes?: string[];
  difficulties?: string[];
  createdBy?: string;
  amount?: string;
  search?: string;
};

export type getQuestionsForPDFQuery = {
  questionIds?: string[];
  themes?: string[];
  difficulties?: string[];
};

export type PostQuestionBody = {
  question: string;
  answer: string;
  questionType: string;
  themes: string[];
  difficulty: string;
  createdBy: string;
};

export interface SearchResult {
  totalResults: number;
  questions: Question[];
  statusCode: number;
}

const questionSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  question: { type: String, required: true },
  questionType: { type: String },
  answer: { type: String },
  themes: [{ type: String }],
  difficulty: { type: String },
  isApproved: { type: Boolean, default: false },
  createdBy: { type: String },
  createdWhen: {
    type: String,
    default: new Date().toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  },
});

export type QuestionFromDB = mongoose.HydratedDocument<
  InferSchemaType<typeof questionSchema>
>;
export const QuestionModel = mongoose.model("Question", questionSchema);
