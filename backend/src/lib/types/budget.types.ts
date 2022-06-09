import mongoose from "mongoose";
import { Center } from ".";

export interface Program {
  programs: number;
  participants: number;
}

export type Sport = {
  underEighteen: Program;
  open: Program;
};

export type SportProgram = {
  pos: Sport;
  lsp: Sport;
  tournaments: Sport;
};

interface IBudget extends mongoose.Document {
  budgetFor?: Center;
  budget: {
    self: {
      cafe: Program;
      dfc: {
        eightToEleven: Program;
        twelveToFifteen: Program;
        sixteenToNineteen: Program;
      };
      theater: {
        sixToEight: Program;
        nineToTwelveL: Program;
        thirteenToFifteen: Program;
        sixteenToNineteen: Program;
      };
      parenting: Program;
      hc: {
        sixToEight: Program;
        nineToTwelveL: Program;
        thirteenToFifteen: Program;
      };
      az: Program;
      mm: {
        eightToFifteen: Program;
        fifteenPlus: Program;
      };
      ds: {
        sixToTwelve: Program;
        twelveToTwentyFour: Program;
      };
      shutterbugs: Program;
    };
    sports: {
      tt: SportProgram;
      volleyball: SportProgram;
      chess: SportProgram;
      basketball: SportProgram;
      throwball: SportProgram;
      badminton: SportProgram;
      cricket: SportProgram;
      football: SportProgram;
      others: SportProgram;
    };
  };
}

export default IBudget;
