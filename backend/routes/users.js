import express from "express";
import { User } from "../db/index.js";
import {
  validateSignInDetails,
  validateSignUpDetails,
} from "../middlewares/user_middleware.js";
import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
const userRouter = express.Router();

userRouter.post("/signup", validateSignUpDetails, async (req, res) => {
  const { userName, firstName, lastName, password } = req.body;
  try {
    let userNameExist = await User.find({ userName });
    if (userNameExist.length > 0) {
      res.status(411).json({ message: "username/email is already taken " });
    } else {
      let createUser = await User.create({
        userName,
        firstName,
        lastName,
        password,
      });
      const userId = createUser._id;
      let createJwtToken = jsonwebtoken.sign({ userId }, JWT_SECRET);
      res.json({
        message: "new user created Successfully",
        token: createJwtToken,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "something went wrong", error: error.message });
  }
});

userRouter.post("/signIn", validateSignInDetails, async (req, res) => {
  const { userName, password } = req.body;
  try {
    let findUser = await User.findOne({ userName, password });
    const userId = findUser._id;
    if (findUser.length <= 0) {
      res.json({ message: "no user found with username", userName });
    } else {
      let createJwt = jsonwebtoken.sign({ userId }, JWT_SECRET);
      res.json({
        message: "logged in successfully",
        jwt: createJwt,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "something went wrong", error: error.message });
  }
});

export default userRouter;
