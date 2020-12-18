import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../contexts/AuthConext";
import FormError from "../components/FormError";
import { loginPasswordValidation } from "../helpers/passwordValidations";

const initialLoginData = {
  username: "",
  password: "",
};

const initialLoginErrorsData = {
  username: [],
  password: [],
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
  const { redirect } = props;
  const { login } = useContext(AuthContext);
  const history = useHistory();

  // The Component's states
  let [formData, setForm] = useState(initialLoginData);
  let [errors, setErrors] = useState(initialLoginErrorsData);

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

    const { password } = fd;
    const passwordsValidation = loginPasswordValidation(password);
    if (passwordsValidation === true) {
      return true;
    } else {
      setErrors((prev) => {
        let confirmPasswordErrorList = [...prev.confirm_password];
        confirmPasswordErrorList = confirmPasswordErrorList.concat(
          passwordsValidation
        );
        return { ...prev, confirm_password: confirmPasswordErrorList };
      });
    }
    return false;
  };

  // A function that would run the necessary validations before performing the onSubmit action from the props
  const submitForm = (e) => {
    setErrors(initialLoginErrorsData);
    // const isFormDataValid = validateFormData(formData);
    // if (!isFormDataValid) {
    //   return false;
    // }

    function loginSuccessCallback() {
      history.push(redirect);
    }

    function loginErrorCallback(error) {
      if (!error.response || error.response.status !== 400) {
        console.log(error);
        return false;
      }
      const errorMessage = "invalid username and/or password.";
      setErrors((prev) => {
        const usernameErrors = [...prev.username];
        usernameErrors.push(errorMessage);
        return { ...prev, username: usernameErrors };
      });
    }

    login(formData, loginSuccessCallback, loginErrorCallback);
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
      <h2 className="auth-form-title">Login to React Vote</h2>
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
      <button className="form-submit-btn" type="button" onClick={submitForm}>
        Login
      </button>
    </form>
  );
}
