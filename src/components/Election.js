import React, { useContext, useEffect, useState } from "react";
import { submitVote } from "../helpers/requests";
import { AuthContext } from "../contexts/AuthConext";

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

  const {
    APIUrl,
    syncUserData,
    user: { votes },
  } = useContext(AuthContext);

  useEffect(() => {
    loadVotes(votes);
  }, []);

  let [currentCandidate, setCurrentCandidate] = useState({});
  let [checkedCandidates, setCheckedCandidates] = useState(
    Array(candidates.length).fill(false)
  );

  function loadVotes(votes) {
    for (const vote of votes) {
      if (vote.election.id === id) {
        const candidate_id = vote.candidate.id;
        const matchingCandidates = candidates.filter(
          (candidate) => candidate.id === candidate_id
        );
        if (matchingCandidates.length !== 1) {
          throw Error("Candidate ID Not Valid");
        }
        const candidate = matchingCandidates[0];
        const candidateIndex = candidates.indexOf(candidate);
        setCheckedCandidates((p) => {
          const prevCandidateIndex = candidates.indexOf(currentCandidate);
          p[prevCandidateIndex] = false;
          p[candidateIndex] = true;
          return p;
        });
        setCurrentCandidate(candidate);

        return;
      }
    }
  }

  function submitElectionVote() {
    const data = {
      election_id: id,
      candidate_id: currentCandidate.id,
    };
    if (Object.values(data).includes(undefined)) return;
    submitVote(APIUrl, data).then(() => {
      syncUserData();
    });
  }

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
        {candidates.map((candidate, index) => {
          const { name, party, id } = candidate;
          const onClick = () => {
            setCurrentCandidate(candidate);
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
      <div className="election-footer">
        <CurrentCandidate name={currentCandidate.name} />
        <button
          className="election-submit-btn form-submit-btn"
          onClick={submitElectionVote}
        >
          Submit Vote
        </button>
      </div>
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
