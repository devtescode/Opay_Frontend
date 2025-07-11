import React, { useState } from 'react';
import axios from 'axios';
// import Swal from 'sweetalert2';
import { API_URLS } from '../../../../utils/apiConfig';
import Data from '../Data.json'; // Bank list

const Addmoney = () => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBankChange = (e) => {
    const selectedCode = e.target.value;
    const selectedBank = Data.banks.find((bank) => bank.code === selectedCode);
    if (selectedBank) {
      setBankCode(selectedBank.code);
      setBankName(selectedBank.name);
    }
  };

  const handleAddMoney = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return Swal.fire('Error', 'Please enter a valid amount', 'error');
    }

    if (!accountNumber || !bankCode || !bankName) {
      return Swal.fire('Error', 'All bank details are required', 'error');
    }

    setIsLoading(true);
    console.log({
      amount: Number(amount),
      accountNumber,
      bankCode,
      bankName
    });
    
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        API_URLS.addmoney,
        {
          amount: Number(amount),
          accountNumber,
          bankCode,
          bankName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response, "Get response");
      

      Swal.fire(
        'Success',
        `${Number(amount).toLocaleString()} has been added successfully to your wallet!`,
        'success'
      );

      setAmount('');
      setAccountNumber('');
      setBankCode('');
      setBankName('');
    } catch (error) {
      console.error('Add money error:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to add money', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center text-primary mb-4">Add Money</h2>

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />

        <select
          className="form-select mb-3"
          value={bankCode}
          onChange={handleBankChange}
        >
          <option value="">Select Bank</option>
          {Data.banks.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
        
        <button
          className="btn btn-primary w-50 mx-auto"
          onClick={handleAddMoney}
          disabled={isLoading}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </div>
  );
};

export default Addmoney;
