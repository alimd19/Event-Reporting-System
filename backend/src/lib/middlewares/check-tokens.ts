import { RequestHandler } from "express";
import errorHandler from "./errorHandler";
import * as codes from "http-status-codes";

import RefreshToken from "../../models/rt.model";
import { ExpirationStatus } from "../types/token.types";
import { TAlgorithm, decode } from "jwt-simple";
import { checkExpirationStatus, createToken } from "./tokenHandlers";

export const checkAuthToken: RequestHandler = (req, res, next) => {
  const unauthorized = (message: string) => {
    return errorHandler(message, codes.UNAUTHORIZED, next);
  };

  // Always use HS512 to decode the token
  const algorithm: TAlgorithm = "HS512";
  const at = req.cookies.at;

  // Check if Auth-token is present
  if (!at) return unauthorized("Required auth-token not found.");

  try {
    // Verify Auth-token
    const decodedAuthToken = decode(
      at,
      process.env.AUTH_TOKEN_SECRET!,
      false,
      algorithm
    );

    // Check expiration of Auth-token
    const authExpiration: ExpirationStatus = checkExpirationStatus(
      decodedAuthToken
    );

    if (authExpiration === "expired") {
      // Check if Request-token is present
      const rt = req.cookies.rt;
      if (!rt)
        return unauthorized("Refersh token not provided. Please log in again.");

      try {
        // Verify Refresh-token
        const decodedRefreshToken = decode(
          rt,
          process.env.REFRESH_TOKEN_SECRET!,
          false,
          algorithm
        );

        // Check expiration of Refersh-token
        const refreshExpiration: ExpirationStatus = checkExpirationStatus(
          decodedRefreshToken
        );

        if (refreshExpiration === "expired") {
          // Delete Refresh-token from db if expired
          RefreshToken.findOneAndDelete({ token: rt })
            .then(() => {
              return unauthorized("Session expired. Please log in again.");
            })
            .catch(next);
        } else if (refreshExpiration === "active") {
          // If Refersh-token is still active find the Refresh-token in db
          RefreshToken.findOne({ token: rt })
            .lean()
            .then((refreshToken) => {
              // Check if Refresh-token was found
              if (!refreshToken)
                return unauthorized(
                  "Refresh token not found in db. Please log in again."
                );

              // Create new token and set as a cookie
              const newAuthToken = createToken(
                process.env.AUTH_TOKEN_SECRET!,
                { type: refreshToken!.type },
                1
              );

              // Set userType for authorization
              req.userType = decodedAuthToken.type;

              // Reset auth-token
              res.cookie("at", newAuthToken, {
                // httpOnly: true,
                // maxAge: 60,
                // secure: true,
              });
              return next();
            })
            .catch(next);
        }
      } catch (error) {
        return unauthorized("Please log in again.");
      }
    } else if (authExpiration === "active") {
      // Set userType for authorization
      req.userType = decodedAuthToken.type;
      next();
    }
  } catch (_e) {
    const e: Error = _e;

    // These error strings can be found here:
    // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
    if (
      e.message === "No token supplied" ||
      e.message === "Not enough or too many segments"
    ) {
      return unauthorized("Invalid token");
    }

    if (
      e.message === "Signature verification failed" ||
      e.message === "Algorithm not supported"
    ) {
      return unauthorized("Cannot process token");
    }

    // Handle json parse errors, thrown when the payload is nonsense
    if (e.message.indexOf("Unexpected token") === 0) {
      return unauthorized("Invalid token");
    }
  }
};
