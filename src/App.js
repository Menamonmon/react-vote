import React, { useState } from "react";
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./css/App.css";

import Nav from "./components/Nav";
import Election from "./components/Election";
// import Footer from './components/Footer';
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import Votes from "./pages/Votes";
import Results from "./pages/Results";
import Home from "./pages/Home";
import LogoutPage from "./pages/LogoutPage";

import { validatePasswords } from "./helperfunctions/passwordValidations";

const initialAppState = {
  isLoggedIn: false,
  loginToken: "",
	APIUrl: "http://localhost:8000/",
	electionsData: [],
	votes: [],
};

function generateElectionSlug(type, state, year) {
	return `${state.toLowerCase()}-${type.toLowerCase()}-${year}`;
}

function parseElectionsData(electionsData) {
	if (electionsData.length === 0) {
		return { ElectionRoutes: [], electionLinks: [] };
	} 
	const elections = electionsData.map(({ _type, id, state, year, candidate_set }) => (<Election type={_type} id={id} state={state} year={year} candidates={candidate_set} />));
	const links = [];
	const routes = electionsData.map(({ _type, state, year, id }, i) => {
		const path = `/elections/${generateElectionSlug(_type, state, year)}`;
		const content = `${_type} (${state} ${year})`;
		links.push({ path, content });
		return (
			<Route exact path={path} key={id}>
				{elections[i]}
			</Route>);
	});

	return { ElectionRoutes: routes, electionLinks: links };
}


function getElections(url, userToken, onSuccess) {
	axios.get(url, {
		headers: {
			'Authorization': `Token ${userToken}`,
		}
	})
		.then((res) => {
			onSuccess(res.data);
	})
		.catch((err) => {
			console.log(err);
	})
}

export default function App() {
	let [appState, setAppState] = useState(initialAppState);
	
	const formOnSubmit = (token) => {
		setAppState(prev => ({
			...prev,
			isLoggedIn: true,
			loginToken: token,
		}));
		getElections(`${appState.APIUrl}elections/`, appState.loginToken, (electionsData) => {
			setAppState(prev => ({ ...prev, electionsData }));
		});
		console.log(appState);
	}

	const { ElectionRoutes, electionLinks } = parseElectionsData(appState.electionsData);
  return (
    <div className="App">
      <Router>
        <Nav electionLinks={electionLinks} />
        <Switch>
          <Route exact path="/" component={Home} key="home" />
          <Route exact path="/login" key="login">
            <LoginForm
              passvalidation={validatePasswords}
              loginurl={`${appState.APIUrl}accounts/login/`}
							onSubmit={formOnSubmit}
            />
          </Route>
          <Route exact path="/logout" key="logout">
            <LogoutPage />
          </Route>
          <Route exact path="/signup" component={SignupForm} key="signup" />
          <Route exact path="/results" component={Results} key="results" />
					<Route exact path="/votes" component={Votes} key="votes" />
					{ElectionRoutes}
        </Switch>
      </Router>
    </div>
  );
}
