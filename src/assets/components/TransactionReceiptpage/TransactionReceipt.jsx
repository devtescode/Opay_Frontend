import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../../../../utils/apiConfig';
import { ChevronLeft } from 'react-bootstrap-icons';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { ArrowLeft } from 'react-bootstrap-icons';

function TransactionReceipt({ initialStatus }) {

  // console.log("Transaction ID received as prop:", transactionId);
  const [amount, setAmount] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [userfullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(''); // For storing phone number
  const navigate = useNavigate()
  useEffect(() => {
    const savedAmount = localStorage.getItem("transferAmount");
    if (savedAmount) {
      setAmount(parseFloat(savedAmount));
    }
    // Retrieve selected account details from localStorage
    const storedAccount = localStorage.getItem("selectedAccount");
    if (storedAccount) {
      setAccountDetails(JSON.parse(storedAccount));
    }

    // Retrieve the user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData); // Parse the JSON string
      setFullName(user.fullname); // Set the fullname in state
      setPhoneNumber(user.phoneNumber);
    }
  }, []);

  const getOrdinal = (day) => {
    const suffix = ["th", "st", "nd", "rd"];
    const value = day % 100;
    return day + (suffix[(value - 20) % 10] || suffix[value] || suffix[0]);
  };

  const formatDate = () => {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    };
    let formattedDate = now.toLocaleString("en-US", options);
    let day = now.getDate();
    formattedDate = formattedDate.replace(day, getOrdinal(day));
    return formattedDate;
  };

  const BackBtn = () => {
    navigate("/transfersuccess")
  }

  // const [status, setStatus] = useState(initialStatus); // Set initial status from backend
  const [status, setStatus] = useState(initialStatus || "successful"); // Default to "pending" if undefined

  // Function to handle double-tap
  const handleDoubleTap = async () => {
    let newStatus;
    if (status === 'successful') {
      newStatus = 'pending';
    } else if (status === 'pending') {
      newStatus = 'failed';
    } else {
      newStatus = 'successful';
    }

    // if (!transactionId) {
    //   console.error("Transaction ID is missing!");
    //   return;
    // }

    if (!transactionId || transactionId === "undefined") {
      console.error("Invalid transaction ID:", transactionId);
      return;
    }


    try {
      // http://localhost:4000/useropay/changetransactions/${transactionId}
      await axios.put(API_URLS.changetransactions(transactionId), { status: newStatus });
      setStatus(newStatus); // Update status locally after the request succeeds
      // console.log("Transaction ID:", transactionId);
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
  }, []); // Empty dependency array means this runs only once when the component mounts

  if (transactionId === null) {
    return <p>Loading...</p>; // Optional: Show loading if transactionId isn't available yet
  }

  return (
    <>
      <div className="py-3 d-flex align-items-center shadow-lg col-md-5 col-sm-12 mx-auto p-2" >
        {/* <ArrowLeft className="me-2" size={24} /> */}
        <p className=" mb-0 d-flex text-muted d-flex align-items-center" style={{ alignItems: "center" }}>
          <ChevronLeft className='mx-2 ' size={15} onClick={BackBtn} />
          Share Receipt
        </p>
      </div>
      <div className="col-md-6 mx-auto col-sm-12 mt-2" style={{ maxWidth: "580px" }}>
        {/* Header */}

        {/* Receipt Card */}
        <div className="card border-0">
          <div className="card-body">
            {/* Logo and Title */}
            <div className="text-center mb-4 d-flex justify-content-between" style={{ alignItems: "center" }}>
              <img
                src="https://images.seeklogo.com/logo-png/50/1/opay-new-2023-logo-png_seeklogo-503616.png"
                alt="Image description"
                height="95"
                className=""
              />

              <h5 className='text-muted'>Transaction Receipt</h5>
            </div>

            {/* Amount and Status */}
            <div className="text-center mb-4">
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

              <small className="text-muted">{formatDate()}</small>
            </div>


            {/* {format(new Date(transaction.createdAt), "MMM do, yyyy hh:mm:ss a")} */}
            {/* + "ful" */}
            <hr />

            {/* Transaction Details */}
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
                        {accountDetails.bankName} | {accountDetails.accountNumber}
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

                  {/* {accountDetails ? ( */}
                  <div>

                    <p className="mb-1 text-muted" style={{ fontSize: "12px", textTransform: "uppercase" }}>{userfullName ? userfullName : "No user data found"}</p>
                    <p className="mb-0 text-muted">
                      Opay |  {phoneNumber && ` ${phoneNumber.slice(0, 3)}****${phoneNumber.slice(7)}`}
                    </p>
                  </div>
                  {/* ) : (
                    <p>No account details found. Please go back and select an account.</p>
                  )} */}
                </div>
              </div>
              {/* <div className="row mb-2">
                <div className="col-5">
                  <span className="text-muted">Transaction Type</span>
                </div>
                <div className="col-7 text-end">
                  <span className="text-muted">Transfer to Bank Account</span>
                </div>
              </div> */}

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

            <div className="text-center text-muted small " style={{ fontSize: "9px", marginTop: "50px" }}>
              <p style={{ textAlign: "justify" }}>Enjoy a better life with OPay. Get free transfers, withdrawals, bill payments, instant loans, and good annual interest on your savings. OPay is licensed by the Central Bank of Nigeria and insured by the NDIC.</p>
            </div>


          </div>
        </div>
        <div className="row g-2 mt-3 fixed-bottom shadow-lg " style={{ alignItems: "center" }}>
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
                {/* <div>
                  |
                </div> */}
              </div>
            </div>

            <div className="text-center mx-3" style={{ alignItems: "center", color: "#01B575" }}>

              <div className='d-flex' style={{ alignItems: "center" }}>
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