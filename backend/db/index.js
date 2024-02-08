import mongoose, { Schema } from "mongoose";
import { DB_URL } from "../config.js";

mongoose
  .connect(
    `mongodb+srv://saif100x:5PVhSqYJ9G9nU3Nb@100xcluster.gdbofct.mongodb.net/` ||
      DB_URL
  )
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

const bankDetailsSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true },
});

const User = mongoose.model("Users", userSchema);
const AccountDetails = mongoose.model("AccountDetails", bankDetailsSchema);

export { User, AccountDetails };
