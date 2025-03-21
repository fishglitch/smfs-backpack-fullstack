import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../App";
import "../css/Account.css";

const Account = () => {
    const [userLogin, setUserLogin] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserDetails = async (token) => {
        try {
            const response = await fetch(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }

            return await response.json(); // Return the user data
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw error; // Rethrow the error
        }
    };

    useEffect(() => {
        const getUserLogin = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login"); // Redirect if no token
                return;
            }

            try {
                const userDetails = await fetchUserDetails(token);
                setUserLogin(userDetails);
            } catch (error) {
                console.error("Can't fetch logged in user!", error);
                setError(error);
                navigate("/login"); // Redirect on error
            } finally {
                setLoading(false); // Ensure loading state is updated
            }
        };

        getUserLogin(); // Call the function to fetch user login details
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>; 
    }

    // if (error) {
    //     return (
    //         <div>
    //             <h2>Error fetching account details</h2>
    //             <p>{error.message}</p>
    //             <Link to="/login">Login</Link>
    //         </div>
    //     );
    // }

    // if (!userLogin) {
    //     return (
    //         <div>
    //             <h2>Login required to access your account details</h2>
    //             <Link to="/login">Login</Link>
    //             <Link to="/register">Register</Link>
    //         </div>
    //     );
    // }

    return (
        <div className="account-container">
            <h2>Account Details</h2>
            <p><strong>Username:</strong> {userLogin.user.username}</p>
            <p><strong>Dimension:</strong> {userLogin.user.dimension}</p>
            <h3>Your Memories of What's in SMF's Backpack:</h3>
        </div>
    );
};

export default Account;