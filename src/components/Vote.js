import React from "react";
import { Link } from "react-router-dom";

export default function Vote({ election, candidate, link }) {
  return (
    <Link
      to={link.path}
      title="Go to this election"
      style={{ textDecoration: "none" }}
    >
      <div className="vote-box container-btn">
        <h5 className="vote-subtitle">
          E: {`${election.state} ${election._type} (${election.year})`}
        </h5>
        <h5 className="vote-subtitle">
          C: {`${candidate.name} (${candidate.party})`}
        </h5>
      </div>
    </Link>
  );
}
