import mongoose from "mongoose";
import { RT } from "../lib/types/token.types";

const RefreshTokenSchema: mongoose.Schema<RT> = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RefreshToken: mongoose.Model<RT> = mongoose.model(
  "RefreshToken",
  RefreshTokenSchema
);

export default RefreshToken;
