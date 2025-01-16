import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { EyeFill, ChevronRight } from 'react-bootstrap-icons';
import '/src/App.css';

const BalanceCard = () => {
    return (
        <Card className="styles bgEmerald text-white p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center gap-2">
                    <EyeFill size={16} />
                    <span className="small">Available Balance</span>
                </div>
                <Button
                    variant="link"
                    className="text-white p-0 d-flex align-items-center"
                    style={{ textDecoration: 'none' }}
                >
                    Transaction History
                    <ChevronRight className="ms-1" />
                </Button>

            </div>
            <div className="d-flex justify-content-between align-items-center">
                <span className="fs-4 fw-bold">₦ 1,105,500.24</span>
                <Button variant="light" className="text-success">
                    + Add Money
                </Button>
            </div>
        </Card>
    );
};

export default BalanceCard;

