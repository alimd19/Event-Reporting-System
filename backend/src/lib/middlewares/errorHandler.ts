import { MyError } from "../types/index";
import { NextFunction } from "express";

const errorHandler = (message: string, status: number, next: NextFunction) => {
  const err: MyError = new Error(message);
  err.status = status;
  next(err);
};

export default errorHandler;
