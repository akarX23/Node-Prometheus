import express from "express";
import dotenv from "dotenv";
import { httpRequestTimerMiddleware, register } from "./helpers/prometheus";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/metrics", httpRequestTimerMiddleware, async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
