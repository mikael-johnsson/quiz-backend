import { UserModel } from "../models/types";
import bcrypt from "bcrypt";

export const loginUser = async (
  email: string,
  password: string,
): Promise<boolean> => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const match = await bcrypt.compare(password, user.password);

  if (match) {
    return true;
  }
  return false;
};
