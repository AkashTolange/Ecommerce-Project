import React, { useState } from "react";
import "./CSS/LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("login fucntion executed", formData);
    let responseData;
    await fetch("https://ecommerce-project-zeg6.onrender.com/login", {
      method: "POST",
      headers: {
        Accept: "application./form-data",
        "Content-Types": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      //after that we will be logged in and we will be send to home page
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };
  const signup = async () => {
    console.log("Signup fucntion executed", formData);
    let responseData;
    await fetch("https://ecommerce-project-zeg6.onrender.com/signup", {
      method: "POST",
      headers: {
        Accept: "application./form-data",
        "Content-Types": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      //after that we will be logged in and we will be send to home page
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={changeHandler}
              placeholder="Your Name"
            />
          ) : (
            <></>
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="password"
          />
        </div>

        <button
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
        >
          Continue
        </button>
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?
            <span
              onClick={() => {
                setState("Login");
              }}
            >
              login Here
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            create an account?
            <span
              onClick={() => {
                setState("Sign Up");
              }}
            >
              Click here
            </span>
          </p>
        )}
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
