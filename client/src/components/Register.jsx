import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import "../css/Register.css";

const Register = ({ setToken }) => {
    // Define initial state values
    const initialState = {
        username: "",
        password: "",
        dimension: ""
    };

    // Use state hooks for individual fields, you might also consider using a single state for all fields as shown below.
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dimension, setDimension] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegistration = async (event) => {
        event.preventDefault();

        const body = { username, password, dimension }; // Prepare your body.

        try {
            const result = await fetch(`${API_URL}/users/register`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const data = await result.json();

            if (data.token) {
                setToken(data.token);
                localStorage.setItem("token", data.token);
                navigate("/login");
            } else {
                throw new Error(data.message || 'Registration failed');
            }
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
                            Username:
                            <input
                                type="text"
                                id="username"
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
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Dimension:
                            <input
                                type="text"
                                id="dimension"
                                value={dimension}
                                onChange={(e) => setDimension(e.target.value)}
                            />
                        </label>
                    </div> s
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