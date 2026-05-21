import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/verifyToken";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies?.["quiz_login"];

  if (!cookie) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    req.user = verifyToken(cookie);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};
