import React from 'react'
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
const Passwordetails = () => {
    return (
        <>
            <Container fluid className="p-0 bg-light" style={{ maxWidth: '480px', minHeight: '100vh', }}>
                <div className="d-flex align-items-center p-2 bg-white fixed-top">
                    <span><i class="ri-arrow-left-s-line"></i>  <span className=''>Settings</span></span>
                </div>
                <div className='mx-auto mx-3' style={{marginTop: "70px" }}>


                    <div className=' p-2 rounded-3 bg-white rounded-3 mx-3'>


                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                            <div className="d-flex align-items-center">
                                {/* <div className="me-3 p-2 rounded" style={{ backgroundColor: '#e6f7f1' }}>
                                <ClockHistory size={24} color="#4cd4a1" />
                            </div> */}
                                <span>Login Settings</span>
                            </div>

                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>

                        {/* Account Limits */}
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                            <div className="d-flex align-items-center">

                                <div className="d-flex flex-column">
                                    <span>Payment Settings</span>
                                </div>
                            </div>
                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>

                        {/* Bank Card/Account */}
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                            <div className="d-flex align-items-center">

                                <div className="d-flex flex-column">
                                    <span>Saving Settings</span>
                                </div>
                            </div>
                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Passwordetails