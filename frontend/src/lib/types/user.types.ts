import { Location } from "./location.types";

export const SET_USER = "SET_USER";

export interface User {
  username: string;
  location?: Location;
  userId: string;
  budgetId: string;
  userType: string;
}

export interface SetUserAction {
  type: typeof SET_USER;
  user: User;
}

export type UserActionTypes = SetUserAction;
