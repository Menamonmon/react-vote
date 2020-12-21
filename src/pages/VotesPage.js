import React, { useContext } from "react";
import Vote from "../components/Vote";
import { AuthContext } from "../contexts/AuthConext";

export default function VotesPage() {
  const {
    user: { votes, electionLinks },
  } = useContext(AuthContext);

  function getElectionLink(election, links) {
    const { id } = election;
    for (const link of links) {
      if (link.election_id === id) {
        return link;
      }
    }
    throw new Error("Election Link Not Found");
  }
  return (
    <div className="votes-page">
      <h1 className="auth-form-title">Here are your votes:</h1>
      {votes.map(({ id, election, candidate }) => (
        <Vote
          candidate={candidate}
          election={election}
          link={getElectionLink(election, electionLinks)}
          key={id}
        />
      ))}
    </div>
  );
}
