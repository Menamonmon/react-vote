// validatePasswords(password, pass2)
// Takes the two passwords, checks if they are matching
// Checks the length of the two passwords
// Checks for security concerns for passwords such as:
//  having at least one uppercase char
//  having at least one lowercase char
//  having at least one number
/////////  having at least one special symbol
// Possible Errors Are:
//  1) passwords don't match
//  2) passwords don't meet the criteria (list the criteria)
//  3) password is too short or too long
// If the two passwords are correct true would be returned

const signupPasswordValidation = (
  password,
  password2,
  minLength = 8,
  maxLength = 50
) => {
  let errors = [];
  if (password !== password2) {
    errors.push(`passwords don't match.`);
  }
  if (password.length < minLength || password.length > maxLength) {
    errors.push(
      `the password's length must be between ${minLength} and ${maxLength}`
    );
  }
  const validationRegex = /^.*(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;
  if (!validationRegex.test(password)) {
    errors = errors.concat([
      "your password must have at least one uppercase letter",
      "your password must have at least one lowercase letter",
      "your password must have at least one number",
    ]);
    return errors;
  }
  if (errors.length !== 0) {
    return errors;
  }
  return true;
};

export { signupPasswordValidation };
