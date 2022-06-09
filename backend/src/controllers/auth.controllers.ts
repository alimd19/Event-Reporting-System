import { RequestHandler } from "express";
import * as codes from "http-status-codes";
import bcrypt from "bcrypt";

// Model imports
import User from "../models/user.model";
import RefreshToken from "../models/rt.model";

// Middleware imports
import { createToken } from "../lib/middlewares/tokenHandlers";
import errorHandler from "../lib/middlewares/errorHandler";
import { RT } from "../lib/types/token.types";

// LOGIN
export const login: RequestHandler = (req, res, next) => {
  const { username, password: toCheck } = req.body;

  User.findOne({ username })
    .lean()
    .then(async (user) => {
      // Checking if username exists in db
      if (!user) {
        return errorHandler("Invalid username!", codes.NOT_FOUND, next);
      }

      // Comparing passwords
      const hashedPassword = user!.password;
      const valid: boolean = await bcrypt.compare(toCheck, hashedPassword);
      if (!valid) return errorHandler("Invaild password!", codes.UNAUTHORIZED, next);

      // Creating new tokens
      const at = createToken(
        process.env.AUTH_TOKEN_SECRET!,
        { type: user!.type },
        1
      );
      const rt = createToken(
        process.env.REFRESH_TOKEN_SECRET!,
        { type: user!.type },
        60
      );

      // Create and save refresh token to db
      const newRefreshToken: RT = new RefreshToken({
        token: rt,
        type: user!.type,
      });

      newRefreshToken
        .save()
        .then(() => {
          // Assign tokens as cookies and send user data
          res
            .cookie("at", at, {
              httpOnly: true,
              // secure: true,
              maxAge: 60 * 60,
            })
            .cookie("rt", rt, {
              httpOnly: true,
              // secure: true,
              maxAge: 60 * 60 * 2,
            })
            .status(codes.OK)
            .json({
              username: user?.username,
              location: user?.location,
              userId: user?._id,
              budgetId: user?.budget,
              userType: user?.type,
            });
        })
        .catch(next);
    })
    .catch(next);
};

//LOGOUT
export const logout: RequestHandler = (req, res, next) => {
  // Find refresh token in db
  const rt: string = req.cookies.rt;
  RefreshToken.findOneAndDelete({ token: rt })
    .then(() => {
      // Clear all cookies and display "Logged out."
      res
        .status(codes.OK)
        .clearCookie("rt")
        .clearCookie("at")
        .json({ message: "Logged out." });
    })
    .catch(next);
};
