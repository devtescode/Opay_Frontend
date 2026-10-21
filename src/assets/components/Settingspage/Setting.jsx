import { useState } from 'react';
import {
    Container,
    Button,
    ListGroup,
} from 'react-bootstrap';
import {
    CreditCard,
    ClockHistory,
    ShieldCheck,
    Headset,
    Gift,
    CurrencyDollar,
    Shop,
    Eye,
    EyeSlash,
} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../../../hooks/useQueries';
import { useCurrentUser } from '../../../lib/auth';
import { DEFAULT_AVATAR } from '../../../lib/constants';

const Setting = () => {
    const [showBalance, setShowBalance] = useState(false);

    const navigate = useNavigate();
    const { user } = useCurrentUser();
    const { data: balance = 0, isPending, isError } = useBalance();

    const username = user?.username;
    const profilePicture = user?.profilePicture || DEFAULT_AVATAR;

    const toggleBalance = () => setShowBalance((prev) => !prev);

    const passwordBtn = () => navigate('/passwordetails');
    const makepaymentBtn = () => navigate('/makepayment');
    const historyBtn = () => navigate('/storetransaction');

    return (
        <Container fluid className="p-0 bg-light" style={{ maxWidth: '480px', minHeight: '100vh', backgroundColor: '#f0f8f4' }}>
            <div className="p-3">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <img
                            src={profilePicture}
                            alt="Profile"
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
                    <div onClick={passwordBtn} className="hexagon" style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer'
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
                        <div><i className="ri-settings-line fs-4"></i></div>
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
                            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                        >
                            {showBalance ? <Eye size={18} /> : <EyeSlash size={18} />}
                        </Button>
                    </div>

                    <h2 className="mb-1">
                        {isPending
                            ? '₦ —'
                            : isError
                                ? 'Unavailable'
                                : showBalance
                                    ? `₦${Number(balance).toLocaleString()}.00`
                                    : <small className="fs-1">****</small>}
                    </h2>

                    <div className="d-flex align-items-center">
                        <ListGroup variant="flush" className="border-0 rounded-pill">
                            <ListGroup.Item className="border-0 bg-transparent px-0 py-1">
                                <small className="rounded-4" style={{ fontSize: '11px' }}>
                                    Interest Credited Today {showBalance ? <small className="text-success">+₦0.09</small> : <small className="text-success">****</small>}
                                </small>
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                </div>

                {/* Safety Tips Card */}
                <div className="mb-4 border-0 shadow-sm p-3 rounded" style={{ backgroundColor: '#4cd4a1', borderRadius: '15px' }}>
                    <div className="d-flex justify-content-between align-items-center text-white">
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
                    </div>
                </div>

                {/* Menu Options */}
                <div className="border-none p-2 rounded-3 bg-white">
                    <ListGroup.Item onClick={historyBtn} className="d-flex justify-content-between align-items-center px-0 py-3">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <ClockHistory size={24} color="#4cd4a1" />
                            </div>
                            <span>Transaction History</span>
                        </div>
                        <i className="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>

                    <ListGroup.Item onClick={makepaymentBtn} className="d-flex justify-content-between align-items-center px-0 py-3">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <CurrencyDollar size={24} color="#4cd4a1" />
                            </div>
                            <div className="d-flex flex-column">
                                <span>Account Limits</span>
                                <small className="text-muted">View your transaction limits</small>
                            </div>
                        </div>
                        <i className="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <CreditCard size={24} color="#4cd4a1" />
                            </div>
                            <div className="d-flex flex-column">
                                <span>Bank Card/Account</span>
                                <small className="text-muted">Add payment option</small>
                            </div>
                        </div>
                        <i className="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <Shop size={24} color="#4cd4a1" />
                            </div>
                            <div className="d-flex flex-column">
                                <span>Transfer to Me</span>
                                <small className="text-muted">Receive payment for your business</small>
                            </div>
                        </div>
                        <i className="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>
                </div>

                <div className="border-none p-2 rounded-3 bg-white mt-2">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <ShieldCheck size={24} color="#4cd4a1" />
                            </div>
                            <div className="d-flex flex-column">
                                <span>Security Center</span>
                                <small className="text-muted">Protect your funds</small>
                            </div>
                        </div>
                        <i className="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3">
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <Headset size={24} color="#4cd4a1" />
                            </div>
                            <span>Customer Service Center</span>
                        </div>
                        <i className="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>

                    <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3">
                        <div className="d-flex align-items-center border-none">
                            <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <Gift size={24} color="#4cd4a1" />
                            </div>
                            <div className="d-flex flex-column">
                                <span>Invitation</span>
                                <small className="text-muted">Invite friends and earn up to ₦5,600 Bonus</small>
                            </div>
                        </div>
                        <i className="ri-arrow-right-s-line"></i>
                    </ListGroup.Item>
                </div>
            </div>
        </Container>
    );
};

export default Setting;
