import React from "react";
import { Link } from "react-router-dom";

export function DropdownMenuLinks(props) {
  const { links } = props;
  return (
    <ul className="dropdownmenu-links">
      {links.map(({ content, path }, index) => (
        <Link to={path} key={index}>
          <li className="dropdownmenu-link" key={content}>
            {content}
          </li>
        </Link>
      ))}
    </ul>
  );
}

export default function DropdownMenu(props) {
  const { links, children } = props;

  return (
    <div className="dropdownmenu">
      {children}
      {links.length === 0 ? <></> : <DropdownMenuLinks links={links} />}
    </div>
  );
}
