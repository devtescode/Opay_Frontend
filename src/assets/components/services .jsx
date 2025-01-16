import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const services = [
  { icon: '📱', label: 'Airtime' },
  { icon: '📊', label: 'Data' },
  { icon: '🎲', label: 'Betting' },
  { icon: '📺', label: 'TV' },
  { icon: '💰', label: 'Owealth' },
  { icon: '💳', label: 'Loan' },
  { icon: '🎮', label: 'Play4achild' },
  { icon: '⋯', label: 'More' },
];

const Services = () => {
  return (
    <Row className="g-3 mb-4">
      {services.map((service, index) => (
        <Col key={index} xs={3}>
          <Button variant="outline-light" className="text-dark w-100 h-100 d-flex flex-column align-items-center gap-2 py-3">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              <span className="fs-5">{service.icon}</span>
            </div>
            <span className="small">{service.label}</span>
          </Button>
        </Col>
      ))}
    </Row>
  );
};

export default Services;

