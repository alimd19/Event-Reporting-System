import mongoose from "mongoose";
import IBudget from "./budget.types";

enum UserType {
  National = "nt",
  Regional = "rg",
  Local = "lc",
  JKLC = "jk",
}

interface IUser extends mongoose.Document {
  username: string;
  password: string;
  type: UserType;
  location?: {
    region?: string;
    lb?: string;
    jklc?: string;
  };
  budget: IBudget;
}

export default IUser;
