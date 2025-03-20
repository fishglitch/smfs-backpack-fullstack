import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import "../css/Register.css";

const Register = ({ setToken }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    const handleRegistration = async (event) => {
      event.preventDefault();
  
      try {
        const result = await registerUser({
          firstName,
          lastName,
          email,
          password,
        }); // Use API function
        setToken(result.token);
        localStorage.setItem("token", result.token);
  
        navigate("/login");
      } catch (error) {
        setError(error.message);
      }
    };
  
    return (
      <>
        <div className="registration-form">
          <h2>Sign Up!</h2>
          <form onSubmit={handleRegistration}>
            <div>
              <label>
                First Name:
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Last name:
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Email:
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Password:
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>
            <button className="submit-button" type="submit">
              Submit
            </button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </>
    );
  };
  
  export default Register;
  