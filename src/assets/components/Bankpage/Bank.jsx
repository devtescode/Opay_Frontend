
import React, { useState } from 'react';
import './BankTransfer.css';
import Data from '../Data.json';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../../../utils/apiConfig';
import TransactionDetailsBanks from '../TransactionDetailsBanks/TransactionDetailsBanks';
import Bet from '../../Image/betimage.png'
import imagebank from '../../Image/imagebank.jpg'

import axios from 'axios';

export default function Bank() {
  const [accountNumber, setAccountNumber] = useState('');
  // const [selectedBank, setSelectedBank] = useState('');
  const [activeTab, setActiveTab] = useState('recents');
  const [accountName, setAccountName] = useState(''); // For showing validated name
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [showAll, setShowAll] = useState(false)
  const [isLoading, setIsLoading] = useState(false); // Track loading state

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
    // console.log(selectedBank);

    if (!selectedBank) {
      alert(`Unknown bank code: ${selectedBankCode}`); // Alerting selected code for debugging
      return;
    }
    try {
      setIsLoading(true); // Disable button
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


        await axios.post(API_URLS.saveRecentTransaction, {
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
    finally {
      setIsLoading(false);
    }
  };

  const HistroyBtn = () => {
    navigate("/storetransaction")
  }


  const handleTransactionSelect = (transaction) => {
    setAccountNumber(transaction.accountNumber);
    // Find the bank code based on the bank name from the Data.banks array
    const bank = Data.banks.find(bank => bank.name === transaction.bankName);
    if (bank) {
      setSelectedBankCode(bank.code);
    }

    // console.log(transaction.bankName);
  };


  const BankBtn = () => {
    navigate("/userdb")
  }
  return (
    <div className="container main-container">
      {/* Header */}
      <div className="header-section d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          {/* <button className="btn btn-link text-dark p-0"> */}
          {/* <i className="bi bi-chevron-left fs-5"></i> */}
          <i class="ri-arrow-left-s-line" onClick={BankBtn}></i>
          {/* </button> */}
          <h5 className="mb-0" >Transfer to Bank Account</h5>
        </div>
        <button className="btn btn-link text-success p-0" onClick={HistroyBtn}>History </button>
      </div>

      {/* Promo Banner */}
      <div className="promo-banner mb-3">
        <img
          src={imagebank}
          className="w-100 rounded-3"
        />
      </div>

      {/* Free Transfers Notice */}
      <div className="free-transfers-notice mb-4 p-2 rounded-3 " style={{ marginTop: "30px" }}>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-lightning-charge-fill text-primary"></i>
          <span className="text-primary ">Free transfers for the day: 3</span>
        </div>
      </div>

      <div className="transfer-form-section mb-4 shadow-sm rounded-3 p-2">
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
                style={{
                  border: "none",            // Removes all borders
                  // borderBottom: "2px solid #000", // Adds only a bottom border
                  backgroundColor: "transparent", // No background color
                  outline: "none",            // Removes blue outline on focus
                  boxShadow: "none",          // No Bootstrap shadow
                  padding: "8px 8px",           // Adds space above text
                  width: "100%",              // Ensures full width
                }}
              />

            </div>
            <div className="mb-3">
              <select
                className="form-select form-select-lg"
                value={selectedBankCode}
                onChange={(e) => setSelectedBankCode(e.target.value)}
                style={{
                  border: "none",            // Removes all borders
                  // borderBottom: "2px solid ", // Adds only a bottom border
                  backgroundColor: "transparent", // No background color
                  outline: "none",            // Removes blue outline on focus
                  boxShadow: "none",          // No Bootstrap shadow
                  padding: "8px 8px",           // Adds space above text
                  width: "100%",              // Ensures full width
                  appearance: "none",         // Removes default dropdown arrow (optional)
                  cursor: "pointer",          // Makes it clear it's clickable
                }}
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
                style={{ backgroundColor: "#01B575" }} className="w-75 btn text-white py-2 flex-grow-1 rounded-pill"
                disabled={isLoading} // Disable when loading
              >
                {isLoading ? "Next" : "Next"}
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
            {/* <i className="bi bi-wifi text-success"></i> */}
            <i class="ri-base-station-fill"></i>
          </div>
          <span>Bank Transfer Success Rate Monitor</span>
        </div>
        <i className="bi bi-chevron-right"></i>
      </div>
      <TransactionDetailsBanks onTransactionSelect={handleTransactionSelect} />
      {/* <TransactionDetailsBanks onTransactionSelect={handleTransactionSelect} /> */}
      <div className="container py-4 shadow-sm rounded-3 mt-4">
        <h3 className="fw-bold mb-4">More Events</h3>

        <div className="d-flex flex-column gap-3">
          {/* Bet9ja Card */}
          <div className="">
            <div className="card-body d-flex align-items-center gap-3">
              <div>
                <img
                  src={Bet}
                  alt="Bet9ja Logo"
                  width={60}
                  height={25}
                  className="rounded"
                />

              </div>
              <div>
                <h2 className="fw-bold" style={{ fontSize: "16px" }}>Register now and Win up to ₦1 Billion!</h2>
                <p className="text-secondary">Get more explosive odds on Bet9ja!</p>
              </div>
            </div>
          </div>

          {/* iLOTBET Card */}
          <div className="">
            <div className="card-body d-flex align-items-center gap-3">
              <div>
                <div
                  className="bg-dark rounded d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <span className="text-success fw-bold small">iLOTBET</span>
                </div>
              </div>
              <div>
                <h2 className="fw-bold" style={{ fontSize: "16px" }}>Predict & Win Up to ₦10,000,000!</h2>
                <p className="text-secondary">Enjoy FREE predictions and unlock your chance to win up to ₦10,000,000!</p>
              </div>
            </div>
          </div>

          {/* Vouchers Card */}
          <div className="">
            <div className="card-body d-flex align-items-center gap-3">
              <div>
                <div
                  className="bg-light rounded d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <div className="position-relative" style={{ width: "32px", height: "32px" }}>
                    <div
                      className="position-absolute top-0 start-0 end-0 bottom-0 bg-danger bg-opacity-25 rounded-circle"
                      style={{ transform: "translateX(-4px)" }}
                    ></div>
                    <div
                      className="position-absolute top-0 start-0 end-0 bottom-0 bg-primary bg-opacity-25 rounded-circle"
                      style={{ transform: "translateX(4px)" }}
                    ></div>
                    <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center text-white fw-bold">
                      %
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="fw-bold" style={{ fontSize: "16px" }}>Mega Savings with 15 Vouchers!</h5>
                <p className="text-secondary">Unlock 15 vouchers for any bill with just ₦199</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

