import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import indexRoute from "./routes/index.routes.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
const app = express();

dotenv.config({});
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api", indexRoute);

app.use(function (err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
  });
});
app.use(errorMiddleware)
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route Not Found",
    success: false,
  });
});
export default app;
