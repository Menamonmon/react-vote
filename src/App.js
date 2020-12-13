import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './css/App.css';

import Nav from './components/Nav';
import CandidatesContainer from './components/CandidatesContainer';
// import Footer from './components/Footer';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import Votes from './pages/Votes';
import Results from './pages/Results';
import Home from './pages/Home';

import { validatePasswords } from './helperfunctions/passwordValidations';

class Candidate {
  constructor(candName, party) {
    this.candName = candName;
    this.party = party;
  }
}

const demo = [new Candidate('Donald Trump', 'Republican'), new Candidate('Joe Biden', 'Democratic'), new Candidate('Louis Harrison', 'Green')];

const elections = [
  <CandidatesContainer
    candidates={demo}
    electionType={"presidential"}
  />,
  <CandidatesContainer
    candidates={demo}
    electionType={"congressional"}
  />,
  <CandidatesContainer
    candidates={demo}
    electionType={"senate"}
  />
]

export default function App() {
  const electionData = elections.map(e => e.props.electionType);
  const electionLinks = electionData.map(
    election => ({ content: election, path: `/elections/${election}` })
  );
  return (
    <div className="App">
      <Router>
        <Nav electionLinks={electionLinks} />
        <Switch>
          <Route exact path="/" component={Home} key={0} />
          <Route exact path="/login" key={1}>
            <LoginForm passvalidation={validatePasswords} onSubmit={() => {}} />
          </Route>
          <Route exact path="/signup" component={SignupForm} key={2} />
          <Route exact path="/results" component={Results} key={3} />
          <Route exact path="/votes" component={Votes} key={4} />
          {
            electionLinks.map(
              ({ path }, index) => (<Route exact path={path} component={() => elections[index]} key={index + 5}/>)
            )
          }
        </Switch>
      </Router>
    </div>
  );
}