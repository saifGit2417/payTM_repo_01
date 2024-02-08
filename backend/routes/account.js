import express from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { AccountDetails } from "../db/index.js";

const accountRouter = express.Router();

accountRouter.get("/balance", authMiddleware, async (req, res) => {
  const { userId } = req;
  const fetchBankBalanceByUserId = await AccountDetails.findOne({ userId });
  res.json({
    message: "balance fetched successfully",
    balance: fetchBankBalanceByUserId.balance,
  });
});

// accountRouter.post("/transfer", authMiddleware, async (req, res) => {
//   console.log("entered");
//   const session = await mongoose.startSession();
//   console.log("entered 1");

//   session.startTransaction();
//   const { amount, to } = req.body;
//   console.log("entered 2");

//   // Fetch the accounts within the transaction
//   const account = await AccountDetails.findOne({ userId: req.userId }).session(
//     session
//   );
//   console.log("entered 3");

//   if (!account || account.balance < amount) {
//     await session.abortTransaction();
//     return res.status(400).json({
//       message: "Insufficient balance",
//     });
//   }
//   console.log("entered 4");

//   const toAccount = await AccountDetails.findOne({ userId: to }).session(
//     session
//   );
//   console.log("entered 5");

//   if (!toAccount) {
//     await session.abortTransaction();
//     return res.status(400).json({
//       message: "Invalid account",
//     });
//   }

//   // Perform the transfer
//   await AccountDetails.updateOne(
//     { userId: req.userId },
//     { $inc: { balance: -amount } }
//   ).session(session);

//   await AccountDetails.updateOne(
//     { userId: to },
//     { $inc: { balance: amount } }
//   ).session(session);

//   // Commit the transaction
//   await session.commitTransaction();
//   res.json({
//     message: "Transfer successful",
//   });
// });

export default accountRouter;
