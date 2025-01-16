import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { PlusSlashMinus } from 'react-bootstrap-icons';

const RecentTransactions = () => {
  return (
    <div className="mb-4">
      <Card className="mb-3">
        <Card.Body className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              <PlusSlashMinus className="text-primary" size={20} />
            </div>
            <div>
              <div className="fw-medium">Owealth interest</div>
              <div className="small text-muted">Nov 5th, 01:56:32</div>
            </div>
          </div>
          <div className="text-end">
            <div className="text-success fw-medium">+₦0.09</div>
            <Badge bg="success-subtle" text="success">Successful</Badge>
          </div>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              <span className="fs-5">💡</span>
            </div>
            <div>
              <div className="fw-medium">Electricity</div>
              <div className="small text-muted">Nov 5th, 01:56:32</div>
            </div>
          </div>
          <div className="text-end">
            <div className="fw-medium">-₦10,000.00</div>
            <Badge bg="success-subtle" text="success">Successful</Badge>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RecentTransactions;

