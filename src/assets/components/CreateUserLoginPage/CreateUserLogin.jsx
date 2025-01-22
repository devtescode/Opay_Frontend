import React, { useState } from 'react'
import Navbar from '../Navbarpage/Navbar'
import NavbarTop from '../NavbarToppage/NavbarTop'
import axios from 'axios';
import { API_URLS } from '../../../../utils/apiConfig';

const CreateUserLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullname: '',
        phoneNumber: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(API_URLS.createuser, formData);
            alert(response.data.message);
            console.log("Admin create details",response.data.message);
            
        } catch (error) {
            alert('Error creating user');
        }
    };

    return (
        <div>
            <Navbar />
            <NavbarTop />
            <div className='container'>
                <div className="row">
                    <div className="col-md-6 col-sm-12 bg-light mx-auto">
                        <h4>Create Details</h4>
                        <div className='p-2'>
                            <input type="text"
                                name="username"
                                onChange={handleChange}
                                value={formData.username}
                                className='form-control my-2'
                                placeholder='Username' />

                            <input type="text"
                                name="fullname"
                                onChange={handleChange}
                                value={formData.fullname}
                                className='form-control my-2'
                                placeholder='Fullname' />

                            <input
                                name="phoneNumber"
                                onChange={handleChange}
                                value={formData.phoneNumber}
                                type="text" className='form-control my-2'
                                placeholder='Phone Number' />

                            <input
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                value={formData.password}
                                type="text"
                                className='form-control my-2' />

                            <div className='text-center' onClick={handleSubmit}>
                                <button className='btn btn-secondary'>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUserLogin