import { encode, TAlgorithm } from "jwt-simple";
import {
  PartialSession,
  EncodeResult,
  Session,
  ExpirationStatus,
} from "../types/token.types";

export const createToken = (
  secretKey: string,
  partialSession: PartialSession,
  minutes: number
): EncodeResult => {
  // Always use HS512 to sign the token
  const algorithm: TAlgorithm = "HS512";

  // Determine when the token should expire
  const issued = Date.now();
  const minutesInMs = minutes * 60 * 1000;
  const expires = issued + minutesInMs;
  const session: Session = {
    ...partialSession,
    issued: issued,
    expires: expires,
  };

  const token = encode(session, secretKey, algorithm);

  return token;
};

export function checkExpirationStatus(token: Session): ExpirationStatus {
  const now = Date.now();

  if (token.expires > now) return "active";

  return "expired";
}
