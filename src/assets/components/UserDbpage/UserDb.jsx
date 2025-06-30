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
import { jwtDecode } from 'jwt-decode';
// import jwt_decode from "jwt-decode";

const UserDb= () => {
  const navigate = useNavigate();
  const socket = io(baseURL);
  useEffect(() => {
    socket.on("sessionLoggedOut", (data) => {
      
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now();
    
          if (decoded.exp * 1000 < currentTime) {
            localStorage.removeItem("token");
            navigate("/");
            return;
          }
        } catch (error) {
          console.error("Error decoding token", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
          return;
        }
      }
  
      if (user && token && user.sessionId === data.sessionId) {
        alert("Your account has been logged out because you attempted to login to another device while an active session was already logged in on your current device. Please note, if you try to login on a different device again with your account, it will be blocked.");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/"); 
      }
    });


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

