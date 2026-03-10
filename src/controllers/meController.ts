import jwt from "jsonwebtoken";

export const verifyToken = (cookie: string) => {
  const secret = process.env.JWT_SECRET;

  const payload = jwt.verify(cookie, secret || "");
  return payload;
};
