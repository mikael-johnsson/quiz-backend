import mongoose, { InferSchemaType, Schema } from "mongoose";

//remove question marks later
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

export interface SearchResult {
  totalResults: number;
  questions: Question[];
  statusCode: number;
}

export type getQuestionsQuery = {
  isApproved?: string;
  themes?: string[];
  difficulties?: string[];
  createdBy?: string;
  amount?: string;
};

export type PostQuestionBody = {
  question: string;
  answer: string;
  questionType: string;
  themes: string[];
  difficulty: string;
  createdBy: string;
};

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export type UserType = mongoose.HydratedDocument<
  InferSchemaType<typeof userSchema>
>;
export const UserModel = mongoose.model("User", userSchema);

export type UserDTO = {
  id: string;
  firstname: string;
  email: string;
};

export const convertToUserDTO = (user: UserType): UserDTO => {
  return {
    id: user._id.toString(),
    firstname: user.firstname,
    email: user.email,
  };
};

const questionSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  question: { type: String, required: true },
  questionType: { type: String },
  answer: { type: String },
  themes: [{ type: String }],
  difficulty: { type: String },
  isApproved: { type: Boolean, default: false },
  createdBy: { type: String },
  createdWhen: { type: String, default: Date.now },
});

export const QuestionModel = mongoose.model("Question", questionSchema);
