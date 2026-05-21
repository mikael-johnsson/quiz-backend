import bcrypt from "bcrypt";
import {
  PasswordChangeBody,
  UserModel,
  UserType,
  convertToUserDTO,
} from "../models/User";

type SavedQuizMutationResult = {
  user: ReturnType<typeof convertToUserDTO>;
  changed: boolean;
};

export const createUser = async (userData: UserType) => {
  const existingUser = await UserModel.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await UserModel.create({ ...userData, password: hashedPassword });
};

export const changePassword = async (
  passwordChangeData: PasswordChangeBody,
) => {
  const existingUser = await UserModel.findOne({
    email: passwordChangeData.email,
  });
  if (!existingUser) {
    throw new Error(
      "Could not find user whit that email when changing password",
    );
  }
  const match = await bcrypt.compare(
    passwordChangeData.currentPassword,
    existingUser.password,
  );
  if (!match) {
    throw new Error("Current password did not match with user password");
  }

  existingUser.password = await bcrypt.hash(passwordChangeData.newPassword, 10);
  return await existingUser.save();
};

/**
 * Add a quiz id to a user's savedQuizzes list.
 * The id is only added when both the user and quiz exist and the quiz is not already saved.
 */
export const addSavedQuizToUser = async (
  userId: string,
  quizId: string,
): Promise<SavedQuizMutationResult> => {
  if (!userId || !quizId) {
    throw new Error("User id and quiz id are required");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("Could not find user when saving quiz");
  }

  if (!user.savedQuizzes.includes(quizId)) {
    user.savedQuizzes.push(quizId);
    const updatedUser = await user.save();
    return { user: convertToUserDTO(updatedUser), changed: true };
  }

  return { user: convertToUserDTO(user), changed: false };
};

/**
 * Remove a quiz id from a user's savedQuizzes list.
 * The operation is safe if the quiz was not previously saved.
 */
export const removeSavedQuizFromUser = async (
  userId: string,
  quizId: string,
): Promise<SavedQuizMutationResult> => {
  if (!userId || !quizId) {
    throw new Error("User id and quiz id are required");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("Could not find user when unsaving quiz");
  }

  const hasSavedQuiz = user.savedQuizzes.includes(quizId);
  if (!hasSavedQuiz) {
    return { user: convertToUserDTO(user), changed: false };
  }

  user.savedQuizzes = user.savedQuizzes.filter(
    (savedQuizId) => savedQuizId !== quizId,
  );
  const updatedUser = await user.save();
  return { user: convertToUserDTO(updatedUser), changed: hasSavedQuiz };
};
