import { Location, LocationActionTypes } from "../../types/location.types";

const initState: Location = {
  jklc: "",
  regionalBoard: "",
  localBoard: "",
};

const locationReducer = (
  state: Location = initState,
  action: LocationActionTypes
) => {
  switch (action.type) {
    case "SET_LOCATION":
      return {
        ...state,
        jklc: action.location?.jklc,
        localBoard: action.location?.localBoard,
        regionalBoard: action.location?.regionalBoard,
      };
    default:
      return state;
  }
};

export default locationReducer;
