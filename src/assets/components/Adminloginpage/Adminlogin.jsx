import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../../../utils/apiConfig';

const Adminlogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post(API_URLS.adminlogin, { email, password });
            localStorage.setItem('adminToken', response.data.token); 
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
        finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="d-flex align-items-center justify-content-center vh-100"
            style={{
                background: "linear-gradient(to right, #141e30, #243b55)",
            }}
        >
            <div className="card p-4 rounded shadow-lg "
                style={{
                    maxWidth: "400px",
                    width: "95%",
                    borderRadius: "15px",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    color: "#fff",
                }}
            >
                <div className="text-center">
                    <h3 className="mb-3" style={{ color: "#00c6ff" }}>Admin Login</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <span className="input-group-text bg-transparent border-light text-white">
                            <i class="ri-mail-volume-line"></i>
                        </span>
                        <input
                            type="email"
                            className="form-control text-white"
                            style={{
                                background: "rgba(255, 255, 255, 0.2)",
                                border: "none",
                                borderRadius: "10px",
                                padding: "12px",
                            }}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group mb-3">
                        <span className="input-group-text bg-transparent border-light text-white">
                            <i class="ri-lock-2-fill"></i>
                        </span>
                        <input
                            type="password"
                            className="form-control text-white"
                            style={{
                                background: "rgba(255, 255, 255, 0.2)",
                                border: "none",
                                borderRadius: "10px",
                                padding: "12px",
                            }}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className='text-center'>

                        <button type="submit" className="btn w-50"
                            style={{
                                background: "linear-gradient(to right, #00c6ff, #0072ff)",
                                border: "none",
                                borderRadius: "10px",
                                padding: "12px",
                                color: "#fff",
                                fontWeight: "bold",
                                transition: "0.3s",
                            }}
                            onMouseOver={(e) => e.target.style.opacity = "0.8"}
                            onMouseOut={(e) => e.target.style.opacity = "1"}
                            disabled={isLoading} // Disable when loading
                        >
                            {/* Login */}
                            {isLoading ? "Login..." : "Login"}
                        </button>
                    </div>
                </form>

                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
            </div>
        </div>
    );
};

export default Adminlogin;
