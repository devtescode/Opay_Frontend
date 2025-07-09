import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URLS } from '../../../../utils/apiConfig';
import { ChevronLeft } from 'react-bootstrap-icons';
import html2pdf from "html2pdf.js";
import watermarkImage from "../../Image/image.jpg"
import html2canvas from 'html2canvas';
import opaylogo from "../../../../public/OPAY-LOGO.png"

function TransactionReceipt({ initialStatus }) {
  const location = useLocation();
  const passedTransaction = location.state;
  // console.log("Transaction ID received as prop:", transactionId);
  const [amount, setAmount] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [userfullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(''); // For storing phone number
  const { state: transaction } = useLocation();

  // console.log("Received transaction:", transaction); // ✅ Must not be null
  const navigate = useNavigate()

  useEffect(() => {
    const savedAmount = localStorage.getItem("transferAmount");
    if (savedAmount) {
      setAmount(parseFloat(savedAmount));
    }

    const storedAccount = localStorage.getItem("selectedAccount");
    if (storedAccount) {
      setAccountDetails(JSON.parse(storedAccount));
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setFullName(user.fullname); // ✅ correct key
      setPhoneNumber(user.phoneNumber);
    }
  }, []);

  const [transactionTime, setTransactionTime] = useState("");
  // This creates a state variable to store the formatted time

  useEffect(() => {
    if (passedTransaction) {
      setAccountDetails({
        accountName: passedTransaction.accountName,
        accountNumber: passedTransaction.accountNumber,
        bankName: passedTransaction.bankName,
      });
      setAmount(passedTransaction.amount);
      setStatus(passedTransaction.status); // ✅ Set the status here
      setTransactionId(passedTransaction._id);
      if (passedTransaction.createdAt) {
        const formattedTime = new Date(passedTransaction.createdAt)
          .toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        setTransactionTime(formattedTime); // Update the state
      }
      // console.log("Using NAVIGATION transaction ID:", passedTransaction._id);
      // console.log("Raw createdAt:", passedTransaction?.createdAt);

    } else {
      const savedAmount = localStorage.getItem("transferAmount");
      if (savedAmount) {
        setAmount(parseFloat(savedAmount));
      }

      const storedAccount = localStorage.getItem("selectedAccount");
      if (storedAccount) {
        setAccountDetails(JSON.parse(storedAccount));
      }

      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setFullName(user.fullname);
        setPhoneNumber(user.phoneNumber);
      }
    }
  }, [passedTransaction]);


  const getOrdinal = (day) => {
    const suffix = ["th", "st", "nd", "rd"];
    const value = day % 100;
    return day + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
  };

  const formatDate = (customDate) => {
    const date = customDate ? new Date(customDate) : new Date();

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    let formattedDate = date.toLocaleString("en-US", options);
    formattedDate = formattedDate.replace(date.getDate(), getOrdinal(date.getDate()));
    return formattedDate;
  };

  const BackBtn = () => {
    navigate("/transfersuccess")
  }


  const [status, setStatus] = useState(initialStatus || "successful");

  const handleDoubleTap = async () => {
    let newStatus;
    if (status === 'successful') {
      newStatus = 'pending';
    } else if (status === 'pending') {
      newStatus = 'failed';
    } else {
      newStatus = 'successful';
    }

    if (!transactionId || transactionId === "undefined") {
      console.error("Invalid transaction ID:", transactionId);
      return;
    }


    try {
      // http://localhost:4000/useropay/changetransactions/${transactionId}
      await axios.put(API_URLS.changetransactions(transactionId), { status: newStatus });
      setStatus(newStatus); // Update status locally after the request succeeds
      // console.log("✅ Status updated for:", transactionId);
    } catch (error) {
      console.error('Error updating transaction status:', error);
    }
  };


  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    const storedTransactionId = localStorage.getItem("transactionId");
    if (storedTransactionId) {
      setTransactionId(storedTransactionId);
    }
  }, []);
  if (transactionId === null) {
    return;
  }

  const SharePDF = async () => {
    const element = document.querySelector(".receipt-container");

    if (!element) {
      alert("Receipt not found!");
      return;
    }

    const logoImg = element.querySelector("img");
    if (logoImg && !logoImg.complete) {
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
      });
    }

    const options = {
      margin: 0.3,
      filename: `Transaction-Receipt-${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(options).from(element).save();

    // ✅ Show the saved message for 3 seconds
    const messageDiv = document.getElementById("pdf-saved-message");
    if (messageDiv) {
      messageDiv.style.display = "block";

      setTimeout(() => {
        messageDiv.style.display = "none";
      }, 3000);
    }
  };

  return (
    <>
      <div className='shadow'>
        <div className=" py-3 d-flex align-items-center shadow col-md-5 col-sm-12 mx-auto p-2" >

          <p className=" mb-0 d-flex text-muted d-flex align-items-center" style={{ alignItems: "center" }}>
            <ChevronLeft className='mx-2' size={15} onClick={BackBtn} />
            Share Receipt
          </p>
        </div>
      </div>
      <div
        id="pdf-saved-message"
        style={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#FBFBFB',
          color: 'black',
          padding: '10px 20px',
          borderRadius: '10px',
          fontSize: '16px',
          display: 'none',
          zIndex: 9999,
        }}
      >
        PDF Saved
      </div>

      <div className='receipt-container'>
        <div className='' style={{ backgroundColor: "#F8F8FA", height: "90vh" }}>

          <div
            className="col-md-5 mx-auto col-12 border border-light"
            style={{ maxWidth: "95%" }}
          >

            <div
              style={{
                mask: "radial-gradient(10px at top, #0000 calc(100% - 1px), #000) 50% / 33px 100%",
                WebkitMask: "radial-gradient(15px at top, #0000 calc(100% - 1px), #000) 50% / 41px 100%",
                height: "30px"
              }}
              className='bg-white mt-4'
            >
            </div>
            <div className=''>

            </div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                margin: '0 auto',
                backgroundColor: 'white',
                overflow: 'hidden'
              }}
            >
              <div className="card border-0">
                <div
                  className="watermark-container"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    transform: 'rotate(-18deg)',
                    transformOrigin: '0 0',
                    pointerEvents: 'none',
                    zIndex: 0,
                    width: '150%',
                    height: '150%',
                    marginLeft: '-25%',
                    marginTop: '30%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '40px 50px',
                    alignContent: 'flex-start',
                    padding: '20px'
                  }}
                >
                  {Array.from({ length: 200 }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '30px',
                        color: '#000',
                        opacity: 0.04,

                      }}
                      className='fw-bold'
                    >
                      OPay
                    </span>
                  ))}
                </div>




                <div className="card-body position-relative" style={{ zIndex: 1 }}>

                  <div className="text-center mb-2 d-flex justify-content-between" style={{ alignItems: "center", marginTop: "-10px" }}>
                    <img
                      // src="https://images.seeklogo.com/logo-png/50/1/opay-new-2023-logo-png_seeklogo-503616.png"
                      src={opaylogo}
                      alt="Image description"
                      height="50"
                      
                    />

                    <h5 className='text-muted'>Transaction Receipt</h5>
                  </div>

                  <div className="text-center mb-0">
                    <h2
                      className="mb-1"
                      style={{ color: "#01B575" }}
                    >
                      {amount !== null
                        ? `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : "Loading..."}
                    </h2>

                    <h5
                      onClick={handleDoubleTap}
                      className={`text-${status === "pending" ? "warning" : status === "failed" ? "danger" : "dark"} mb-0`}
                      style={{ fontWeight: "normal", cursor: "pointer" }}
                    >
                      {status
                        ? status.charAt(0).toUpperCase() + status.slice(1)
                        : "Loading..."}
                    </h5>

                    <small className="text-muted">
                      {passedTransaction
                        ? formatDate(passedTransaction.createdAt)
                        : formatDate()
                      }
                    </small>
                  </div>
                  <hr />
                  <div className="mb-3">
                    <div className="row mb-2">
                      <div className="col-5">
                        <span className="text-muted">Recipient Details</span>
                      </div>
                      <div className="col-7 text-end">

                        {accountDetails ? (
                          <div>
                            <p className="mb-1 text-muted" style={{ fontSize: "12px" }}>{accountDetails.accountName}</p>
                            <p className="mb-0 text-muted">
                              <span>{accountDetails.bankName}</span> | <span
                                style={{ userSelect: "text" }}
                                onClick={() => {
                                  setTimeout(() => {
                                    window.getSelection()?.removeAllRanges();
                                  }, 5000);
                                }}
                              >{accountDetails.accountNumber}</span>
                            </p>
                          </div>
                        ) : (
                          <p>No account details found. Please go back and select an account.</p>
                        )}
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col-5">
                        <span className="text-muted">Sender Details</span>
                      </div>
                      <div className="col-7 text-end">


                        <div>

                          <p className="mb-1 text-muted" style={{ fontSize: "12px", textTransform: "uppercase" }}>{userfullName ? userfullName : "No user data found"}</p>
                          <p className="mb-0 text-muted">
                            Opay |  {phoneNumber && ` ${phoneNumber.slice(0, 3)}****${phoneNumber.slice(7)}`}
                          </p>

                        </div>

                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col-5">
                        <span className="text-muted">Transaction No.</span>
                      </div>
                      <div className="col-7 text-end">
                        <span className="text-break text-muted" >{transactionId}</span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-5">
                        <span className="text-muted">Session ID</span>
                      </div>
                      <div className="col-7 text-end">
                        <span className="text-break text-muted">100004250120135044125751241279</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-muted small " style={{ fontSize: "9px", marginTop: "30px" }}>
                    <p style={{ textAlign: "justify" }}>Enjoy a better life with OPay. Get free transfers, withdrawals, bill payments, instant loans, and good annual interest on your savings. OPay is licensed by the Central Bank of Nigeria and insured by the NDIC.</p>
                  </div>


                </div>
              </div>
            </div>
            <div
              style={{
                // mask: "radial-gradient(15px at bottom, #0000 calc(100% - 1px), #000) 50% / 27.75px 100%",
                // WebkitMask: "radial-gradient(15px at bottom, #0000 calc(100% - 1px), #000) 50% / 36.75px 100%",
                mask: "radial-gradient(10px at bottom, #0000 calc(100% - 1px), #000) 50% / 33px 100%",
                WebkitMask: "radial-gradient(15px at bottom, #0000 calc(100% - 1px), #000) 50% / 41px 100%",
                height: "30px"
              }}
              className='bg-white'
            >
            </div>
          </div>
        </div>
        <div className="row g-2 mt-3 fixed-bottom bg-white" style={{ alignItems: "center" }}>
          <div className='d-flex justify-content-between p-2' style={{ alignItems: "center" }}>


            <div lassName="text-center" style={{ alignItems: "center", color: "#01B575" }}>

              <div className='d-flex mx-2' style={{ alignItems: "center" }}>
                <div className=''>
                  <i class="ri-image-2-line fs-5"></i>
                </div>
                <div className='mx-1'>
                  Share as image
                </div>
              </div>
            </div>

            <div className=" text-center" style={{ alignItems: "center" }}>

              <div className='d-flex' style={{ alignItems: "center" }}>
                <div className='text-muted'>
                  |
                </div>

              </div>
            </div>

            <div className="text-center mx-3" style={{ alignItems: "center", color: "#01B575" }}>

              <div className='d-flex' onClick={SharePDF} style={{ alignItems: "center" }}>
                <div className=''>
                  <i class="ri-file-pdf-2-line fs-5"></i>
                </div>
                <div className='mx-1'>
                  Share as PDF

                </div>

              </div>
            </div>


          </div>
        </div>
      </div>
    </>

  );
}

export default TransactionReceipt;