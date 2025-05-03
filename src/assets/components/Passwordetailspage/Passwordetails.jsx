import React, { useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom';
const Passwordetails = () => {
    
    const navigate = useNavigate()
    // If there's no token, redirect to the login page
    
    const token = localStorage.getItem('token'); // Check if token exists in localStorage
    useEffect(() => {
        if (!token) {
             navigate("/")
        }
      
    }, [])
    
    const LogoutBtn = () => {
        Swal.fire({
            text: "Are you sure you want to log out of Opay?",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            buttonsStyling: false, // disable SweetAlert2 styling
            customClass: {
                confirmButton: 'btn btn-success px-5 rounded-5 border-none', // Bootstrap green
                cancelButton: 'btn btn-light text-success px-5 mx-2 rounded-5 border-none' // Light bg with green text
            }
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/");
                localStorage.removeItem("token");
            }
        });

    }
    return (
        <>
            <Container fluid className="p-0 bg-light" style={{ maxWidth: '480px', minHeight: '100vh', }}>
                <div className="d-flex align-items-center p-2 bg-white fixed-top">
                    <span><i class="ri-arrow-left-s-line"></i>  <span className=''>Settings</span></span>
                </div>
                <div className='mx-auto mx-3' style={{ marginTop: "70px" }}>
                    <div className=' p-2 rounded-3 bg-white rounded-3 mx-3'>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 ">
                            <div className="d-flex align-items-center">
                                <span>Login Settings</span>
                            </div>

                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 ">
                            <div className="d-flex align-items-center">
                                <div className="d-flex flex-column">
                                    <span>Payment Settings</span>
                                </div>
                            </div>
                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 ">
                            <div className="d-flex align-items-center">
                                <div className="d-flex flex-column">
                                    <span>Saving Settings</span>
                                </div>
                            </div>
                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>
                    </div>
                </div>

                <div className='mx-auto mx-3' style={{ marginTop: "15px" }}>
                    <div className=' p-2 rounded-3 bg-white rounded-3 mx-3'>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 ">
                            <div className="d-flex align-items-center">
                                <span>Homepage Settings</span>
                            </div>

                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 ">
                            <div className="d-flex align-items-center">
                                <div className="d-flex flex-column">
                                    <span>Security Questions</span>
                                </div>
                            </div>
                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 ">
                            <div className="d-flex align-items-center">
                                <div className="d-flex flex-column">
                                    <span>SMS Alert Subscription</span>
                                </div>
                            </div>
                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 ">
                            <div className="d-flex align-items-center">
                                <div className="d-flex flex-column">
                                    <span>Themes</span>
                                </div>
                            </div>
                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 ">
                            <div className="d-flex align-items-center">
                                <div className="d-flex flex-column">
                                    <span>Access to clipboard</span>
                                </div>
                            </div>
                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>
                    </div>
                </div>

                <div className='mx-auto mx-3' style={{ marginTop: "15px" }}>
                    <div className=' p-2 rounded-3 bg-white rounded-3 mx-3'>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-1">
                            <div className="d-flex align-items-center">
                                <span>Security center</span>
                            </div>

                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>
                    </div>
                </div>
                <div className='mx-auto mx-3' style={{ marginTop: "15px" }}>
                    <div className=' p-2 rounded-3 bg-white rounded-3 mx-3'>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-1">
                            <div className="d-flex align-items-center">
                                <span>Close Account</span>
                            </div>

                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>
                    </div>
                </div>
                <div className='mx-auto mx-3' style={{ marginTop: "15px" }}>
                    <div className=' p-2 rounded-3 bg-white rounded-3 mx-3'>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-1">
                            <div className="d-flex align-items-center">
                                <span>About</span>
                            </div>

                            <i class="ri-arrow-right-s-line"></i>
                        </ListGroup.Item>
                    </div>
                </div>
                <div className='mx-auto mx-3 ' style={{ marginTop: "15px" }}>
                    <div className=' p-2 rounded-3 bg-white rounded-3 mx-3' onClick={LogoutBtn}>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-1">
                            <div className="d-flex align-items-center mx-auto">
                                <span className=''>Sign Out</span>
                            </div>
                        </ListGroup.Item>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default Passwordetails