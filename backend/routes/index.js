import express from "express";
import userRouter from "./users.js";
const indexRouter = express.Router();

indexRouter.use(userRouter);

export default indexRouter;
