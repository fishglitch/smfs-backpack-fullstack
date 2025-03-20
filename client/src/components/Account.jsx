import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../App";
import "../css/Account.css";

const Account = () => {
    const [userLogin, setUserLogin] = useState(null);
    const [reservations, setReservations] = useState([]); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            setReservations(userDetails.books || []);
    
          } catch (error) {
            console.error("Can't fetch logged in user!", error);
            setError(error);
            navigate("/login"); // Optionally redirect on error (e.g., token expired)
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
    
      const handleReturnBook = async (reservationId) => {
        const token = localStorage.getItem("token");
        if (!token) return; // If no token, do not proceed
    
        try {
          const result = await deleteReservation(reservationId, token);
          // Update local state to reflect change
          setReservations((prevResevations) => 
            prevResevations.filter((reservation) => reservation.id !== reservationId) // Remove returned book from list
          );
    
        } catch (error) {
          console.error("Can't return the book!", error);
          setError(error);
        }
      };
    
      return (
        <div className="account-container">
          <h2>Account Details</h2>
          <p><strong>First Name:</strong> {userLogin.firstname}</p>
          <p><strong>Last Name:</strong> {userLogin.lastname}</p>
          <p><strong>Email:</strong> {userLogin.email}</p>
          <h3>Checked Out Reservations</h3>
          {reservations.length > 0 ? (
            <div className="reservations-list">
              {reservations.map((book) => ( // review array method you should know what scenario to use and structure
                <div key={book.id}>
                  {book.coverimage && (
                    <img src={book.coverimage} alt={`${book.title} cover`} />
                  )}
                  <div>
                    <h4>{book.title}</h4>
                    <p>by {book.author}</p>
                    <button onClick={() => handleReturnBook(book.id)}>Return</button> {/* Button to return the book */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No books checked out</p>
          )}
        </div>
      );



}
export default Account;