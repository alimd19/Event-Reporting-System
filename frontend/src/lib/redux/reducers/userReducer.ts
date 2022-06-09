import { User, UserActionTypes } from "../../types/user.types";

const initState: User = {
  username: "",
  userId: "",
  userType: "",
  location: {
    jklc: "",
    localBoard: "",
    regionalBoard: "",
  },
  budgetId: "",
};

const userReducer = (state = initState, action: UserActionTypes): User => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        username: action.user.username,
        userId: action.user.userId,
        userType: action.user.userType,
        budgetId: action.user.budgetId,
        location: action.user.location,
      };
    default:
      return state;
  }
};

export default userReducer;
