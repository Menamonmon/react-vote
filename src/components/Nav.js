import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import DropdownMenu from './DropdownMenu'

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

export default function Navbar(props) {
    let [navToggled, setNavToggled] = useState(false);
    const toggle = () => { console.log('Clicked'); setNavToggled(prev => !prev); };

    return (
        <nav className="navbar">
            <Link to="/">
                <h3 className="nav-logo">React Vote</h3>
            </Link>            
            <div
                className={`hamburger ${navToggled ? "open" : ""}`}
                onClick={toggle}
            >
                    <div className="line-1 line"></div>
                    <div className="line-2 line"></div>
                    <div className="line-3 line"></div>
            </div>
            <ul className={`nav-links ${navToggled ? "open" : ""}`}>
                <DropdownMenu links={props.electionLinks} key={0}>
                    <li className="nav-link nav-link-btn" key={0}>
                        Elections
                    </li>
                </DropdownMenu>
                <Link to="/results" key={1}>
                    <li className="nav-link nav-link-btn" key={1}>
                        Results
                    </li>
                </Link>
                <Link to="/votes" key={2}>
                    <li className="nav-link nav-link-btn"  key={2}>
                        Your Votes
                    </li>
                </Link>
                <Link to="/signup"  key={3}>
                    <li className="nav-link nav-link-btn" key={3}>
                        Sign Up
                    </li>
                </Link>
                <Link to="/login" key={4}>
                    <li className="nav-link  nav-link-btn" key={4}>
                        Login
                    </li>
                </Link>
            </ul>
        </nav>
    );
}