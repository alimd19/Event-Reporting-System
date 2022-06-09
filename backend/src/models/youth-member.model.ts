import mongoose from "mongoose";
import { IYouth_Member } from "../lib/types/youth-members.types";
import CenterSchema from "./center.model";

const youthMemberSchema: mongoose.Schema<IYouth_Member> = new mongoose.Schema({
  basic: {
    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    image: String,
    itrebId: { type: Number, required: true, unique: true, immutable: true },
    gender: { type: String, enum: ["male", "female"] },
  },
  contact: {
    email: String,
    phone: String,
  },
  center: { type: CenterSchema, required: true },
  editStatus: {
    lastEditOn: { type: Date, required: true },
    lastEditBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
});

const Youth_Member: mongoose.Model<IYouth_Member> = mongoose.model(
  "Youth_Member",
  youthMemberSchema
);

export default Youth_Member;
