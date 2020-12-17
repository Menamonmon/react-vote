import axios from "axios";

export const login = (userData, url, successCallback, errorCallback) => {
  axios
    .post(url, {
      username: userData.username,
      password: userData.password,
    })
    .then((res) => {
      successCallback(res);
    })
    .catch((err) => {
      errorCallback(err);
    });
};

export const logout = (url, successCallback, errorCallback) => {
  axios
    .post(url)
    .then((res) => {
      successCallback(res);
    })
    .catch((err) => {
      errorCallback(err);
    });
};

export const addRequestsTokenToAxios = (token) => {
  // axios.interceptors.request.use(config => {
  //   config.headers.Authorization = token;
  //   config.headers['Access-Control-Allow-Origin'] = '*';
  //   return config;
  // });
  axios.defaults.headers.common["Authorization"] = `Token ${token}`;
};

export const removeRequestsTokenFromAxios = () => {
  // axios.interceptors.request.user(config => {
  // 	config.headers.Authorization = null;
  // 	return config;
  // });
  axios.defaults.headers.common["Authorization"] = null;
};
