import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../App";
import "../css/Account.css";

const Account = () => {
    const [userLogin, setUserLogin] = useState(null);
    // const [memories, setMemories] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserDetails = async (token) => {
        const response = await fetch(`${API_URL}/users/me`, { // Assuming this endpoint returns user details
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Unable to fetch user details");
        }
        return await response.json();
    };

    // const deleteReservation = async (reservationId, token) => {
    //     const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //         },
    //     });

    //     if (!response.ok) {
    //         throw new Error("Error returning the book");
    //     }
    //     return await response.json();
    // };

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
               // setMemories(userDetails.memories || []); // Assuming userDetails has a reservations array
            } catch (error) {
                console.error("Can't fetch logged in user!", error);
                setError(error);
                navigate("/login"); // Optionally redirect on error
            } finally {
                setLoading(false);
            }
        };
        getUserLogin();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return (
            <div>
                <h2>Error fetching account details</h2>
                <p>{error.message}</p>
                <Link to="/login">Login</Link>
            </div>
        );
    }

    if (!userLogin) {
        return (
            <div>
                <h2>Login required to access your account details</h2>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        );
    }

    // const handleReturnBook = async (reservationId) => {
    //     const token = localStorage.getItem("token");
    //     if (!token) return; // If no token, do not proceed

    //     try {
    //         await deleteReservation(reservationId, token);
    //         // Update local state to reflect the change
    //         setReservations((prevReservations) =>
    //             prevReservations.filter((reservation) => reservation.id !== reservationId) // Remove returned book from list
    //         );
    //     } catch (error) {
    //         console.error("Can't return the book!", error);
    //         setError(error);
    //     }
    // };

    return (
        <div className="account-container">
            <h2>Account Details</h2>
            <p><strong>Username:</strong> {userLogin.username}</p> {/* Adjust based on user structure */}
            <p><strong>Email:</strong> {userLogin.email}</p>
            <h3>Checked Out Reservations</h3>
            {/* {reservations.length > 0 ? (
                <div className="reservations-list">
                    {reservations.map((reservation) => (
                        <div key={reservation.id}>
                            {reservation.coverimage && (
                                <img src={reservation.coverimage} alt={`${reservation.title} cover`} />
                            )}
                            <div>
                                <h4>{reservation.title}</h4>
                                <p>by {reservation.author}</p>
                                <button onClick={() => handleReturnBook(reservation.id)}>Return</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No books checked out</p>
            )} */}
        </div>
    );
};

export default Account;