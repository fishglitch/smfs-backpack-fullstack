import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import "../css/Login.css";

const Login = ({ token, setToken, userId, setUserId }) => {


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${API_URL}/users/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }) // Send username and password
            });
            const loggedInData = await response.json();
            console.log("POST users/login!!!", loggedInData);

            if (loggedInData.token) {
                // Save token to local storage
                localStorage.setItem("token", loggedInData.token);
                
                // If login is successful, set the token and navigate
                setToken(loggedInData.token);

                setUserId(loggedInData.userId);
                console.log("userId destructured at login?", loggedInData);
                navigate("/"); // account, previously; testing. 

                
            } else {
                throw new Error(loggedInData.message || 'Login failed');
            }
        } catch (error) {
            setError(error.message);
        }
    };



    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            id="username"
                            autoComplete="username"  // Added autocomplete
                            name="username" // Added name attribute
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            id="password" // Added id attribute
                            autocomplete="current-password"  // Added autocomplete
                            name="password" // Added name attribute
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Login</button>

                {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error */}
            </form>
        </div>
    );
};

export default Login;