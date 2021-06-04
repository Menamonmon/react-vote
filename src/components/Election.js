import React, { useEffect, useState } from "react";
import { deleteVote, submitVote } from "../helpers/requests";
import { useAuth } from "../contexts/AuthConext";

export function CandidateBox(props) {
  const { name, party, checked } = props;
  return (
    <div
      className={`container-btn candidate-box ${checked ? "checked" : ""}`}
      onClick={props.onClick}
    >
      <h5 className="title">{`${name} (${party})`}</h5>
    </div>
  );
}

const CurrentCandidate = ({ name }) => (
  <h4 className="container-subtitle current-candidate">
    {name ? `Chosen Candidate: ${name}` : "No Candidate Chosen Yet"}
  </h4>
);

function ElectionFooter({ currentCandidate, onSubmit, onDelete }) {
  return (
    <div className="election-footer">
      <CurrentCandidate name={currentCandidate.name} />
      <button
        className="election-delete-btn container-btn form-submit-btn"
        onClick={onDelete}
      >
        Clear Vote
      </button>
      <button
        className="election-submit-btn container-btn form-submit-btn"
        onClick={onSubmit}
      >
        Submit Vote
      </button>
    </div>
  );
}

export default function Election(props) {
  const { type, id, state, year, candidates } = props;

  const {
    APIUrl,
    syncUserData,
    user: { votes },
  } = useAuth();

  useEffect(() => {
    setVote(loadVotes(votes));
  }, [loadVotes, votes]);

  let [currentCandidate, setCurrentCandidate] = useState({});
  let [vote, setVote] = useState({});
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
        return vote;
      }
    }
    setCheckedCandidates(Array(candidates.length).fill(false));
  }

  function submitElectionVote() {
    const data = {
      election_id: id,
      candidate_id: currentCandidate.id,
    };
    if (Object.values(data).includes(undefined)) return;
    submitVote(APIUrl, data).then(() => {
      syncUserData().then(() => {
        setVote(loadVotes(votes));
      });
    });
  }

  function deleteElectionVote() {
    if (vote === undefined) {
      setVote(loadVotes(votes));
      return;
    }
    if (vote.id === undefined) return;
    deleteVote(APIUrl, vote.id).then(() => {
      syncUserData().then(() => {
        setVote(loadVotes(votes));
      });
    });
  }

  return (
    <div className="election-container container" key={id}>
      <h3 className="election-type container-title">
        {`${state} ${type} Elections (${year}):`}
      </h3>
      <h4 className="container-subtitle">
        Choose One of The Candidates Below:
      </h4>
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
      <ElectionFooter
        currentCandidate={currentCandidate}
        onSubmit={submitElectionVote}
        onDelete={deleteElectionVote}
      />
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
