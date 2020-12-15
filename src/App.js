import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./css/App.css";

import Nav from "./components/Nav";
import Election from "./components/Election";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import Votes from "./pages/Votes";
import Results from "./pages/Results";
import Home from "./pages/Home";
import LogoutPage from "./pages/LogoutPage";

import { validatePasswords } from "./helpers/passwordValidations";
import { getElections, parseElectionsData } from './helpers/elections';

const initialAppState = {
  isLoggedIn: false,
  loginToken: "",
  APIUrl: "http://localhost:8000/",
	electionsData: [],
	electionLinks: [],
  votes: [],
};

export default function App() {
  let [appState, setAppState] = useState(initialAppState);

  const formOnSubmit = (token) => {
    setAppState((prev) => ({
      ...prev,
      isLoggedIn: true,
      loginToken: token,
    }));
    getElections(
      `${appState.APIUrl}elections/`,
      appState.loginToken,
      (electionsData) => {
        setAppState((prev) => ({ ...prev, electionsData }));
      }
    );
    console.log(appState);
  };

	const isAuthenticated = () => appState.isLoggedIn;

  const { ElectionRoutes, electionLinks } = parseElectionsData(
    appState.electionsData, Election, Route
  );
  return (
    <div className="App">
      <Router>
        <Nav loggedin={appState.isLoggedIn} electionLinks={electionLinks} />
        <Switch>
          <Route exact path="/" component={Home} key="home" />
          <Route exact path="/login" key="login">
            <LoginForm
              passvalidation={validatePasswords}
              loginurl={`${appState.APIUrl}accounts/login/`}
              onSubmit={formOnSubmit}
              redirect="/"
            />
          </Route>
          <Route exact path="/signup" component={SignupForm} key="signup" />
          <ProtectedRoute
            exact
            path="/logout"
            redirect="/"
            component={LogoutPage}
            key="logout"
            authcb={isAuthenticated}
          />
          <ProtectedRoute
            exact
            path="/results"
            redirect="/"
            component={Results}
            key="results"
            authcb={isAuthenticated}
          />
          <ProtectedRoute
            exact
            path="/votes"
            redirect="/"
            component={Votes}
            key="votes"
            authcb={isAuthenticated}
          />
          {ElectionRoutes}
        </Switch>
      </Router>
    </div>
  );
}
