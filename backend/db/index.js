import mongoose from "mongoose";
import { DB_URL } from "../config.js";

mongoose
  .connect(DB_URL)
  .then(() => console.log("db connected successfully"));

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    unique: true,
    trim: true,
  },
  firstName: String,
  lastName: String,
  password: {
    type: String,
    minLength: 5,
  },
});

const User = mongoose.model("Users", userSchema);

export {User}
