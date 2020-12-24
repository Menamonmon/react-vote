import React from "react";

export default function FormError(props) {
  const { errors, type } = props;
  if (!["warning", "error"].includes(type)) {
    return <>PROBLEM WITH ERROR TYPE PROP</>;
  }
  const containerClassName = `form-error ${type}`;
  return (
    <div className={containerClassName}>
      <ul className="error-list">
        {errors.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  );
}
