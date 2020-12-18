import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

import { getUserData } from "../helpers/requests";
import { generateElectionLinks } from "../helpers/elections";
import {
  addRequestsTokenToAxios,
  removeRequestsTokenFromAxios,
} from "../helpers/auth";

const initialAuth = {
  isAuthenticated: false,
  user: { elections: [], votes: [], electionLinks: [] },
  login: () => {},
  logout: () => { },
  APIUrl: '',
};

export const AuthContext = createContext({});

export const AuthProvider = ({ APIUrl, children }) => {
  let [auth, setAuth] = useState(initialAuth);
  let [user, changeUser] = useState(initialAuth.user);
  function setUser(...args) {
    changeUser(...args);
    setAuth((p) => ({ ...p, user }));
  }

  useEffect(() => {
    let isAuthenticated = Boolean(localStorage.getItem("isAuthenticated"));
    isAuthenticated = isAuthenticated === true ? true : false;
    const user = JSON.parse(localStorage.getItem("user"));

    setAuth({ isAuthenticated, user, APIUrl });
  }, []);

  function login(userData, successCb = () => {}, errorCb = () => {}) {
    axios
      .post(`${APIUrl}accounts/login/`, userData)
      .then((response) => {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("isAuthenticated", true);
        }
        addRequestsTokenToAxios(token);

        getUserData(APIUrl)
          .then((response) => {
            const [electionsResponse, votesResponse] = response;
            const elections = electionsResponse.data;
            const votes = votesResponse.data;
            console.log(elections);
            const electionLinks = generateElectionLinks(elections);
            setUser(() => {
              const newUser = { elections, votes, electionLinks };
              localStorage.setItem("user", JSON.stringify(newUser));
              return newUser;
            });
          })
          .catch((error) => {
            console.log(error);
          });

        successCb(response);
      })
      .catch((error) => {
        console.log(error);
        errorCb(error);
      });
  }

  function logout(successCb = () => {}, errorCb = () => {}) {
    axios
      .get(`${APIUrl}accounts/logout`)
      .then((response) => {
        setUser(initialAuth.user);
        removeRequestsTokenFromAxios();
        localStorage.setItem("isAuthenticated", false);
        successCb(response);
      })
      .catch((error) => {
        console.log(error);
        errorCb(error);
      });
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
