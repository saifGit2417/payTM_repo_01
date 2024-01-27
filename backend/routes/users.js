import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { AccountDetails, User } from "../db/index.js";
import {
  validateSignInDetails,
  validateSignUpDetails,
  validateUpdateUser,
} from "../middlewares/user_middleware.js";
import { JWT_SECRET_KEY } from "../config.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
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
      const generateRandomBankBalance = Math.floor(Math.random() * 10000);

      // this will update the account details adn add random balance between 0 to 10000 of user when user is created
      await AccountDetails.create({
        userId,
        balance: generateRandomBankBalance,
      });
      let createJwtToken = jsonwebtoken.sign({ userId }, JWT_SECRET_KEY);
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
      let createJwt = jsonwebtoken.sign({ userId }, JWT_SECRET_KEY);
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

userRouter.put("/updateExistingDetails", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    await User.updateOne(
      { firstName, lastName, password },
      { _id: req.userId }
    );
    res.json({ message: "user details updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
});

userRouter.get("/user/bulk", async (req, res) => {
  // this i need to grind more to understand how search query works in mongo db
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

userRouter.delete("/deleteAllRecords", async (req, res) => {
  await User.deleteMany({});
  await AccountDetails.deleteMany({});
  res.json({ message: "All records had been deleted successfully" });
});

export default userRouter;
