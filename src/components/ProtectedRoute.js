import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthConext";
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useContext(AuthContext);
  console.log(isAuthenticated);
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
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
