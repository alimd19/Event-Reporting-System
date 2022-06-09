import mongoose from "mongoose";

export interface RT extends mongoose.Document {
  token: string;
  type: string;
}

export interface Session {
  type: string;
  /**
   * Timestamp indicating when the session was created, in Unix milliseconds.
   */
  issued: number;
  /**
   * Timestamp indicating when the session should expire, in Unix milliseconds.
   */

  expires: number;
}

/**
 * Identical to the Session type, but without the `issued` and `expires` properties.
 */
export type PartialSession = Omit<Session, "issued" | "expires">;

export type EncodeResult = string;

export type ExpirationStatus = "expired" | "active";
