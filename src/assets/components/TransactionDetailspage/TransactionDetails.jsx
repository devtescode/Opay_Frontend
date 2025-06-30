import React from "react"
import { ArrowLeft, CheckCircle, ChevronRight, Copy, XCircle, Clock, CheckCircleFill, ChevronLeft } from "react-bootstrap-icons"
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import profileimage from "../../../../public/Image/image.png"
import { getBankLogoByName } from '../BankUtils'

const TransactionDetails = () => {
    const navigate = useNavigate();
    const { state: transaction } = useLocation();
    console.log("Received transaction:", transaction); // ✅ Must not be null
    const BankToBtn = (transaction) => {
        navigate('/storetransaction', { state: transaction });
    }
    const date = new Date(transaction.createdAt);
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

    const logo = getBankLogoByName(transaction.bankName);
    const showLogo = Boolean(logo);
    if (!transaction) {
        return <p className="text-center text-danger">No transaction details available</p>;
    }
    // const handleTransactionClick = (transaction) => {
    //     navigate('/transactiondetails', { state: transaction });
    // };
    return (
        <div className="">

            <div className="bg-light pb-5 mb-5 mx-auto col-md-6 col-sm-12">
                {/* Header */}
                <div className=" fixed-top d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
                    <div className="d-flex align-items-center">

                        <div className="" onClick={() => navigate(-1)}>
                            <ChevronLeft size={18} onClick={BankToBtn} />
                        </div>
                        <h5 className="mb-0 mx-2">Transaction Details</h5>
                    </div>
                    <button className="btn btn-link text-success mx-2">
                        {/* <User size={24} /> */}
                        
                        <img src={profileimage} className="" style={{ height: "29px", width: "24px" }} alt="" />
                    </button>
                </div>

                {/* Transaction Card */}
                <div className="card mx-3 border-0 text-center" style={{ marginTop: "60px" }}>
                    <div className="card-body">
                        {/* <div
                            className={`rounded-circle p-3 d-inline-flex mb-3 ${transaction.status === "pending"
                                ? "bg-warning bg-opacity-10"
                                : transaction.status === "failed"
                                    ? "bg-danger bg-opacity-10"
                                    : "bg-success bg-opacity-10"
                                }`}
                        >
                            {transaction.status === "pending" ? (
                                <Clock className="text-warning" size={32} /> // Pending icon
                            ) : transaction.status === "failed" ? (
                                <XCircle className="text-danger" size={32} /> // Failed icon
                            ) : transaction.status === "failed" ? (
                                <XCircle className="text-danger" size={32} /> // Failed icon
                            ) : transaction.status === "Reversed" ? (
                                <Clock className="text-warning" size={32} />
                            ) : (
                                <CheckCircle className="text-success" size={32} /> // Success icon
                            )}
                        </div> */}

                        <div
                            className={`rounded-circle p-3 d-inline-flex mb-0 ${showLogo
                                    ? "" // No background color if logo exists
                                    : transaction.status === "pending" || transaction.status === "Reversed"
                                        ? "bg-warning bg-opacity-10"
                                        : transaction.status === "failed"
                                            ? "bg-danger bg-opacity-10"
                                            : "bg-success bg-opacity-10"
                                }`}
                        >
                            {showLogo ? (
                                <img
                                    src={logo}
                                    alt={transaction.bankName}
                                    style={{
                                        width: 52,
                                        height: 52,
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                        backgroundColor: "#f0f0f0", // Initial color before failure
                                    }}
                                    className="border"
                                />
                            ) : transaction.status === "pending" || transaction.status === "Reversed" ? (
                                <Clock className="text-warning" size={32} />
                            ) : transaction.status === "failed" ? (
                                <XCircle className="text-danger" size={32} />
                            ) : (
                                <CheckCircle className="text-success" size={32} />
                            )}
                        </div>

                        <p className="text-secondary mb-1 fw-medium">Transfer to {transaction.accountName}</p>
                        <h2 className="mb-1">₦{transaction.amount.toLocaleString()}.00</h2>

                        <div className="d-flex align-items-center justify-content-center gap-2">
                            {/* {transaction.status === "pending" ? (
                                <Clock className="text-warning" size={16} />
                            ) : transaction.status === "failed" ? (
                                <XCircle className="text-danger" size={16} />
                            ) : transaction.status === "Reversed" ? (
                                <Clock className="text-warning" size={16} />
                            ) : (
                                <CheckCircle className="text-success" size={16} />
                            )} */}

                            <span
                                className={`${transaction.status === "pending"
                                    ? "text-warning"
                                    : transaction.status === "failed"
                                        ? "text-danger"
                                        : transaction.status === "Reversed"
                                            ? "text-warning"
                                            : "text-success"
                                    }`}
                            >
                                {transaction.status}
                            </span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div>
                            <div>
                                <div className="mb-4" style={{ padding: "0 10px" }}>
                                    {/* === Icon and Line Row === */}
                                    <div className="w-75 mx-auto d-flex align-items-center justify-content-between position-relative mb-2" style={{ marginBottom: "1rem" }}>
                                        {/* Step 1 icon */}
                                        <div className="d-flex justify-content-center" style={{ width: "24px", height: "24px", zIndex: 1 }}>
                                            <CheckCircleFill className="text-success" size={18} />
                                        </div>

                                        {/* Line 1 */}
                                        <div style={{
                                            flex: 1,
                                            height: "2px",
                                            backgroundColor: "#198754",
                                            margin: "0 5px",
                                            zIndex: 0
                                        }}></div>

                                        {/* Step 2 icon */}
                                        <div className="d-flex justify-content-center" style={{ width: "24px", height: "24px", zIndex: 1 }}>
                                            {transaction.status === "pending" ? (
                                                <Clock className="text-warning" size={18} />
                                            ) : transaction.status === "failed" ? (
                                                <XCircle className="text-danger" size={18} />
                                            ) : transaction.status === "Reversed" ? (
                                                <Clock className="text-warning" size={18} />
                                            ) : (
                                                <CheckCircleFill className="text-success" size={18} />
                                            )}
                                        </div>

                                        {/* Line 2 */}
                                        <div style={{
                                            flex: 1,
                                            height: "2px",
                                            backgroundColor: "#198754",
                                            margin: "0 5px",
                                            zIndex: 0
                                        }}></div>

                                        {/* Step 3 icon */}
                                        <div className="d-flex justify-content-center" style={{ width: "24px", height: "24px", zIndex: 1 }}>
                                            {transaction.status === "pending" ? (
                                                <Clock className="text-warning" size={18} />
                                            ) : transaction.status === "failed" ? (
                                                <XCircle className="text-danger" size={18} />
                                            ) : transaction.status === "Reversed" ? (
                                                <Clock className="text-warning" size={18} />
                                            ) : (
                                                <CheckCircleFill className="text-success" size={18} />
                                            )}
                                        </div>
                                    </div>

                                    {/* === Label and Date Row === */}
                                    <div className="d-flex justify-content-between text-center mx-3">
                                        {/* Step 1 text */}
                                        <div className=" w-25" style={{ width: "70px" }}>
                                            <div style={{ fontSize: "12px", color: "#6c757d" }}>
                                                Payment<br />successful
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#adb5bd" }}>
                                                {formattedDate}
                                            </div>
                                        </div>

                                        {/* Step 2 text */}
                                        <div className=" w-25" style={{ width: "70px" }}>
                                            <div style={{ fontSize: "12px", color: "#6c757d" }}>
                                                Processing<br />by bank
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#adb5bd" }}>
                                                {formattedDate}
                                            </div>
                                        </div>

                                        {/* Step 3 text */}
                                        <div className=" w-25" style={{ width: "70px" }}>
                                            <div style={{ fontSize: "12px", color: "#6c757d" }}>
                                                Received<br />by bank
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#adb5bd" }}>
                                                {formattedDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mx-3">


                                    <div className="mb-1 mx-3 mx-sm-5 bg-light rounded-2 p-1" style={{ fontSize: "10px", color: "#6c757d", lineHeight: "1.4" }}>
                                        <span> The recipient account is expected to be credited within 5 minutes, subject to notification by the bank. If
                                            you have any questions, you can also{" "}
                                            <span className="text-success text-decoration-none" style={{ fontSize: "10px" }}>
                                                contact the recipient bank 📞
                                            </span>
                                        </span>
                                    </div>

                                    {/* Amount Breakdown */}
                                    <div className=" pt-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span style={{ color: "#6c757d" }}>Amount</span>
                                            <span className="text-dark fw-medium">₦{transaction.amount.toLocaleString()}.00</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span style={{ color: "#6c757d" }}>Fee</span>
                                            <div>
                                                <span style={{ color: "#adb5bd", textDecoration: "line-through" }}>₦10.00</span>
                                                <span className="text-dark fw-medium ms-2">₦0.00</span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span style={{ color: "#6c757d" }}>Amount Paid</span>
                                            <span className="text-dark fw-medium">₦{transaction.amount.toLocaleString()}.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >

                {/* Transaction Details */}
                < div className="bg-white p-2 rounded-3 shadow-md mx-3 mt-4" style={{ fontSize: "15px" }}>
                    <div className="card-body ">
                        <h6 className="mb-4 fw-medium" style={{ fontSize: "20px" }}>Transaction Details</h6>

                        <div className="row mb-3">
                            <div className="col-6 text-secondary">Recipient Details</div>
                            <div className="col-6 text-end text-muted">
                                <div className="small">
                                    {transaction.accountName}
                                </div>
                                <div className="text-secondary small">{transaction.bankName} | {transaction.accountNumber}</div>
                            </div>
                        </div>

                        {/* <div className="row mb-3">
                            <div className="col-6 text-secondary">Remark</div>
                            <div className="col-6 text-end">Nepa bills</div>
                        </div> */}

                        <div className="row mb-3">
                            <div className="col-6 text-secondary">Transaction Type</div>
                            <div className="col-6 text-end text-muted">Transfer to Bank Account</div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-6 text-secondary">Transaction No.</div>
                            <div className="col-6 text-end d-flex justify-content-end align-items-center gap-2 text-muted">
                                2501220101009128376046
                                <Copy size={14} className="text-secondary" />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-6 text-secondary">Payment Method</div>
                            <div className="col-6 text-end">
                                <div className="text-muted">Wallet
                                    {/* -₦{transaction.amount.toLocaleString()}.00 */}

                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6 text-secondary">Transaction Date</div>
                            <div className="col-6 text-end text-muted">

                                {/* the a is at the back of the data and time a */}
                                {format(new Date(transaction.createdAt), "MMM do, yyyy hh:mm:ss ")}


                            </div>
                        </div>


                        <div className="row mb-3">
                            <div className="col-6 text-secondary">Session ID</div>
                            <div className="col-6 text-end d-flex justify-content-end align-items-center gap-2 text-muted">
                                1000001971262850939751880
                                <Copy size={14} className="text-secondary" />
                            </div>
                        </div>
                    </div>
                </div >

                {/* More Actions */}
                < div className="bg-white p-2 rounded-3 shadow-md py-4 mx-3 mt-4 mb-5" >
                    <div className="card-body">
                        <h6 className="mb-3 fw-bold">More Actions</h6>
                        <button className="btn btn-link text-dark text-decoration-none d-flex justify-content-between align-items-center w-100 p-0">
                            <span>Category</span>
                            <div className="d-flex align-items-center gap-2">
                                <span>Transfer</span>
                                <ChevronRight />
                            </div>
                        </button>
                    </div>
                </div >

                {/* Bottom Buttons */}
                < div className="fixed-bottom p-4 bg-white shadow-lg" >
                    <div className="d-flex gap-3">
                        <button style={{ background: "#E1F4E9", color: "#2EAB7F" }} className="btn py-2 flex-grow-1 rounded-pill">Report Issue</button>
                        <button style={{ backgroundColor: "#01B575" }} className="btn text-white py-2 flex-grow-1 rounded-pill">Share Receipt</button>
                    </div>
                </div >
            </div >
        </div >
    )
}

export default TransactionDetails