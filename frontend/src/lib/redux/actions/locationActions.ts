import { AppActions } from "../../types";
import { Dispatch } from "redux";
import { AppState } from "../store";
import { Location } from "../../types/location.types";

export const setLocation = (location: Location | undefined): AppActions => {
  return {
    type: "SET_LOCATION",
    location,
  };
};

export const startSetLocation = (location: Location | undefined) => {
  return (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    dispatch(setLocation(location));
  };
};
