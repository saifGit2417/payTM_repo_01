import express from "express";
import userRouter from "./users.js";
import accountRouter from "./account.js";
const indexRouter = express.Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/account", accountRouter);

export default indexRouter;
