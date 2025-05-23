import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { HouseDoorFill, GraphUpArrow, CreditCard, PersonFill } from 'react-bootstrap-icons';
import '/src/App.css'; // Import CSS directly
import { useNavigate } from 'react-router-dom';
// import opaylogo from "../../../public/icons/opay.jpg"
import { TbDiamond, } from "react-icons/tb";
import { BsFill0CircleFill } from "react-icons/bs";
import { LiaUserCircle } from "react-icons/lia";
const BottomNavigation = () => {
  const navigate = useNavigate()
  const MeLogOutBtn = () => {
    navigate("/setting")
    // navigate("/")
    // localStorage.removeItem("token");
    // localStorage.removeItem("selectedAccount");
    // localStorage.removeItem("transferAmount");
    // localStorage.removeItem("user");
  }
  return (
    <Navbar fixed="bottom" bg="white" className="border-top">
      <Nav className="w-100 justify-content-between">
        <Nav.Link className="d-flex flex-column align-items-center text-emerald">
          {/* <HouseDoorFill size={24} /> */}
          <div>
            {/* <img src={opaylogo} style={{width:"24px"}} alt="" /> */}

            <span className="fs-4">
              <BsFill0CircleFill className='text-success' size={24}/>
            </span>
          </div>
          <span className="small">Home</span>
        </Nav.Link>
        <Nav.Link className="d-flex flex-column align-items-center text-muted">
          <span className="fs-4"><TbDiamond  size={24}/></span>
          <span className="small">Rewards</span>
        </Nav.Link>
        <Nav.Link className="d-flex flex-column align-items-center text-muted">
          <span className="fs-4">
            <GraphUpArrow size={24} />
          </span>
          <span className="small">Finance</span>
        </Nav.Link>
        <Nav.Link className="d-flex flex-column align-items-center text-muted">
          <span className="fs-4">
            <CreditCard size={24} />
          </span>
          <span className="small">Cards</span>
        </Nav.Link>
        <Nav.Link className="d-flex flex-column align-items-center text-muted" onClick={MeLogOutBtn}>
        <span className="fs-4">
          {/* <PersonFill size={24} /> */}
          <LiaUserCircle size={24}/>

        </span>
          <span className="small">Me</span>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default BottomNavigation;
