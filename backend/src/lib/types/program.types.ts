import mongoose from "mongoose";
import { IYouth_Member } from "./youth-members.types";
import { EditStatus } from "./index";

interface Centers {
  jklcs: string[];
  localBoards: string[];
  regionalBoard: string;
}

interface BaciscDetails {
  name: string;
  minAge: number;
  maxAge: number;
  subCategory?: string;
  startDate: Date;
  endDate: Date;
  venue?: string;
  centers: Centers;
}

interface Finances {
  income: {
    feePerHead: number;
    additionalIncome: number;
  };
  expenses: {
    postage: number;
    internet: number;
    stationary: number;
    equipment: number;
    printing: number;
    transport: number;
    localConveyance: number;
    venue: number;
    faculty: number;
    souvenir: number;
    food: number;
    cleaning: number;
    labour: number;
    medical: number;
    miscellaneous: number;
  };
}

interface ProgramState {
  status: string;
  createdOn: Date;
  editStatus: EditStatus;
}

export interface IProgram extends mongoose.Document {
  basic: BaciscDetails;
  finances: Finances;
  participants: {
    totalNumberOfParticipants: number;
    missingParticipants: number;
    partcipants: IYouth_Member["_id"][];
  };
  programState: ProgramState;
}
