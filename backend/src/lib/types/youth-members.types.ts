import mongoose from "mongoose";
import { EditStatus, Center } from ".";

interface BasicDetails {
  firstName: string;
  middleName?: string;
  lastname: string;
  dateOfBirth: Date;
  image?: string;
  itrebId: number;
  gender: Gender;
}

enum Gender {
  MALE = "male",
  FEMALE = "female",
}

interface Contact {
  email?: string;
  phone?: string;
}

export interface IYouth_Member extends mongoose.Document {
  basic: BasicDetails;
  contact: Contact;
  center: Center;
  editStatus: EditStatus;
}
