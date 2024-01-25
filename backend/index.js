import express from "express";
import indexRouter from "./routes/index.js";
import { PORT_NUMBER } from "./config.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", indexRouter);

app.listen(PORT_NUMBER, () => {
  console.log(`port running at ${PORT_NUMBER}`);
});
