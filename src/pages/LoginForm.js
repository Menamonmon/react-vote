import React, { useState } from "react";
import axios from "axios";

import FormError from "../components/FormError";

const initialLoginData = {
  username: "",
  password: "",
  confirm_password: "",
};

const initialLoginErrorsData = {
  username: [],
  password: [],
  confirm_password: [],
};

const initialLoginState = {
  toke: "",
  success: false,
};

function errorToFormErrorComponent(errors) {
  const cats = Object.keys(errors);
  const final = {};
  for (let key of cats) {
    let currentErrors = errors[key];
    let error = <></>;
    if (currentErrors.length > 0) {
      error = <FormError errors={currentErrors} type="error" />;
    }
    final[key] = error;
  }
  return final;
}

export default function LoginForm(props) {
  const { onSubmit, passvalidation, loginurl } = props;

  // The Component's states
  let [formData, setForm] = useState(initialLoginData);
  let [errors, setErrors] = useState(initialLoginErrorsData);
  let [loginState, setLoginState] = useState(initialLoginState);

  // A fuction that will validate all the data in the form
  const validateFormData = (fd) => {
    let fieldsAreMissing = false;
    for (const [field, data] of Object.entries(fd)) {
      if (data.trim() === "") {
        fieldsAreMissing = true;
        setErrors((prev) => {
          const errorList = [...prev[field]];
          errorList.push(`${field.replaceAll("_", " ")} is missing.`);
          return { ...prev, [field]: errorList };
        });
      }
    }
    if (fieldsAreMissing) {
      return false;
    }

    const { password, confirm_password } = fd;
    const passwordsValidation = passvalidation(password, confirm_password);
    if (passwordsValidation === true) {
      return true;
    } else {
      setErrors((prev) => {
        let confirmPasswordErrorList = [...prev.confirm_password];
        if (Array.isArray(passwordsValidation)) {
          confirmPasswordErrorList = confirmPasswordErrorList.concat(
            passwordsValidation
          );
        } else {
          confirmPasswordErrorList.push(passwordsValidation);
        }
        return { ...prev, confirm_password: confirmPasswordErrorList };
      });
    }
    return false;
  };

  // A function that would handle the requests for logging the user in
  const loginToServer = (formData, url) => {
    axios
      .post(url, {
        username: formData.username,
        password: formData.password,
      })
      .then((res) => {
        setLoginState({ success: true, token: res.data.token });
      })
      .catch((err) => {
        const errorMessage = "invalid username and/or password.";
        setErrors((prev) => {
          const usernameErrors = [...prev.username];
          usernameErrors.push(errorMessage);
          return { ...prev, username: usernameErrors };
        });
        setLoginState({ success: false, token: "" });
      });
  };

  // A function that would run the necessary validations before performing the onSubmit action from the props
  const submitForm = (e) => {
    setErrors(initialLoginErrorsData);
    const isFormDataValid = validateFormData(formData);
    if (!isFormDataValid) {
      return false;
    }
    loginToServer(formData, loginurl);
    if (!loginState.success) {
      return false;
    }
    onSubmit(loginState.token);
    // e.preventDefault();
  };

  // A function that updates the formData as the data changes in the input fields below
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Converting the errors state into displayable compoenents
  const errorComponents = errorToFormErrorComponent(errors);
  return (
    <form className="auth-form">
      <h2 className="auth-form-tite">Login to React Vote</h2>
      <label className="form-label login-label">
        Username:
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="form-field login username-input"
          name="username"
        />
        {errorComponents.username}
      </label>
      <label className="form-label login-label">
        Password:
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="form-field login password-input"
          name="password"
        />
        {errorComponents.password}
      </label>
      <label className="form-label login-label">
        Confirm Password:
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          className="form-field login confirm-password-input"
          name="confirm_password"
        />
        {errorComponents.confirm_password}
      </label>
      <button className="form-submit-btn" type="button" onClick={submitForm}>
        Login
      </button>
    </form>
  );
}
