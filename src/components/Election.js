import React, { useState } from "react";

export function CandidateBox(props) {
  const { name, party, checked } = props;
  return (
    <div
      className={`candidate-box ${checked ? "checked" : ""}`}
      onClick={props.onClick}
    >
      <h5 className="title">{`${name} (${party})`}</h5>
    </div>
  );
}

const CurrentCandidate = ({ name }) => (
  <h4 className="current-candidate">
    {name ? `Chosen Candidate: ${name}` : "No Candidate Chosen Yet"}
  </h4>
);

export default function Election(props) {
  const { type, id, state, year, candidates } = props;

  let [currentCandidate, setCurrentCandidate] = useState("");
  let [checkedCandidates, setCheckedCandidates] = useState(
    Array(candidates.length).fill(false)
  );
  return (
    <div className="candidates-container" key={id}>
      {type ? (
        <div className="election-type-wrapper">
          <h3 className="election-type">{`${state} ${type} Elections (${year}):`}</h3>
        </div>
      ) : (
        ""
      )}
      <h4 className="title">Choose One of The Candidates Below:</h4>
      <ul className="candidates-list">
        {candidates.map(({ name, party, id }, index) => {
          const onClick = () => {
            setCurrentCandidate(name);
            setCheckedCandidates((prevState) => {
              prevState.fill(false);
              prevState[index] = true;
              return prevState;
            });
          };
          return (
            <CandidateBox
              checked={checkedCandidates[index]}
              name={name}
              party={party}
              onClick={onClick}
              key={id}
            />
          );
        })}
      </ul>
      <CurrentCandidate name={currentCandidate} />
    </div>
  );
}

export function electionsList(elections) {
  return elections.map(({ _type, id, state, year, candidate_set }) => (
    <Election
      type={_type}
      id={id}
      state={state}
      year={year}
      candidates={candidate_set}
    />
  ));
}
