import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { RiSmartphoneLine, RiBarChartLine, RiTvLine, RiMoneyDollarCircleLine, RiBankCardLine, RiGamepadLine, RiMore2Line, RiFootballLine } from 'react-icons/ri';

const services = [
  { icon: <RiSmartphoneLine />, label: 'Airtime' },
  { icon: <RiBarChartLine />, label: 'Data' },
  { icon: <RiFootballLine />, label: 'Betting' },
  { icon: <RiTvLine />, label: 'TV' },
  { icon: <RiMoneyDollarCircleLine />, label: 'Owealth' },
  { icon: <RiBankCardLine />, label: 'Loan' },
  { icon: <RiGamepadLine />, label: 'Play4achild' },
  { icon: <RiMore2Line />, label: 'More' },
];

const Services = () => {
  return (
    <Row className="g-3 mb-4 bg-white">
      {services.map((service, index) => (
        <Col key={index} xs={3}>
          <Button variant="outline-light" className="text-dark w-100 h-100 d-flex flex-column align-items-center gap-2 py-3">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              <span className="fs-5 p-2 text-white rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: "#66CCAB" }}>
                {service.icon}
              </span>
            </div>
            <span className="small">{service.label}</span>
          </Button>
        </Col>
      ))}
    </Row>
  );
};

export default Services;
