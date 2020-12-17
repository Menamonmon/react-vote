import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthConext";
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { auth } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth.isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: props.redirect,
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
}
