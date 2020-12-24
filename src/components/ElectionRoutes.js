import React from "react";
import { electionsList } from "./Election";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../contexts/AuthConext";

export default function ElectionRoutes() {
  const {
    user: { electionLinks, elections },
  } = useAuth();
  const electionComponenets = electionsList(elections);
  return (
    <>
      {electionLinks.map(({ path }, index) => {
        const { id } = elections[index];
        const ElectionComponenet = () => electionComponenets[index];
        return (
          <ProtectedRoute
            exact
            path={path}
            key={id}
            redirect="/"
            component={ElectionComponenet}
          />
        );
      })}
    </>
  );
}
