import axios from 'axios';

function generateElectionSlug(type, state, year) {
  return `${state.toLowerCase()}-${type.toLowerCase()}-${year}`;
}

function parseElectionsData(electionsData, ElectionComponent, RouteComponent) {
  if (electionsData.length === 0) {
    return { ElectionRoutes: [], electionLinks: [] };
  }
  const elections = electionsData.map(
    ({ _type, id, state, year, candidate_set }) => (
      <ElectionComponent
        type={_type}
        id={id}
        state={state}
        year={year}
        candidates={candidate_set}
      />
    )
  );
  const links = [];
  const routes = electionsData.map(({ _type, state, year, id }, i) => {
    const path = `/elections/${generateElectionSlug(_type, state, year)}`;
    const content = `${_type} (${state} ${year})`;
    links.push({ path, content });
    return (
      <RouteComponent exact path={path} key={id}>
        {elections[i]}
      </RouteComponent>
    );
  });

  return { ElectionRoutes: routes, electionLinks: links };
}


function getElections(url, userToken, onSuccess) {
  axios
    .get(url, {
      headers: {
        Authorization: `Token ${userToken}`,
      },
    })
    .then((res) => {
      onSuccess(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

export { getElections, parseElectionsData };
