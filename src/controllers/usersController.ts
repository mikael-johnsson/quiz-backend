import { UserModel, UserType } from "../models/types";
import bcrypt from "bcrypt";

export const createUser = async (userData: UserType) => {
  const existingUser = await UserModel.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await UserModel.create({ ...userData, password: hashedPassword });
};
