import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { RiSmartphoneLine, RiBarChartLine, RiTvLine, RiMoneyDollarCircleLine, RiBankCardLine, RiGamepadLine, RiMore2Line, RiFootballLine } from 'react-icons/ri';

const services = [
  { icon: <RiSmartphoneLine />, label: 'Airtime', badge: "Up to 6%" },
  { icon: <RiBarChartLine />, label: 'Data', badge: "Up to 6%" },
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
        <Col key={index} xs={3} className="position-relative">
          <div className="text-dark w-100 h-100 d-flex flex-column align-items-center gap-2 py-3 position-relative">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center position-relative" style={{ width: 40, height: 40 }}>
              <span className="fs-5 p-2 text-white rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: "#66CCAB" }}>
                {service.icon}
              </span>
              {service.badge && (
                <span className="position-absolute" style={{ top: '-10px', right: '-29px', fontSize: '10px' }}>
                  <span className="badge rounded-pill bg-danger px-2 py-1">
                    {service.badge}
                  </span>
                </span>
              )}
            </div>
            <span className="small">{service.label}</span>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default Services;
