import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import {
    Share,
    PersonPlusFill,
    List
} from 'react-bootstrap-icons';
import { useLocation, useNavigate } from 'react-router-dom';

const TransferSuccess = () => {
    const navigate = useNavigate()
    const { state: transaction } = useLocation();
    console.log("Received transaction in TransferSuccess:", transaction); // MUST NOT be null
    const [amount, setAmount] = useState(null);
    useEffect(() => {
        const savedAmount = localStorage.getItem("transferAmount");
        if (savedAmount) {
            setAmount(parseFloat(savedAmount));
        }
    }, []);

    const shareBtn = () => {
        navigate('/transactionreceipt')
    }
    // if (!transaction) {
    //     return <p className="text-center text-danger">No transaction available</p>;
    // }

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

            <Row className="mb-3 justify-content-center text-center">
                <Col xs={6} md="auto" className="mb-3 mb-md-0">
                    <div
                        className="py-2 rounded-3 px-3 d-flex justify-content-center align-items-center gap-3 shadow-sm"
                        onClick={shareBtn}
                        style={{ height: "65px", cursor: "pointer" }}
                    >
                        <Share className="mb-1 text-success mt-1" size={20} />
                        <div className="small" style={{fontSize:"16px"}}>Share Receipt</div>
                    </div>
                </Col>
                <Col xs={6} md="auto">
                    <div
                        className="py-2 px-3 rounded-3 d-flex justify-content-center align-items-center gap-3 shadow-sm"
                        style={{ height: "65px", cursor: "pointer" }}
                        onClick={() => navigate("/transactiondetails", { state: transaction })}
                    >
                        <List className="mb-0 text-success" size={20} />
                        <div className="small" style={{fontSize:"16px"}}>View Details</div>
                    </div>
                </Col>
            </Row>



            {/* Rewards Section */}
            <Card className="border-0 bg-light">
                <Card.Body>
                    <h5 className="mb-4">Special Bonus For Your</h5>

                    <div className="mb-3 d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-white p-2 rounded">
                                <span className="h5 mb-0">💰</span>
                            </div>
                            <div>
                                <div className="fw-medium">Save easily</div>
                                <small className="text-muted">Earn more interest everyday!</small>
                            </div>
                        </div>
                        <Button variant="success px-4 rounded-5">Go</Button>
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
                                <div className="fw-medium">Bet big, win Bigger!</div>
                                <small className="text-muted">Get Discounts That Wow😎!</small>
                            </div>
                        </div>
                        <Button variant="success px-4 rounded-5">GO</Button>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-white p-2 rounded">
                                <span className="h5 mb-0">💡</span>
                            </div>
                            <div>
                                <div className="fw-medium">Electricity Payment</div>
                                <small className="text-muted">Fast&Easy Electricity Bill Pay</small>
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