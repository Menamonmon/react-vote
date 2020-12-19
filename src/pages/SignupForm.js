import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../contexts/AuthConext";
import FormError from "../components/FormError";
import { signupPasswordValidation } from "../helpers/passwordValidations";
import axios from "axios";

const initialSignupData = {
  username: "",
  state: "",
  password: "",
  confirm_password: "",
};

const initialSignupErrorsData = {
  username: [],
  state: [],
  password: [],
  confirm_password: [],
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

export default function SignupForm({ redirect }) {
  const { signup, APIUrl } = useContext(AuthContext);
  const history = useHistory();
  let [statesList, setStatesList] = useState([]);

  useEffect(() => {
    axios
      .get(`${APIUrl}users/states`)
      .then(({ data }) => {
        data = data.map(([value, content]) => ({ value, content }));
        setStatesList(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // The Component's states
  let [formData, setForm] = useState(initialSignupData);
  let [errors, setErrors] = useState(initialSignupErrorsData);

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
    const passwordsValidation = signupPasswordValidation(
      password,
      confirm_password
    );
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
 	    setErrors(initialSignupErrorsData);
    const isFormDataValid = validateFormData(formData);
		if (!isFormDataValid) {
      return false;
		}
		
    function signupSuccessCallback() {
			history.push(redirect);
    }

    function signupErrorCallback(error) {
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

    signup(formData, signupSuccessCallback, signupErrorCallback);
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
      <label className="form-label signup-label">
        Username:
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="form-field signup username-input"
          name="username"
        />
        {errorComponents.username}
      </label>
      <label className="form-label signup-label">
        State:
        <select
          value={formData.state}
          onChange={handleChange}
          className="form-field form-datalist signup state-input"
          name="state"
        >
          {statesList.map(({ value, content }) => (
            <option key={value} value={value}>
              {content}
            </option>
          ))}
        </select>
        {errorComponents.state}
      </label>
      <label className="form-label signup-label">
        Password:
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="form-field signup password-input"
          name="password"
        />
        {errorComponents.password}
      </label>
      <label className="form-label signup-label">
        Confirm Password:
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          className="form-field signup confirm-password-input"
          name="confirm_password"
        />
        {errorComponents.confirm_password}
      </label>
      <button className="form-submit-btn" type="button" onClick={submitForm}>
        Sign Up
      </button>
    </form>
  );
}
