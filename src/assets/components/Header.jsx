import React, { useEffect, useState } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { BellFill, EyeFill } from 'react-bootstrap-icons';
// import styles from '../App.css';

const Header = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve the user object from localStorage and parse it
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser); // Parse the stored string into an object
      setUsername(parsedUser.username); // Set the username state
    }
  }, []);
  return (
    <Navbar bg="white" className="mb-4">
      <Container className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle overflow-hidden bg-secondary" style={{ width: 32, height: 32 }}>
            <img src="/placeholder.svg" alt="Profile" className="w-100 h-100 object-fit-cover" />
          </div>
          <span className="fw-medium">Hi, {username || 'User'}</span>
        </div>
        <div className="d-flex align-items-center gap-4">
          <EyeFill size={24} />
          <div className="position-relative">
            <BellFill size={24} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              2
            </span>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;

