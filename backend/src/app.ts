import express, { Request, Response, NextFunction, Application } from "express";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import * as codes from "http-status-codes";
import cors from "cors";

// Route imports
import programRoutes from "./routes/program.routes";
import youthMemberRoutes from "./routes/youth-member.routes";
import authRoutes from "./routes/auth.routes";
import budgetRoutes from "./routes/budget.routes";

// Middleware imports
import { checkAuthToken } from "./lib/middlewares/check-tokens";
import errorHandler from "./lib/middlewares/errorHandler";

// Type imports
import { MyError } from "./lib/types";
import addBudget from "./addBudgetInUsers";

// Config
const app: Application = express();
dotenv.config();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );

  next();
});

// Auth routes
app.use("/auth", authRoutes);

// Protected routes
app.use(checkAuthToken);
app.use("/programs", programRoutes);
app.use("/youth-members", youthMemberRoutes);
app.use("/budget", budgetRoutes);

// Unknown path error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  return errorHandler("Path not Found", codes.NOT_FOUND, next);
});

// Error handler
app.use((err: MyError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  res.status(status).json({
    message,
  });
});

//Script for adding budgets to users
// addBudget();

// Connect to db and start server
mongoose
  .connect(
    `mongodb+srv://ali:${process.env.DB_PASS}@cluster0-ituac.mongodb.net/MIS?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      useFindAndModify: false,
    }
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Server started on port 3000");
      console.log("Status code:-", codes.OK);
    });
  })
  .catch((error: Error) => console.log(error));
