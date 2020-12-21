import React from "react";
import { Link } from "react-router-dom";

export default function Vote({ election, candidate, link }) {
  return (
    <Link to={link.path} style={{ textDecoration: "none" }}>
      <div className="vote-containter">
        <div className="vote-election-section">
          <h4 className="candidate-title">
            Election: {`${election.state} ${election._type} (${election.year})`}
          </h4>
        </div>
        <div className="vote-candidate-section">
          <h4 className="candidate-title">
            Candidate: {`${candidate.name} (${candidate.party})`}
          </h4>
        </div>
      </div>
    </Link>
  );
}
