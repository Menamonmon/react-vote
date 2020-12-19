import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthConext";

export default function LogoutPage() {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="logout-page auth-form">
      <h2 className="auth-form-title logout-title">Logout</h2>
      <h5 className="logout-content">You are successfully logged out.</h5>
      <div className="logout-footer">
        <Link to="/login" key="login">
          Login again.
        </Link>
        <br />
        Don't have an account?{" "}
        <Link to="/signup" key="signup">
          Sign up
        </Link>{" "}
        from here.
      </div>
    </div>
  );
}
