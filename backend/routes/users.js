import express from "express";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AccountDetails, User } from "../db/index.js";
import {
  validateSignInDetails,
  validateSignUpDetails,
  validateUpdateUser,
} from "../middlewares/user_middleware.js";
import { JWT_SECRET_KEY } from "../config.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
const userRouter = express.Router();
const saltRounds = 10;
//*=========================================Pointers=========================================//
/*
  ->when ever sending response use return , so it can handle multiple request without any headers stating to set multiple headers

  ->while saving new entry in db key value should be send 
      keys   > which are defined in db schema
      values > which is going to be saved in db

  ->when password are stored by hashing we have to search user based on username/email only which are unique

  -> to create hash > await bcrypt.hash -> this can be done asynchronously using hashSync
  -> same goes for compare -> can use compareSync
*/
//=========================================Pointers=========================================*//

userRouter.post("/signup", validateSignUpDetails, async (req, res) => {
  const { userName, firstName, lastName, password } = req.body;
  try {
    let userNameExist = await User.find({ userName });
    if (userNameExist.length > 0) {
      res.status(411).json({ message: "username/email is already taken " });
    } else {
      // const hashedPassword = await bcrypt.hash(password, saltRounds);
      const hashedPassword = bcrypt.hashSync(password, saltRounds);

      let createUser = await User.create({
        userName,
        firstName,
        lastName,
        password: hashedPassword,
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
    let findUser = await User.findOne({ userName });
    const userId = findUser._id;
    const storedPassword = findUser?.password;
    if (!findUser) {
      return res.json({
        message: `No user found with username userName ${userName}`,
      });
    } else {
      const passwordMatch = bcrypt.compareSync(password, storedPassword);
      if (!passwordMatch) {
        return res.status(400).json({ message: "password is incorrect" });
      }
      let createJwt = jsonwebtoken.sign({ userId }, JWT_SECRET_KEY);
      return res.json({
        message: "logged in successfully",
        token: createJwt,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong", error: error.message });
  }
});

userRouter.put(
  "/updateExistingDetails",
  validateUpdateUser,
  authMiddleware,
  async (req, res) => {
    try {
      const { firstName, lastName, password } = req.body;
      let hashedPassword;
      if (password) {
        hashedPassword = bcrypt.hashSync(password, saltRounds);
      }
      const filterCriteria = { _id: req.userId };
      const updatedFields = { firstName, lastName };
      if (hashedPassword) {
        updatedFields.password = hashedPassword;
      }
      await User.updateOne(filterCriteria, { $set: updatedFields });
      res.json({ message: "user details updated successfully" });
    } catch (error) {
      console.log(error);
      res.json({ error: error.message });
    }
  }
);

userRouter.get("/user/bulk", async (req, res) => {
  /*
  paytm100x.vercel.app/api/v1/user/user/bulk?filter=saif >> api url
  */
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
