import React, { useEffect } from 'react'
import Navbar from '../Navbarpage/Navbar'
import NavbarTop from '../NavbarToppage/NavbarTop'
import { useNavigate } from 'react-router-dom';

const Admindb = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if admin is logged in
        const adminToken = localStorage.getItem('adminToken');
        console.log(adminToken); // Check what is logged here
    
        if (!adminToken) {
            // If not logged in, redirect to login page
            navigate('/admin');
        }
    }, [navigate]);
    
    return (
        <div>
            <Navbar />
            <NavbarTop />
            <div>
                <div class="container text-center">
                    <div class="row gap-2">
                        <div class="col-12 col-md bg-white">
                            <div>
                                <h1>users</h1>
                            </div>
                            <div>
                                <h1>4</h1>
                            </div>
                        </div>
                        <div class="col-12 col-md bg-white">
                            <div>
                                <h1>users</h1>
                            </div>
                            <div>
                                <h1>4</h1>
                            </div>
                        </div>
                        <div class="col-12 col-md bg-white">
                            <div>
                                <h1>users</h1>
                            </div>
                            <div>
                                <h1>4</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='border mt-5' style={{height:"70vh"}}>

            </div>
        </div>
    )
}

export default Admindb