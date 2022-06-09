import mongoose from "mongoose";
import IBudget, { SportProgram } from "../lib/types/budget.types";

const ProgramSchema: mongoose.Schema = new mongoose.Schema({
  programs: { type: Number, required: true },
  participants: { type: Number, required: true },
});

const SportNumbersSchema: mongoose.Schema = new mongoose.Schema({
  underEighteen: { type: ProgramSchema, required: true },
  open: { type: ProgramSchema, required: true },
});

const SportProgramSchema: mongoose.Schema<SportProgram> = new mongoose.Schema({
  pos: { type: SportNumbersSchema, required: true },
  lsp: { type: SportNumbersSchema, required: true },
  tournaments: { type: SportNumbersSchema, required: true },
});

const BudgetSchema: mongoose.Schema<IBudget> = new mongoose.Schema({
  budgetfor: {
    region: { type: String, required: true },
    lb: { type: String },
    jklc: { type: String },
  },
  budget: {
    self: {
      cafe: { type: ProgramSchema, required: true },
      dfc: {
        eightToEleven: { type: ProgramSchema, required: true },
        twelveToFifteen: { type: ProgramSchema, required: true },
        sixteenToNineteen: { type: ProgramSchema, required: true },
      },
      theater: {
        sixToEight: { type: ProgramSchema, required: true },
        nineToTwelveL: { type: ProgramSchema, required: true },
        thirteenToFifteen: { type: ProgramSchema, required: true },
        sixteenToNineteen: { type: ProgramSchema, required: true },
      },
      parenting: { type: ProgramSchema, required: true },
      hc: {
        sixToEight: { type: ProgramSchema, required: true },
        nineToTwelveL: { type: ProgramSchema, required: true },
        thirteenToFifteen: { type: ProgramSchema, required: true },
      },
      az: { type: ProgramSchema, required: true },
      mm: {
        eightToFifteen: { type: ProgramSchema, required: true },
        fifteenPlus: { type: ProgramSchema, required: true },
      },
      ds: {
        sixToTwelve: { type: ProgramSchema, required: true },
        twelveToTwentyFour: { type: ProgramSchema, required: true },
      },
      shutterbugs: { type: ProgramSchema, required: true },
    },
    sports: {
      tt: SportProgramSchema,
      volleyball: SportProgramSchema,
      chess: SportProgramSchema,
      basketball: SportProgramSchema,
      throwball: SportProgramSchema,
      badminton: SportProgramSchema,
      cricket: SportProgramSchema,
      football: SportProgramSchema,
      others: SportProgramSchema,
    },
  },
});

const Budget: mongoose.Model<IBudget> = mongoose.model("Budget", BudgetSchema);

export default Budget;
