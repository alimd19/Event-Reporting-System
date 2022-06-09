import { createStore, combineReducers, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk, { ThunkMiddleware } from "redux-thunk";
import userReducer from "./reducers/userReducer";
import { AppActions } from "../types";
import locationReducer from './reducers/locationReducer';

const rootReducer = combineReducers({
  user: userReducer,
  location: locationReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(
  rootReducer,
  applyMiddleware(logger, thunk as ThunkMiddleware<AppState, AppActions>)
);
