import mongoose from "mongoose";
import { Center } from "../lib/types/index";

const CenterSchema: mongoose.Schema<Center> = new mongoose.Schema({
  jklc: { type: String, required: true },
  localBoard: { type: String, required: true },
  regionalBoard: { type: String, required: true },
});

export default CenterSchema;
