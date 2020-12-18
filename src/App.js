import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./css/App.css";

import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import Votes from "./pages/Votes";
import Results from "./pages/Results";
import Home from "./pages/Home";
import LogoutPage from "./pages/LogoutPage";

import { validatePasswords } from "./helpers/passwordValidations";

import { AuthProvider } from './contexts/AuthConext';
import ElectionRoutes from "./components/ElectionRoutes";

export default function App() {
  const APIUrl = "http://localhost:8000/";

  return (
    <div className="App">
      <Router>
        <AuthProvider APIUrl={APIUrl}>
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} key="home" />
            <Route exact path="/login" key="login">
              <LoginForm
                passvalidation={validatePasswords}
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
            />
            <ProtectedRoute
              exact
              path="/results"
              redirect="/"
              component={Results}
              key="results"
            />
            <ProtectedRoute
              exact
              path="/votes"
              redirect="/"
              component={Votes}
              key="votes"
            />
            <ElectionRoutes />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}
