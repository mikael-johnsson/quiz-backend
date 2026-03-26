import jwt from "jsonwebtoken";

export const verifyToken = (cookie: string) => {
  const secret = process.env.JWT_SECRET;

  return jwt.verify(cookie, secret || "");
};
