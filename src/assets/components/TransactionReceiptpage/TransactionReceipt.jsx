import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { ArrowLeft } from 'react-bootstrap-icons';

function TransactionReceipt() {
  return (
    <div className="container py-4" style={{maxWidth: "480px"}}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        {/* <ArrowLeft className="me-2" size={24} /> */}
        <h5 className="mb-0">Share Receipt</h5>
      </div>

      {/* Receipt Card */}
      <div className="card">
        <div className="card-body">
          {/* Logo and Title */}
          <div className="text-center mb-4 border">
            <img 
            //   src={`${process.env.PUBLIC_URL}/opay-logo.png`} 
              alt="OPay" 
              height="40" 
              className="mb-3"
            />
            <h5>Transaction Receipt</h5>
          </div>

          {/* Amount and Status */}
          <div className="text-center mb-4">
            <h2 className="text-success">₦100.00</h2>
            <h5 className="text-success">Successful</h5>
            <small className="text-muted">Jan 20th, 2025 14:50:33</small>
          </div>

          {/* Transaction Details */}
          <div className="mb-3">
            <div className="row mb-2">
              <div className="col-5">
                <span className="text-muted">Recipient Details</span>
              </div>
              <div className="col-7 text-end">
                <span>Palmpay | 8123958568</span>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-5">
                <span className="text-muted">Sender Details</span>
              </div>
              <div className="col-7 text-end">
                <span>OPay | 806****821</span>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-5">
                <span className="text-muted">Transaction Type</span>
              </div>
              <div className="col-7 text-end">
                <span>Transfer to Bank Account</span>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-5">
                <span className="text-muted">Transaction No.</span>
              </div>
              <div className="col-7 text-end">
                <span className="text-break">250120020100886992707982</span>
              </div>
            </div>

            <div className="row">
              <div className="col-5">
                <span className="text-muted">Session ID</span>
              </div>
              <div className="col-7 text-end">
                <span className="text-break">1000042501201350441257512479</span>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center text-muted small">
            <p>Enjoy a better life with OPay. Get free transfers, withdrawals, bill payments, instant loans, and good annual interest on your savings. OPay is licensed by the Central Bank of Nigeria and insured by the NDIC.</p>
          </div>

          {/* Share Buttons */}
          <div className="row g-2 mt-3">
            <div className="col-6">
              <button className="btn btn-outline-success w-100">
                Share as image
              </button>
            </div>
            <div className="col-6">
              <button className="btn btn-outline-success w-100">
                Share as PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionReceipt;