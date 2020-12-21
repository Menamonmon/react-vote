import { generatePath } from "react-router-dom";

export function generateElectionLinks(elections) {
  const links = elections.map(({ _type, state, year, id }) => ({
    path: generatePath("/elections/:year/:state/:type", {
      year,
      state,
      type: _type,
    }),
    content: `${_type} (${state} ${year})`,
    election_id: id,
  }));
  console.log(links);
  return links;
}