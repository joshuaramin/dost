import { Request, Response, NextFunction } from "express";
import { AppError } from "../appError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("🔥 ERROR:", err);

  // AppError (controlled)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // fallback unknown error
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
