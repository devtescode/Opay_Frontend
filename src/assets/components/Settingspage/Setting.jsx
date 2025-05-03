import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    ListGroup,
    Badge
} from 'react-bootstrap';
import {
    CreditCard,
    ClockHistory,
    ShieldCheck,
    ArrowRight,
    Eye,
    EyeSlash,
    Headset,
    Gift,
    CurrencyDollar,
    Bank,
    Shop
} from 'react-bootstrap-icons';
import { API_URLS } from '../../../../utils/apiConfig';

const Setting = () => {
    const [showBalance, setShowBalance] = useState(false);
    const [username, setUsername] = useState('');
    const [balance, setBalance] = useState(0);

    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };


    const userData = JSON.parse(localStorage.getItem('user'));
    const profilePicture = userData?.profilePicture;
    useEffect(() => {
        // Retrieve the user object from localStorage and parse it
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser); // Parse the stored string into an object
            setUsername(parsedUser.username);
        }
    }, []);


    // const [showBalance, setShowBalance] = useState(true);

    const fetchUserBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URLS.getuserbalance, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalance(response.data.walletBalance);
            console.log(response.data.walletBalance, "see balance");

        } catch (error) {
            console.error('Failed to fetch balance:', error);
            Swal.fire('Error', 'Failed to fetch balance', 'error');
        }
    };

    useEffect(() => {
        fetchUserBalance();
    }, []);

    return (
        <Container fluid className="p-0 bg-light" style={{ maxWidth: '480px', minHeight: '100vh', backgroundColor: '#f0f8f4' }}>
            <div className="p-3">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <img
                            src={
                                profilePicture
                                    ? profilePicture
                                    : "https://imgs.search.brave.com/bxCCyib87iQyOj5bfkpD7EJYOE_guuCNV5dH5-6folo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzExLzY5LzIz/LzM2MF9GXzExMTY5/MjM0Nl9GbUZsc29W/NHBhcFRmbVV2OEhC/S0lHbTNtT1ZKeENW/My5qcGc"
                            }
                            className="rounded-circle me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div>
                            <h5 className="mb-0">Hi, {username}</h5>
                            <small className="text-muted">
                                <span className="me-1">🏆</span>
                                Upgrade to Tier 2
                            </small>
                        </div>
                    </div>
                    <div className="hexagon" style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#ff3366',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '5px',
                            right: '5px'
                        }}></div>
                        <div style={{
                        }}><i class="ri-settings-line fs-4"></i></div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                        <span className="text-muted me-2">Total Balance</span>
                        <Button
                            variant="link"
                            className="p-0"
                            onClick={toggleBalance}
                            style={{ color: '#333' }}
                        >
                            {showBalance ? <Eye size={18} /> : <EyeSlash size={18} />}


                            <p className="text-secondary mb-0"></p>
                        </Button>
                    </div>
                    <h2 className="mb-1">
                        {showBalance ? `₦${balance.toLocaleString()}.00` : <small className='fs-1'>****</small>}
                    </h2>

                    <div className="d-flex align-items-center">
                        <Card className="border-0 rounded-pill">
                            <Card.Body className="py-1">
                                <small className='rounded-4 ' style={{ fontSize: "11px" }}>Interest Credited Today {showBalance ? <small className='text-success'>+₦0.09</small> : <small className='text-success'>****</small>}</small>

                            </Card.Body>
                        </Card>
                    </div>
                </div>

                {/* Safety Tips Card */}
                <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: '#4cd4a1', borderRadius: '15px' }}>
                    <Card.Body className="d-flex justify-content-between align-items-center text-white">
                        <div>
                            <div className="d-flex align-items-center mb-1">
                                <span className="me-2">⚠️</span>
                                <h5 className="mb-0">3 Safety Tips</h5>
                            </div>
                            <small>Make your account more secure.</small>
                        </div>
                        <Button variant="light" className="rounded-pill px-3" style={{ color: '#4cd4a1' }}>
                            View
                        </Button>
                    </Card.Body>
                </Card>

                {/* Menu Options */}
                {/* <ListGroup variant="flush"> */}

                <div className='border-none p-2  rounded-3 bg-white'>


                    {/* Transaction History */}
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <ClockHistory size={24} color="#4cd4a1" />
                            </div>
                            <span>Transaction History</span>
                        </div>
                       
                        <i class="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>

                    {/* Account Limits */}
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <CurrencyDollar size={24} color="#4cd4a1" />
                            </div>
                            <div className="d-flex flex-column">
                                <span>Account Limits</span>
                                <small className="text-muted">View your transaction limits</small>
                            </div>
                        </div>
                        <i class="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>

                    {/* Bank Card/Account */}
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <CreditCard size={24} color="#4cd4a1" />
                            </div>
                            <div className="d-flex flex-column">
                                <span>Bank Card/Account</span>
                                <small className="text-muted">Add payment option</small>
                            </div>
                        </div>
                        <i class="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>

                    {/* Transfer to Me */}
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <Shop size={24} color="#4cd4a1" />
                            </div>
                            <div className="d-flex flex-column">
                                <span>Transfer to Me</span>
                                <small className="text-muted">Receive payment for your business</small>
                            </div>
                        </div>
                        <i class="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>
                </div>


                <div className='border-none p-2 rounded-3 bg-white mt-2 '>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <ShieldCheck size={24} color="#4cd4a1" />
                            </div>
                            <div className="d-flex flex-column">
                                <span>Security Center</span>
                                <small className="text-muted">Protect your funds</small>
                            </div>
                        </div>
                        <i class="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>

                    {/* Customer Service Center */}
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <Headset size={24} color="#4cd4a1" />
                            </div>
                            <span>Customer Service Center</span>
                        </div>
                        <i class="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>

                    {/* Invitation */}
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                        <div className="d-flex align-items-center border-none">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <Gift size={24} color="#4cd4a1" />
                            </div>
                            <div className="d-flex flex-column">
                                <span>Invitation</span>
                                <small className="text-muted">Invite friends and earn up to ₦5,600 Bonus</small>
                            </div>
                        </div>
                        <i class="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>
                    {/* </ListGroup> */}
                </div>
            </div>
        </Container>
    );
};

export default Setting;