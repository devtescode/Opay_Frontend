import React, { useEffect, useRef, useState } from 'react';
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
import Drag from "../../Image/drag.png"
const UserDb = () => {
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

  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: null, y: null });

  useEffect(() => {
    const handleMove = (e) => {
      if (dragging) {
          e.preventDefault(); // ✅ Stop scroll behavior on touch/mouse drag
        const clientX = e.clientX ?? e.touches?.[0]?.clientX;
        const clientY = e.clientY ?? e.touches?.[0]?.clientY;

        if (clientX && clientY) {
          setPosition({
            x: clientX - 100, // Adjust for half image width
            y: clientY - 100,
          });
        }
      }
    };

    const stopDrag = () => setDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopDrag);
     window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleMove, { passive: false });
      window.removeEventListener("touchend", stopDrag);
    };
  }, [dragging]);
  

  return (
    <Container className="appContainer bg-light min-vh-100">

      <Header />
      <BalanceCard />
      <RecentTransactions />
      <QuickActions />
      <Takecontrol />
      <Services />
      <ReferralBanner />
      <img
        ref={dragRef}
        src={Drag}// ✅ Make sure this path is correct
        alt="Floating"
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
        style={{
          position: "fixed",
          top: position.y !== null ? `${position.y}px` : "auto",
          left: position.x !== null ? `${position.x}px` : "auto",
          bottom: position.y === null ? "50px" : "auto",
          right: position.x === null ? "-150px" : "auto",
          width: 200,
          height: 80,
          cursor: "grab",
          zIndex: 9999,
        }}
      />

      <BottomNavigation />




    </Container>

  );
};

export default UserDb;

