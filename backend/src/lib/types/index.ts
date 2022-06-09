import mongoose from "mongoose";
import IUser from "./user.types";

export interface MyError extends Error {
  status?: number;
  message: string;
}

export interface EditStatus {
  lastEditBy: IUser["_id"];
  lastEditOn: Date;
}

export interface Center extends mongoose.Document {
  jklc?: string;
  localBoard?: string;
  regionalBoard: string;
}
