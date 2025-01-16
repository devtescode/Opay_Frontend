import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { HouseDoorFill, GraphUpArrow, CreditCard, PersonFill } from 'react-bootstrap-icons';
import '/src/App.css'; // Import CSS directly

const BottomNavigation = () => {
  return (
    <Navbar fixed="bottom" bg="white" className="border-top">
      <Nav className="w-100 justify-content-between">
        <Nav.Link href="#home" className="d-flex flex-column align-items-center text-emerald">
          <HouseDoorFill size={24} />
          <span className="small">Home</span>
        </Nav.Link>
        <Nav.Link href="#rewards" className="d-flex flex-column align-items-center text-muted">
          <span className="fs-4">🎁</span>
          <span className="small">Rewards</span>
        </Nav.Link>
        <Nav.Link href="#finance" className="d-flex flex-column align-items-center text-muted">
          <GraphUpArrow size={24} />
          <span className="small">Finance</span>
        </Nav.Link>
        <Nav.Link href="#cards" className="d-flex flex-column align-items-center text-muted">
          <CreditCard size={24} />
          <span className="small">Cards</span>
        </Nav.Link>
        <Nav.Link href="#me" className="d-flex flex-column align-items-center text-muted">
          <PersonFill size={24} />
          <span className="small">Me</span>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default BottomNavigation;
