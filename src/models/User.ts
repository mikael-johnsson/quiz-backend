import mongoose, { InferSchemaType, Schema } from "mongoose";

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedQuizzes: { type: [String], required: true, default: [] },
});

export type UserType = mongoose.HydratedDocument<
  InferSchemaType<typeof userSchema>
>;
export const UserModel = mongoose.model("User", userSchema);

export type UserDTO = {
  id: string;
  firstname: string;
  email: string;
  savedQuizzes: string[];
};

export const convertToUserDTO = (user: UserType): UserDTO => {
  return {
    id: user._id.toString(),
    firstname: user.firstname,
    email: user.email,
    savedQuizzes: user.savedQuizzes,
  };
};

export type PasswordChangeBody = {
  email: string;
  currentPassword: string;
  newPassword: string;
};
