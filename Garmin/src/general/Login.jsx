
import "./general.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import config from '../../config';
import axios from 'axios';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useGrantData, setUseGrantData] = useState(false);

  const handleLogin = () => {
    const emailToUse = useGrantData ? config.email : email;
    const passwordToUse = useGrantData ? config.password : password;

    localStorage.setItem("email", emailToUse);

    const login = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/login', {
          username: emailToUse,
          password: passwordToUse,
        });
      } catch (error) {
        console.error(error);
      }
    };

    login()

    navigate("/home");
  };

  const handleCheckboxChange = () => {
    setUseGrantData(!useGrantData);
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form autoComplete="off">
        <div className="user-box">
          <input
            type="text"
            value={email}
            autoComplete="false"
            onChange={(e) => setEmail(e.target.value)}
            disabled={useGrantData}
          />
          <label style={{ fontSize: "1rem" }}>Garmin Email</label>
        </div>
        <div className="user-box">
          <input
            type="text"
            value={password}
            autoComplete="false"
            onChange={(e) => setPassword(e.target.value)}
            disabled={useGrantData}
          />
          <label style={{ fontSize: "1rem" }}>Garmin Password</label>
        </div>
        <label className="checkbox-container">
            <input
              type="checkbox"
              checked={useGrantData}
              onChange={handleCheckboxChange}
            />
            Use Grant's Data
          </label>
        <div className="form-actions">
          <a type="button" onClick={handleLogin}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;



