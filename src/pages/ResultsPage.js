import React, { useContext } from "react";
import ResultBox from "../components/ResultBox";
import { AuthContext } from "../contexts/AuthConext";

export default function ResultsPage() {
  const {
    user: { elections },
  } = useContext(AuthContext);
  return (
    <div className="results-page container">
      <h3 className="container-title">Here are your election results:</h3>
      {elections.map((election) => (
        <ResultBox election={election} />
      ))}
    </div>
  );
}
