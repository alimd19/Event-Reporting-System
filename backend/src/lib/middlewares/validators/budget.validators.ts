import Joi from "joi";
import IBudget, {
  SportProgram,
  Sport,
  Program,
} from "../../types/budget.types";
import centerValidator from "./center.validator";

const ProgramValidator: Joi.ObjectSchema<Program> = Joi.object({
  programs: Joi.number().required().positive(),
  participants: Joi.number().required().positive(),
});

const sportValidator: Joi.ObjectSchema<Sport> = Joi.object({
  underEighteen: ProgramValidator,
  open: ProgramValidator,
});

const sportProgramValidator: Joi.ObjectSchema<SportProgram> = Joi.object({
  pos: sportValidator,
  lsp: sportValidator,
  tournaments: sportValidator,
});

const budgetValidator: Joi.ObjectSchema<IBudget> = Joi.object({
  budgetfor: centerValidator,
  budget: {
    self: {
      cafe: ProgramValidator,
      dfc: {
        eightToEleven: ProgramValidator,
        twelveToFifteen: ProgramValidator,
        sixteenToNineteen: ProgramValidator,
      },
      theater: {
        sixToEight: ProgramValidator,
        nineToTwelveL: ProgramValidator,
        thirteenToFifteen: ProgramValidator,
        sixteenToNineteen: ProgramValidator,
      },
      parenting: ProgramValidator,
      hc: {
        sixToEight: ProgramValidator,
        nineToTwelveL: ProgramValidator,
        thirteenToFifteen: ProgramValidator,
      },
      az: ProgramValidator,
      mm: {
        eightToFifteen: ProgramValidator,
        fifteenPlus: ProgramValidator,
      },
      ds: {
        sixToTwelve: ProgramValidator,
        twelveToTwentyFour: ProgramValidator,
      },
      shutterbugs: ProgramValidator,
    },
    sports: {
      tt: sportProgramValidator,
      volleyball: sportProgramValidator,
      chess: sportProgramValidator,
      basketball: sportProgramValidator,
      throwball: sportProgramValidator,
      badminton: sportProgramValidator,
      cricket: sportProgramValidator,
      football: sportProgramValidator,
      others: sportProgramValidator,
    },
  },
});

export default budgetValidator;
