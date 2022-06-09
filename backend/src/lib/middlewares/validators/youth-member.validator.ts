import Joi from "joi";
import JoiObjectId from "joi-objectid";
import { IYouth_Member } from "../../types/youth-members.types";
import centerValidator from "./center.validator";

const myJoiObjectId = JoiObjectId(Joi);

// Validators for youth member input data
const youthMemberValidator: Joi.ObjectSchema<IYouth_Member> = Joi.object({
  basic: {
    firstName: Joi.string().required(),
    middleName: Joi.string(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    image: Joi.string(),
    itrebId: Joi.number().required(),
    gender: Joi.string().valid("male", "female").required(),
  },
  contact: {
    email: Joi.string().email().required(),
    phone: Joi.string().regex(
      /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
    ),
  },
  center: centerValidator,
  editStatus: {
    lastEditOn: Joi.date().required(),
    lastEditBy: myJoiObjectId().required(),
  },
});

export default youthMemberValidator;
