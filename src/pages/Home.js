import React from "react";

export default function Home() {
  return (
    <div className="container homepage">
      <h2 className="container-title">Welcome To React Vote:</h2>
      <h3 className="container-subtitle">
        React Vote is a simple web app that is built using React, Django, and
        the Django REST Framework. It gives you the opportunity to signup for an
        account which would then give you access to the elections that match
        your state. You can view your elections, change your vote, and view your
        previous votes. This website is built by Mena Filfil. (
        <a href="https://github.com/menamonmon">visit my GitHub page</a>)
      </h3>
    </div>
  );
}
