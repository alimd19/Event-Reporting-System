import mongoose from "mongoose";
import IUser from "../lib/types/user.types";

const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true, enum: ["nt", "rg", "lc", "jk"] },
  location: {
    region: { type: String, required: true },
    lb: { type: String },
    jklc: { type: String },
  },
  budget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    required: true,
  },
});

const User: mongoose.Model<IUser> = mongoose.model("User", UserSchema);

export default User;
