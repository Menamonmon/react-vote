import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthConext";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="logout-page auth-form container">
      <h2 className="auth-form-title logout-title container-title">Logout</h2>
      <h5 className="logout-content container-subtitle">
        You are successfully logged out.
      </h5>
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
