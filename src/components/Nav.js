import React, { useState } from "react";
import { Link } from "react-router-dom";

import DropdownMenu from "./DropdownMenu";

/*

electionData template
[
    "election type"
]

electionLinks template
[
    { 
        content: "electio type".capitalized(),
        path: /elections/"election type"
    }
]

*/

function AuthenticatedNavLinks({ navToggled, electionLinks }) {
  return (
    <ul className={`nav-links ${navToggled ? "open" : ""}`}>
      <DropdownMenu links={electionLinks} key="elections">
        <li className="nav-link nav-link-btn">Elections</li>
      </DropdownMenu>
      <Link to="/results" key="results">
        <li className="nav-link nav-link-btn">Results</li>
      </Link>
      <Link to="/votes" key="votes">
        <li className="nav-link nav-link-btn">Your Votes</li>
      </Link>
      <Link to="/logout" key="logout">
        <li className="nav-link  nav-link-btn">Logout</li>
      </Link>
    </ul>
  );
}

function UnauthenticatedNavLinks({ navToggled }) {
  return (
    <ul className={`nav-links ${navToggled ? "open" : ""}`}>
      <Link to="/login" key="login">
        <li className="nav-link  nav-link-btn">Login</li>
      </Link>
      <Link to="/signup" key="signup">
        <li className="nav-link nav-link-btn">Sign Up</li>
      </Link>
    </ul>
  );
}

export default function Navbar({ electionLinks, loggedin }) {
  let [navToggled, setNavToggled] = useState(false);
  const toggle = () => {
    setNavToggled((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <h3 className="nav-logo">React Vote</h3>
      </Link>
      <div className={`hamburger ${navToggled ? "open" : ""}`} onClick={toggle}>
        <div className="line-1 line"></div>
        <div className="line-2 line"></div>
        <div className="line-3 line"></div>
        {loggedin ? (
          <AuthenticatedNavLinks
            navToggled={navToggled}
            electionLinks={electionLinks}
          />
        ) : (
          <UnauthenticatedNavLinks navToggled={navToggled} />
        )}
      </div>
    </nav>
  );
}
