import React from 'react';
import { Link } from 'react-router-dom';

export default function DropdownMenu(props) {
    const { links, children } = props;
    return (
        <div className="dropdownmenu">
            {children}
            <ul className="dropdownmenu-links">
                {links.map(({ content, path }, index) => (
                    <Link to={path} key={index}>
                        <li className="dropdownmenu-link" key={index}>
                            {content}
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
}