import React, { useState } from "react";

export function CandidateResult({ id, name, party, voteCount }) {
  return (
    <div className="candidate-result-box" key={id}>
      <h6 className="container-button container-subtitle">
        {`${name} (${party})`}
        <br />
        Vote Count: {voteCount}
      </h6>
    </div>
  );
}

export function ArrowButton({ toggled, onClick }) {
  return (
    <div onClick={onClick} className={`arrow-btn ${toggled ? "open" : ""}`}>
      ⯈
    </div>
  );
}

export function CandidatesResultsContainer({ toggled, candidates }) {
  return (
    <div className={`candidates-results-container ${toggled ? "open" : ""}`}>
      {candidates.map(({ id, name, party, vote_count }) => (
        <CandidateResult
          name={name}
          party={party}
          voteCount={vote_count}
          key={id}
        />
      ))}
    </div>
  );
}

export default function ResultBox({
  election: { _type, state, year, candidate_set },
}) {
  const [toggled, setToggled] = useState(false);
  function onToggle() {
    setToggled((prev) => !prev);
  }

  return (
    <div className="container-btn result-box" onClick={onToggle}>
      <div className="result-box-header" key="result-box-header">
        <h4 className="conatiner-subtitle">{`${_type} (${year} ${state})`}</h4>
        <ArrowButton toggled={toggled} />
      </div>
      <CandidatesResultsContainer
        candidates={candidate_set}
        toggled={toggled}
      />
    </div>
  );
}
