import Joi from "joi";
import JoiObjectId from "joi-objectid";
import { IProgram } from "../../types/program.types";
import { IYouth_Member } from "../../types/youth-members.types";
const myJoiObjectId = JoiObjectId(Joi);

// Checks for valid totals
export const isTotalEqual = (
  finances: any,
  participantsObject: {
    participants: IYouth_Member["_id"][];
    totalNumberOfParticipants: any;
    missingParticipants: any;
  }
) => {
  const { income, expenses } = finances;
  const { feePerHead, additionalIncome, totalIncome } = income;
  const {
    participants,
    totalNumberOfParticipants,
    missingParticipants,
  } = participantsObject;
  let isEqual = false;
  let message = "";
  let totalExpense: number = 0;

  // Calculate total expense
  for (const property in expenses) {
    totalExpense += parseInt(expenses[property]);
  }

  //   1. Is total income equal to total expense
  if (parseInt(totalIncome) === totalExpense) {
    isEqual = true;
  } else {
    message = "Total income is not equal to total expense.";
    return { isEqual, message };
  }

  //   2. Is total income equal to (fee per head * total number of participants) + additional income
  if (
    parseInt(feePerHead) * parseInt(totalNumberOfParticipants) +
      parseInt(additionalIncome) ===
    parseInt(totalIncome)
  ) {
    isEqual = isEqual && true;
  } else {
    message =
      "Entered total income is wrong. \
    Hint:- check (feePerHead * totalNumberOfParticipants) + additionalIncome";
    return { isEqual: false, message };
  }

  //   3. Is total number of participants equal to number of particpants provided + number of missing participants
  if (
    participants.length + parseInt(missingParticipants) ===
    parseInt(totalNumberOfParticipants)
  ) {
    isEqual = isEqual && true;
  } else {
    message =
      "Total number of participants does not match number of participants selected + number of missing participants.";
    isEqual = false;
  }

  return { isEqual, message };
};

// Validators for program input data
const programValidator: Joi.ObjectSchema<IProgram> = Joi.object({
  basic: {
    name: Joi.string().required(),
    minAge: Joi.number().required().positive(),
    maxAge: Joi.number().required().positive(),
    subCategory: Joi.string(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    venue: Joi.string(),
    centers: {
      jklcs: Joi.array().items(Joi.string()).min(1),
      localBoards: Joi.array().items(Joi.string()).min(1),
      regionalBoard: Joi.string().required(),
    },
  },
  finances: {
    income: {
      feePerHead: Joi.number().required().positive(),
      additionalIncome: Joi.number().required().positive(),
      totalIncome: Joi.number().required().positive(),
    },
    expenses: {
      postage: Joi.number().positive(),
      internet: Joi.number().positive(),
      stationary: Joi.number().positive(),
      equipment: Joi.number().positive(),
      printing: Joi.number().positive(),
      transport: Joi.number().positive(),
      localConveyance: Joi.number().positive(),
      venue: Joi.number().positive(),
      faculty: Joi.number().positive(),
      souvenir: Joi.number().positive(),
      food: Joi.number().positive(),
      cleaning: Joi.number().positive(),
      labour: Joi.number().positive(),
      medical: Joi.number().positive(),
      miscellaneous: Joi.number().positive(),
    },
  },
  participants: {
    totalNumberOfParticipants: Joi.number().required().positive(),
    missingParticipants: Joi.number().required().positive(),
    participants: Joi.array().items(myJoiObjectId()),
  },
  programState: {
    status: Joi.string()
      .required()
      .valid(
        "Rejected",
        "Pending",
        "Approved By Local",
        "Approved By Regional",
        "Approved By National"
      ),
    createdOn: Joi.date().required(),
    editStatus: {
      lastEditOn: Joi.date().required(),
      lastEditBy: myJoiObjectId().required(),
    },
  },
});

export default programValidator;
