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

export const AuthProvider = ({ APIUrl, children }) => {
  let [auth, setAuth] = useState(initialAuth);

  useEffect(() => {
    let isAuthenticated = Boolean(localStorage.getItem("isAuthenticated"));
    isAuthenticated = isAuthenticated === true ? true : false;
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      user = initialAuth.user;
    }

    setAuth({ isAuthenticated, user, APIUrl });
  }, []);

  function login(userData, successCb = () => { }, errorCb = () => { }) {
    axios
      .post(`${APIUrl}accounts/login/`, userData)
      .then((response) => {
        const token = response.data.token;
        if (token) {
          setAuth(p => {
            const isAuthenticated = true;
            localStorage.setItem('isAuthenticated', isAuthenticated); 
            return { ...p, isAuthenticated };
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
    setAuth(initialAuth);
    localStorage.setItem("isAuthenticated", initialAuth.isAuthenticated);
    localStorage.setItem("user", JSON.stringify(initialAuth.user));
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
