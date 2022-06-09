import Joi from "joi";
import JoiObjectId from "joi-objectid";
import { Center } from "../../types";

const myJoiObjectId = JoiObjectId(Joi);

const centerValidator: Joi.ObjectSchema<Center> = Joi.object({
  jklc: Joi.string().required(),
  localBoard: Joi.string().required(),
  regionalBoard: Joi.string().required(),
});

export default centerValidator;
