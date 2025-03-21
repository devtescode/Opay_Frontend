import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { BsPersonFill, BsBank, BsCashStack } from 'react-icons/bs';
import '/src/App.css';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate()
  const ToBankBtn =()=>{
    navigate("/bank")
  }
  return (

    
    <Row className="g-3 mb-2 bg-white">
      <Col xs={4}>
        <Button
          variant="outline-light"
          className="text-dark w-100 h-100 d-flex flex-column align-items-center gap-2 py-3"
        >
          <div
            className="rounded-circle d-flex border border-4 border-white align-items-center justify-content-center"
            style={{ width: 40, height: 40, backgroundColor:"#66CCAB" }}
          >
            <BsPersonFill className="text-white" size={20} />
          </div>
          <span className="small">To Opay</span>
        </Button>
      </Col>
      <Col xs={4}>
        <Button
          variant="outline-light"
          className="text-dark w-100 h-100 d-flex flex-column align-items-center gap-2 py-3 "
          onClick={ToBankBtn}
        >
          <div
            className="rounded-circle d-flex border border-4 border-white align-items-center justify-content-center"
            style={{ width: 40, height: 40,  backgroundColor:"#66CCAB"  }}
          >
            <BsBank className="text-white" size={20} />
          </div>
          <span className="small" >To Bank</span>
        </Button>
      </Col>
      <Col xs={4}>
        <Button
          variant="outline-light"
          className="text-dark w-100 h-100 d-flex flex-column align-items-center gap-2 py-3"
        >
          <div
            className="rounded-circle d-flex border border-4 border-white align-items-center justify-content-center"
            style={{ width: 40, height: 40,  backgroundColor:"#66CCAB"  }}
          >
            <BsCashStack className="text-white" size={20} />
          </div>
          <span className="small">Withdraw</span>
        </Button>
      </Col>
    </Row>
  );
};

export default QuickActions;
