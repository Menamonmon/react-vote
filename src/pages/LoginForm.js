import React, { useState } from 'react';
import axios from 'axios';

import FormError from '../components/FormError';

const initialLoginData = {
    username: '',
    password: '',
    confirm_password: '',
};

const initialLoginErrorsData = {
    username: [],
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
            error = (<FormError errors={currentErrors} type="error" />);
        }
        final[key] = error;
    }
    return final;
} 


export default function LoginForm(props) {
    const { onSubmit, passvalidation } = props;

    // The Component's states
    let [formData, setForm] = useState(initialLoginData);
    let [errors, setErrors] = useState(initialLoginErrorsData);

    // A fuction that will validate all the data in the form
    const validateFormData = (fd) => {
        let fieldsAreMissing = false;
        for (const [field, data] of Object.entries(fd)) {
            if (data.trim() === '') {
                fieldsAreMissing = true;
                setErrors(prev => {
                    const errorList = [...prev[field]];
                    errorList.push(`${field.replaceAll('_', ' ')} is missing.`);
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
            setErrors(prev => {
                let confirmPasswordErrorList = [...prev.confirm_password];
                if (Array.isArray(passwordsValidation)) {
                    confirmPasswordErrorList = confirmPasswordErrorList.concat(passwordsValidation);
                } else {
                    confirmPasswordErrorList.push(passwordsValidation);
                }
                return { ...prev, confirm_password: confirmPasswordErrorList };
            })   
        }
        return false;
    };

    // A function that would run the necessary validations before performing the onSubmit action from the props
    const submitForm = (e) => {
        setErrors(initialLoginErrorsData);
        const isFormDataValid = validateFormData(formData);
        if (!isFormDataValid) {
            return false;
        }
        console.log('Form Submitted');
        onSubmit();
        e.preventDefault();
    };

    // A function that updates the formData as the data changes in the input fields below
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    
    // Converting the errors state into displayable compoenents
    const errorComponents = errorToFormErrorComponent(errors);
    return (
        <form className="login-form" onSubmit={() => (false)}>
            <h2 className="login-title">Login to React Vote</h2>
            <label className="form-label login-label">
                Username:
                <input type="text" placeholder="Username" value={formData.username} onChange={handleChange} className="form-field login username-input" name="username" />
                {errorComponents.username}
            </label>
            <label className="form-label login-label">
                Password:
                <input type="password" placeholder="Password" value={formData.password} onChange={handleChange} className="form-field login password-input" name="password" />
                {errorComponents.password}
            </label>
            <label className="form-label login-label">
                Confirm Password:
                <input type="password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} className="form-field login confirm-password-input" name="confirm_password"/>
                {errorComponents.confirm_password}
            </label>
            <button className="login-form-submit-btn" type="button" onClick={submitForm}>Login</button>
        </form>
    );
}