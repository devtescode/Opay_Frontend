import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { io } from "socket.io-client"; // Import Socket.IO client
import BalanceCard from '../BalanceCard';
import RecentTransactions from '../RecentTransactions';
import QuickActions from '../QuickActions';

import ReferralBanner from '../ReferralBanner';
import BottomNavigation from '../BottomNavigation';
// import styles from '../../../App.css';
import '/src/App.css'; // Import CSS directly
import Header from '../Header';
import Services from '../services ';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../../../config';
import Takecontrol from '../Takecontrol';

const UserDb= () => {
  const navigate = useNavigate();
  // "http://localhost:4000"
  const socket = io(baseURL);
  
  useEffect(() => {
    // Listen for session logout from the admin panel
    socket.on("sessionLoggedOut", (data) => {
      // console.log("Received sessionLoggedOut event:", data);
      
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      
      // console.log("Stored user:", user);
      
      // Check if session ID from backend matches session ID stored on client side
      if (user && token && user.sessionId === data.sessionId) {
        alert("Your account has been logged out because you attempted to login to another device while an active session was already logged in on your current device. Please note, if you try to login on a different device again with your account, it will be blocked.");

        // Clear the localStorage and redirect to login page
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/"); // Redirect to login page
      }
    });

    // Auto logout after a certain time (e.g., 15 minutes)
    // const logoutUser = () => {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("user");
    //   navigate("/"); // Redirect to login page
    // };
    
    // // Set a timer for auto logout after 15 minutes (900000 ms)
    // const timer = setTimeout(logoutUser, 900000); 

    return () => {
      socket.off("sessionLoggedOut"); // Clean up the event listener when component unmounts
      // clearTimeout(timer); // Clear the logout timer
    };
  }, [navigate, socket]);

  return (
    <Container  className="appContainer bg-light min-vh-100">
      <Header/>
      <BalanceCard />
      <RecentTransactions />
      <QuickActions />
      <Takecontrol/>
      <Services/>
      <ReferralBanner />
      <BottomNavigation />
    </Container>
    
  );
};

export default UserDb;

