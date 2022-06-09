export const SET_LOCATION = "SET_LOCATION";

export interface Location {
  jklc?: string;
  localBoard?: string;
  regionalBoard?: string;
}

export interface SetLocationAction {
  type: typeof SET_LOCATION;
  location: Location | undefined;
}

export type LocationActionTypes = SetLocationAction;
