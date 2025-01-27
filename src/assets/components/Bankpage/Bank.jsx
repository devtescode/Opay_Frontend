
import React, { useState } from 'react';
import './BankTransfer.css';
import Data from '../Data.json';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../../../utils/apiConfig';
import TransactionDetailsBanks from '../TransactionDetailsBanks/TransactionDetailsBanks';
import axios from 'axios';

export default function Bank() {
  const [accountNumber, setAccountNumber] = useState('');
  // const [selectedBank, setSelectedBank] = useState('');
  const [activeTab, setActiveTab] = useState('recents');
  const [accountName, setAccountName] = useState(''); // For showing validated name
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [showAll, setShowAll] = useState(false)

  const navigate = useNavigate()

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAccountNumber(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input Validation
    if (!accountNumber || !selectedBankCode) {
      alert('Please fill in all fields.');
      return;
    }

    if (accountNumber.length !== 10) {
      alert('Account number must be 10 digits.');
      return;
    }

    // const bankCode = selectedBank; 

    const selectedBank = Data.banks.find((bank) => bank.code === selectedBankCode);


    if (!selectedBank) {
      alert(`Unknown bank code: ${selectedBankCode}`); // Alerting selected code for debugging
      return;
    }
    try {
      const response = await fetch(API_URLS.useraccount, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          AccountNumber: accountNumber,
          Bankcode: selectedBankCode,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status) {
        setAccountName(data.accountName); // Update account name

        // Save details to localStorage
        const accountDetails = {
          accountName: data.accountName,
          accountNumber,
          // bankName: selectedBank,
          bankName: selectedBank.name, // Save the bank name here
          // accountName: data.accountName,
        };

        localStorage.setItem("selectedAccount", JSON.stringify(accountDetails));

        
        // const userId = JSON.parse(localStorage.getItem("user")).userData.userId;
        const userId = JSON.parse(localStorage.getItem('user')).userId;
        
        
        await axios.post(API_URLS.saveRecentTransaction , {
          userId,
          accountDetails,
        });
        
        navigate("/transfer")
      } else {
        alert(data.message || 'Failed to validate account.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to connect to the server. Please try again later.');
    }
  };

  const HistroyBtn=()=>{
    navigate("/storetransaction")
  }

  return (
    <div className="container main-container">
      {/* Header */}
      <div className="header-section d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-link text-dark p-0">
            {/* <i className="bi bi-chevron-left fs-5"></i> */}
            <i class="ri-arrow-left-s-line"></i>
          </button>
          <h5 className="mb-0">Transfer to Bank Account</h5>
        </div>
        <button className="btn btn-link text-success p-0" onClick={HistroyBtn}>History </button>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner mb-3">
        {/* <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-16%20at%2015.33.22_4062ae61.jpg-Tb0bl4oo1PobEngZ2vvZz04R74SJTF.jpeg" 
          alt="Promo Banner" 
          className="w-100 rounded-3"
        /> */}
      </div>

      {/* Free Transfers Notice */}
      <div className="free-transfers-notice mb-4 p-2 rounded-3">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-lightning-charge-fill text-primary"></i>
          <span className="text-primary">Free transfers for the day: 3</span>
        </div>
      </div>

      <div className="transfer-form-section mb-4 border rounded-2 p-2">
        <h5 className="mb-3">Recipient Account</h5>
        <form onSubmit={handleSubmit}>
          <div className=''>
            <div className="mb-1">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter 10 digits Account Number"
                value={accountNumber}
                onChange={handleAccountNumberChange}
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select form-select-lg"
                value={selectedBankCode}
                onChange={(e) => setSelectedBankCode(e.target.value)}
              >
                <option value="">Select Bank</option>
                {Data.banks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='text-center'>
              <button
                type="submit"
                className="btn btn-success w-75 p-2 rounded-5"
              >
                Next
              </button>
            </div>
          </div>
        </form>
        {/* {accountName && (
                <div className="mt-3">
                    <h4>Validated Account:</h4>
                    <p>{accountName}</p>
                </div>
            )} */}
      </div>

      {/* Success Rate Monitor */}
      <div className="success-monitor mb-4 p-3 rounded-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div className="monitor-icon">
            <i className="bi bi-wifi text-success"></i>
          </div>
          <span>Bank Transfer Success Rate Monitor</span>
        </div>
        <i className="bi bi-chevron-right"></i>
      </div>
      <TransactionDetailsBanks />
    </div>
  );
}

