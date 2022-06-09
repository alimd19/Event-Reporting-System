import { User } from "../../types/user.types";
import { AppActions } from "../../types";
import { Dispatch } from "redux";
import { AppState } from "../store";

export const setUser = (user: User): AppActions => {
  return {
    type: "SET_USER",
    user,
  };
};

export const startSetUser = (user: User) => {
  return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    dispatch(setUser(user));
  };
};
