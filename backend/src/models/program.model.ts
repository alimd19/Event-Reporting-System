import mongoose from "mongoose";
import { IProgram } from "../lib/types/program.types";

// Custom validator for jklc and local board arrays
const locationArrayValidator = [
  // validator funcyion
  (v: string[]) => Array.isArray(v) && v.length > 0,
  // Error message
  "Array must have at least one value.",
];

const programSchema: mongoose.Schema<IProgram> = new mongoose.Schema({
  basic: {
    name: { type: String, required: true },
    minAge: { type: Number, required: true },
    maxAge: { type: Number, required: true },
    subCategory: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    venue: { type: String },
    centers: {
      jklcs: { type: [String], validate: locationArrayValidator },
      localBoards: { type: [String], validate: locationArrayValidator },
      regionalBoard: { type: String, required: true },
    },
  },
  finances: {
    income: {
      feePerHead: { type: Number, required: true },
      additionalIncome: { type: Number, required: true },
      totalIncome: { type: Number, required: true },
    },
    expenses: {
      postage: { type: Number },
      internet: { type: Number },
      stationary: { type: Number },
      equipment: { type: Number },
      printing: { type: Number },
      transport: { type: Number },
      localConveyance: { type: Number },
      venue: { type: Number },
      faculty: { type: Number },
      souvenir: { type: Number },
      food: { type: Number },
      cleaning: { type: Number },
      labour: { type: Number },
      medical: { type: Number },
      miscellaneous: { type: Number },
    },
  },
  participants: {
    totalNumberOfParticipants: { type: Number, required: true },
    missingParticipants: { type: Number, required: true },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Youth_Member" },
    ],
  },
  programState: {
    status: {
      type: String,
      required: true,
      enum: [
        "Rejected",
        "Pending",
        "Approved By Local",
        "Approved By Regional",
        "Approved By National",
      ],
    },
    createdOn: { type: Date, required: true },
    editStatus: {
      lastEditOn: { type: Date, required: true },
      lastEditBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  },
});

const Program: mongoose.Model<IProgram> = mongoose.model(
  "Program",
  programSchema
);

export default Program;
