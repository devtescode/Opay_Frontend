import React from 'react';
import { Card } from 'react-bootstrap';

const ReferralBanner = () => {
  return (
    <Card className="mb-4">
      <Card.Body className="d-flex align-items-center gap-3">
        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
          <span className="fs-5">💰</span>
        </div>
        <div>
          <div className="fw-medium">Cash up for grabs!</div>
          <div className="small text-muted">Invite friends and earn up to ₦4,600 Bonus</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReferralBanner;

