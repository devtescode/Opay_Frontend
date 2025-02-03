import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after login
import axios from 'axios'; // For API requests
import { Container, Form, Button, Image } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
// import LoginProfile from "../../../../public/Image/Profile.jpg";
import image from "../../../../public/Image/image.jpg";
import { API_URLS } from '../../../../utils/apiConfig';

const UserLogin = () => {
    const [password, setPassword] = useState(''); // Store password input
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // For error handling
    const [username, setUsername] = useState(''); // For storing username
    const [phoneNumber, setPhoneNumber] = useState(''); // For storing phone number
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser); // Parse the stored string into an object
            setUsername(parsedUser.username); // Set the username
            setPhoneNumber(parsedUser.phoneNumber); // Set the phone number
        }
    }, []);
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Disable button
        try {
            const response = await axios.post(API_URLS.userlogin, { password }); // Replace with your API endpoint

            // Assuming a successful response contains user details and a token
            if (response.status === 200) {
                const { token, user } = response.data;

                // Save token and user data to localStorage or context (optional)
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Navigate to dashboard
                navigate('/userdb');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.response?.data?.message || 'Network issue. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center py-5" style={{ maxWidth: '400px' }}>
            {/* Profile Section */}
            <Image
                src={image}
                style={{ width: '80px', height: '60px', objectFit: 'contain' }}
            />
            <div className="text-center mb-4">
                <div className="position-relative d-inline-block mb-2">
                    <Image
                        // src={LoginProfile}
                        src='https://imgs.search.brave.com/bxCCyib87iQyOj5bfkpD7EJYOE_guuCNV5dH5-6folo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzExLzY5LzIz/LzM2MF9GXzExMTY5/MjM0Nl9GbUZsc29W/NHBhcFRmbVV2OEhC/S0lHbTNtT1ZKeENW/My5qcGc'
                        alt="Profile"
                        roundedCircle
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                </div>
                <h6 className="mb-4">
                    {username ? username : 'Welcome'}
                    {/* {phoneNumber && ` (${phoneNumber.slice(0, 3)}****${phoneNumber.slice(7)})`} */}
                    {phoneNumber && ` (${phoneNumber.slice(0, 3)}****${phoneNumber.slice(7)})`}
                </h6>
            </div>

            {/* Login Form */}
            <Form className="w-100" onSubmit={handleLogin}>
                <div className="position-relative mb-4">
                    <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter 6-digit Password"
                        className="py-2 px-3 border-1"
                        style={{ borderColor: '#00B974' }}
                        maxLength={14}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        variant="link"
                        className="position-absolute top-50 end-0 translate-middle-y text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                    >
                        {showPassword ? <EyeSlashFill size={20} /> : <EyeFill size={20} />}
                    </Button>
                </div>

                {errorMessage && (
                    <div className="text-danger text-center mb-4">
                        {errorMessage}
                    </div>
                )}

                <div className="text-end mb-4">
                    <Button variant="link" className="text-decoration-none p-0" style={{ color: '#00B974' }}>
                        Forgot Password?
                    </Button>
                </div>

                <div className="text-center">
                    <Button
                        type="submit"
                        variant="success"
                        className="w-75 py-2 mb-5 rounded-5"
                        style={{ backgroundColor: "#00B974", borderColor: "#00D632" }}
                        disabled={isLoading} // Disable when loading
                    >
                        {isLoading ? "Login" : "Login"}
                    </Button>
                </div>

                <div className="d-flex justify-content-between mb-5">
                    <Button variant="link" className="text-decoration-none p-0" style={{ color: '#00B974' }}>
                        Switch Account
                    </Button>
                    <Button variant="link" className="text-decoration-none p-0" style={{ color: '#00B974' }}>
                        Login with FingerPrint
                    </Button>
                </div>

                {/* Footer */}
                <div className="text-center text-muted" style={{ fontSize: '0.8rem' }}>
                    <span>Licensed by the </span>
                    <strong>CBN</strong>
                    <span> and insured by the </span>
                    <strong>NDIC</strong>
                </div>
            </Form>
        </Container>
    );
};

export default UserLogin;
