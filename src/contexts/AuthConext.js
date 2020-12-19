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
  APIUrl: "",
};

export const AuthContext = createContext({});

window.onbeforeunload = function () {
  localStorage.clear();
};

export const AuthProvider = ({ APIUrl, children }) => {
  initialAuth.APIUrl = APIUrl;
  let [auth, setAuth] = useState(initialAuth);

  useEffect(() => {
    let isAuthenticated = Boolean(localStorage.getItem("isAuthenticated"));
    isAuthenticated = isAuthenticated === true ? true : false;
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        throw new Error('Invalid user');
      }
    } catch (error) {
      user = initialAuth.user;
    }

    setAuth(p => ({ ...p, isAuthenticated, user }));
  }, []);

  function login(
    userData,
    successCb = () => {},
    errorCb = () => {},
    isSignup = false
  ) {
    const requestUrl = `${APIUrl}accounts/${isSignup ? "register" : "login"}/`;
    axios
      .post(requestUrl, userData)
      .then((response) => {
        const { token } = response.data;
        if (token) {
          setAuth((p) => {
            p = JSON.parse(JSON.stringify(p))
            p.isAuthenticated = true;
            localStorage.setItem("isAuthenticated", p.isAuthenticated);
            return p;
          });
        }
        addRequestsTokenToAxios(token);

        getUserData(APIUrl)
          .then((response) => {
            const [electionsResponse, votesResponse] = response;
            const elections = electionsResponse.data;
            const votes = votesResponse.data;
            const electionLinks = generateElectionLinks(elections);
            const user = { elections, votes, electionLinks };
            localStorage.setItem("user", JSON.stringify(user));

            setAuth((p) => ({ ...p, user }));
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
    localStorage.setItem("isAuthenticated", false);
    localStorage.setItem("user", JSON.stringify(initialAuth.user));
    setAuth(initialAuth);
    axios
      .get(`${APIUrl}accounts/logout`)
      .then((response) => {
        successCb(response);
      })
      .catch((error) => {
        console.log(error);
        errorCb(error);
      });
    removeRequestsTokenFromAxios();
  }
  
  function signup(userData, successCb = () => {}, errorCb = () => {}) {
    login(userData, successCb, errorCb, true);
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
