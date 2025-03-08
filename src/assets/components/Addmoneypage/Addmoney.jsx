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
    
            Swal.fire('Success', `${Number(amount).toLocaleString()} has been added successfully to your wallet!`, 'success');
            setAmount('');
        } catch (error) {
            console.error('Add money error:', error);
            Swal.fire('Error', error.response?.data?.message || 'Failed to add money', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    


  
  


    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center text-primary mb-4">Add Money</h2>
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="btn btn-primary w-50 mx-auto"
          onClick={handleAddMoney}
          disabled={isLoading || !amount}
        >
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
    );
};

export default Addmoney;
