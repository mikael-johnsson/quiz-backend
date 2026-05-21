import jwt from "jsonwebtoken";
import { UserDTO } from "../models/types";

export const verifyToken = (cookie: string): UserDTO => {
  const secret = process.env.JWT_SECRET;

  return jwt.verify(cookie, secret || "") as UserDTO;
};
