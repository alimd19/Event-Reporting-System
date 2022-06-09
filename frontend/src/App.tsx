import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { connect } from "react-redux";
import { User } from "./lib/types/user.types";
import { AppState } from "./lib/redux/store";
import LocationPicker from './components/LocationPicker';

interface AppProps {}

type Props = AppProps & LinkStateProps;

const App: React.FC<Props> = (props) => {
  let routes;

  if (!props.user.userId) {
    routes = (
      <Switch>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Dashboard username={props.user.username}>
            <LocationPicker />
          </Dashboard>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <React.Fragment>
      <Router>
        <main>{routes}</main>
      </Router>
    </React.Fragment>
  );
};

interface LinkStateProps {
  user: User;
}

const mapStateToProps = (state: AppState, props: AppProps): LinkStateProps => ({
  user: state.user,
});

export default connect(mapStateToProps)(App);
