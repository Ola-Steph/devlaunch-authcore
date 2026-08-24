import type { Response } from "express";

export const success = <T>(
  res: Response,
  data: T | null = null,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const failure = (
  res: Response,
  message: string,
  statusCode = 400,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};