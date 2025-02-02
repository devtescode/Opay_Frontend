import React from "react"
import { ArrowLeft, CheckCircle, ChevronRight, Copy,  XCircle, Clock } from "react-bootstrap-icons"
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";


const TransactionDetails = () => {
    const navigate = useNavigate();
    const { state: transaction } = useLocation();
    const BankToBtn = () => {
        navigate("/storetransaction")
    }
    if (!transaction) {
        return <p className="text-center text-danger">No transaction details available</p>;
    }
    return (
        <div className="">
            <div className="bg-light pb-5 mb-5 mx-auto col-md-6 col-sm-12">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center p-3 bg-white">
                    <button className="btn btn-link text-dark" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} onClick={BankToBtn} />
                    </button>
                    <h5 className="mb-0">Transaction Details</h5>
                    <button className="btn btn-link text-success">
                        {/* <User size={24} /> */}
                    </button>
                </div>

                {/* Transaction Card */}
                <div className="card mx-3 mt-4 border-0 text-center">
                    <div className="card-body">
                        <div
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
                            ) : (
                                <CheckCircle className="text-success" size={32} /> // Success icon
                            )}
                        </div>

                        <p className="text-secondary mb-1">Transfer to {transaction.accountName}</p>
                        <h2 className="mb-1">₦{transaction.amount.toLocaleString()}.00</h2>

                        <div className="d-flex align-items-center justify-content-center gap-2">
                            {transaction.status === "pending" ? (
                                <Clock className="text-warning" size={16} />
                            ) : transaction.status === "failed" ? (
                                <XCircle className="text-danger" size={16} />
                            ) : (
                                <CheckCircle className="text-success" size={16} />
                            )}

                            <span
                                className={`${transaction.status === "pending"
                                        ? "text-warning"
                                        : transaction.status === "failed"
                                            ? "text-danger"
                                            : "text-success"
                                    }`}
                            >
                                {transaction.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Transaction Details */}
                <div className="card mx-3 mt-4">
                    <div className="card-body ">
                        <h6 className="mb-4 fw-bold ">Transaction Details</h6>

                        <div className="row mb-3">
                            <div className="col-6 text-secondary">Recipient Details</div>
                            <div className="col-6 text-end text-muted">
                                {transaction.accountName}
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
                                <div className="text-muted">Wallet -₦{transaction.amount.toLocaleString()}.00</div>

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6 text-secondary">Transaction Date</div>
                            <div className="col-6 text-end text-muted">
                                {/* {new Date(transaction.createdAt).toLocaleString()} */}
                                {format(new Date(transaction.createdAt), "MMM do, yyyy hh:mm:ss a")}
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
                </div>

                {/* More Actions */}
                <div className="card mx-3 mt-4 mb-5">
                    <div className="card-body">
                        <h6 className="mb-3 fw-bold">More Actions</h6>
                        <button className="btn btn-link text-dark text-decoration-none d-flex justify-content-between align-items-center w-100 p-0">
                            <span>Choose Category</span>
                            <div className="d-flex align-items-center gap-2">
                                <span>Transfer</span>
                                <ChevronRight />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="fixed-bottom p-4 bg-white shadow-lg">
                    <div className="d-flex gap-3">
                        <button className="btn btn-outline-success flex-grow-1 rounded-pill">Report an issue</button>
                        <button className="btn btn-success flex-grow-1 rounded-pill">Share Receipt</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionDetails