import axios from "axios";

export const login = (formData, url, successCallback, errorCallback) => {
  axios
    .post(url, {
      username: formData.username,
      password: formData.password,
    })
    .then((res) => {
      successCallback(res);
    })
    .catch((err) => {
      errorCallback(err);
    });
};

export const logout = (token, url, successCallback, errorCallback) => {
  axios
    .post(url, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((res) => {
      successCallback(res);
    })
    .catch((err) => {
      errorCallback(err);
    });
};
