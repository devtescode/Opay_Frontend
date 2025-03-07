import React, { useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../../../../utils/apiConfig';

const Addmoney = () => {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddMoney = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            Swal.fire('Error', 'Please enter a valid amount', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('token'); // User should be authenticated

            const response = await axios.post(
                API_URLS.addmoney,
                { amount: Number(amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.fire('Success', 'Money added successfully!', 'success');
            setAmount('');
        } catch (error) {
            console.error('Add money error:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to add money', 'error');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 col-sm-12 mx-auto shadow-lg text-center p-3" style={{height:"100vh"}}> 
                    <div>
                        <h2>Add Money</h2>
                        <input
                            type="number"
                            className='form-control my-2'
                            placeholder='Enter amount'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button
                            className='btn btn-success'
                            onClick={handleAddMoney}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Addmoney;
