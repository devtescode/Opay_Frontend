import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import {
    Share,
    PersonPlusFill,
    List
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const TransferSuccess = () => {
    const navigate = useNavigate()
    const [amount, setAmount] = useState(null);
    useEffect(() => {
        const savedAmount = localStorage.getItem("transferAmount");
        if (savedAmount) {
            setAmount(parseFloat(savedAmount));
        }
    }, []);

    const shareBtn =()=>{
        navigate('/transactionreceipt')
    }
    return (
        <Container className="py-4 px-3 max-width-500">
            {/* Success Header */}
            <div className="text-center mb-4">
                <div className='text-end text-success' style={{ fontSize: "18px" }}>
                    <p>
                        Done
                    </p>
                </div>
                <div className="bg-success text-white rounded-circle d-inline-flex p-3 mb-3 mt-4">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                </div>
                <h4 className="mb-2">Transfer successful</h4>
                <h3 className="mb-3">
                    {amount !== null ? `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Loading...'}
                </h3>

                <p className="text-success">
                    The recipient account is expected to be credited within 5 minutes,
                    subject to notification by the bank.
                </p>
            </div>

            {/* Action Buttons */}
            <Row className="text-center mb-4 g-2">
                <Col xs={4}>
                    <Button variant="light " className="w-100 py-2" onClick={shareBtn} style={{height:"90px"}}>
                        <Share className="mb-2 text-success" size={20} />
                        <div className="small">Share Receipt</div>
                    </Button>
                </Col>
                <Col xs={4}>
                    <Button variant="light" className="w-100 py-2"  style={{height:"90px"}}>
                        <PersonPlusFill className="mb-2 text-success" size={20} />
                        <div className="small">Add to favourites</div>
                    </Button>
                </Col>
                <Col xs={4}>
                    <Button variant="light" className="w-100 py-2"  style={{height:"90px"}}>
                        <List className="mb-2 text-success" size={20} />
                        <div className="small">View Details</div>
                    </Button>
                </Col>
            </Row>

            {/* Rewards Section */}
            <Card className="border-0 bg-light">
                <Card.Body>
                    <h5 className="mb-4">Get Your Rewards!</h5>

                    <div className="mb-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-white p-2 rounded">
                                <span className="h5 mb-0">💰</span>
                            </div>
                            <div>
                                <div className="fw-medium">Spend&Save</div>
                                <small className="text-muted">Save when you spend</small>
                            </div>
                        </div>
                        <Button variant="success px-4 rounded-5">Start</Button>
                    </div>

                    <div className="mb-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded bg-white">
                                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-21%20at%2011.24.09_4bcc526b.jpg-QHkMHGac3ONE7A77vW9bZDjYWmsv1T.jpeg" alt="" width="24" height="24" />
                            </div>
                            <div>
                                <div className="fw-medium">Enjoy online payment</div>
                                <small className="text-muted">Using OPay Verve Card now</small>
                            </div>
                        </div>
                        <Button variant="success px-4 rounded-5">Go</Button>
                    </div>

                    <div className="mb-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-white p-2 rounded">
                                <span className="h5 mb-0">⚙️</span>
                            </div>
                            <div>
                                <div className="fw-medium">Bet now and win Big!</div>
                                <small className="text-muted">Enjoy great Discounts!</small>
                            </div>
                        </div>
                        <Button variant="success px-4 rounded-5">GO</Button>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-white p-2 rounded">
                                <span className="h5 mb-0">📢</span>
                            </div>
                            <div>
                                <div className="fw-medium">Up to ₦4200</div>
                                <small className="text-muted">Invite friends and earn cash</small>
                            </div>
                        </div>
                        <Button variant="success px-4 rounded-5">GO</Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TransferSuccess;