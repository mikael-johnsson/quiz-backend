import { PasswordChangeBody, UserModel, UserType } from "../models/types";
import bcrypt from "bcrypt";

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
