import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Adminlogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset previous messages
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:4000/useropay/adminlogin', { email, password });
            localStorage.setItem('adminToken', response.data.token); // Save the token
            // If successful, show the success message
            setSuccessMessage(response.data.message);
            // console.log('Login successful', response.data);
            // Optionally, redirect to the admin dashboard or store a token if needed
            // For example:
            // window.location.href = "/admin/dashboard";
            navigate("/admindb")
        } catch (error) {
            // If there's an error, set the error message
            setErrorMessage(error.response ? error.response.data.message : 'Login failed');
            console.error('Login failed', error);
        }
    };


    return (
        <div className='border border-dark bg-dark' style={{ height: "100vh" }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-sm-12 bg-white mx-auto p-2" style={{ alignItems: "center" }}>
                        <div>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className='text-center'>
                                    <h2>Admin Login</h2>
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        className='form-control my-2'
                                        placeholder='Email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className='form-control my-2'
                                        placeholder='Password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className='text-center'>
                                        <button type="submit" className="btn btn-success">Submit</button>
                                    </div>
                                </div>
                            </form>
                            {/* Display success message */}
                            {successMessage && (
                                <div className="alert alert-success mt-3">
                                    {successMessage}
                                </div>
                            )}

                            {/* Display error message */}
                            {errorMessage && (
                                <div className="alert alert-danger mt-3">
                                    {errorMessage}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Adminlogin;
