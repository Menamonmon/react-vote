import React, { useContext } from "react";
import { electionsList } from "./Election";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "../contexts/AuthConext";

export default function ElectionRoutes() {
  const {
    user: { electionLinks, elections },
  } = useContext(AuthContext);
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

  // const routes = electionsData.map(({ _type, state, year, id }, i) => {
  //   const path = `/elections/${generateElectionSlug(_type, state, year)}`;
  //   const content = `${_type} (${state} ${year})`;
  //   links.push({ path, content });
  //   return (
  //     <RouteComponent exact path={path} key={id}>
  //       {elections[i]}
  //     </RouteComponent>
  //   );
  // });
}
