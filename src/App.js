import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./css/App.css";

import Nav from "./components/Nav";
import ProtectedRoute, { UnprotectedRoute } from "./components/ProtectedRoute";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import VotesPage from "./pages/VotesPage";
import ResultsPage from "./pages/ResultsPage";
import Home from "./pages/Home";
import LogoutPage from "./pages/LogoutPage";

import { AuthProvider } from "./contexts/AuthConext";
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
            <UnprotectedRoute
              exact
              path="/login"
              redirect="/"
              component={LoginForm}
              key="login"
            />
            <UnprotectedRoute
              exact
              path="/signup"
              redirect="/"
              component={SignupForm}
              key="signup"
            />
            <Route
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
              component={ResultsPage}
              key="results"
            />
            <ProtectedRoute
              exact
              path="/votes"
              redirect="/"
              component={VotesPage}
              key="votes"
            />
            <ElectionRoutes />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}
