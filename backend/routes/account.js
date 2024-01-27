import express from "express";
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

export default accountRouter;
