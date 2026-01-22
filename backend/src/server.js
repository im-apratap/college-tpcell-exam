import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({
    message: "Hi I am working",
  });
});

import userRouter from "./routes/auth.route.js";
import questionRouter from "./routes/question.route.js";
import testRouter from "./routes/test.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/test", testRouter);

const startServer = async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log(`Server runnin on port ${ENV.PORT}`);
      });
    }
  } catch (e) {
    console.log("Error connecting to Server", e);
    process.exit(1);
  }
};

startServer();
