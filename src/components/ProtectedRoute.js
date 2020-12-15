import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function ProtectedRoute({ component: Component, authcb, ...rest }) {
	
  return (
    <Route
      {...rest}
      render={(props) => {
        if (authcb()) {
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
