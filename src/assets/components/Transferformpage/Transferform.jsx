import React, { useEffect, useState } from "react";
import Transfermodal from "../Transfermodalpage/Transfarmodal";

function Transferform() {
    const [amount, setAmount] = useState("");
    const [remark, setRemark] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [accountDetails, setAccountDetails] = useState(null);

    const handleAmountClick = (value) => {
        setAmount(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowModal(true); // Show modal on confirm
    };


    useEffect(() => {
        const storedAccount = localStorage.getItem("selectedAccount");
        if (storedAccount) {
            setAccountDetails(JSON.parse(storedAccount));
        }
    }, []);

    return (
        <div className="" style={{height:"100vh", }}>
            
            <div className=" shadow-sm col-md-6 mx-auto col-sm-12" style={{ borderRadius: "12px", backgroundColor:"#F8F8FA" }}>
                <div className="card-header text-start bg-white text-center py-3 bg-white">
                    <h6 className="mb-1 text-start"><i class="ri-arrow-left-s-line mx-2"></i> Transfer to Bank Account</h6>
                </div>
                <div className="card-body p-2">
                    <div className="d-flex align-items-center py-4 ">
                        {/* <img
                            src="https://via.placeholder.com/50"
                            alt="Bank Logo"
                            className="rounded-circle"
                            style={{ marginRight: "15px" }}
                        /> */}
                         {accountDetails ? (
                        <div>
                            <h6 className="mb-1"> {accountDetails.accountName}</h6>
                            <p className="mb-0 text-muted"> {accountDetails.accountNumber} {accountDetails.bankName}</p>
                        </div>
                         ) : (
                            <p>No account details found. Please go back and select an account.</p>
                         )}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 bg-white p-2 rounded-3 ">
                            <label className="form-label text-muted">Amount</label>
                            <input
                                // type="number"
                                className="form-control"
                                placeholder="₦100.00 - ₦5,000,000.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                            <div className="d-flex mt-2 gap-2 ">
                                {[500, 1000, 2000, 3000, 4000, 5000].map((val) => (
                                    <button
                                        type="button"
                                        key={val}
                                        className=" btn btn-outline-secondary btn-sm"
                                        onClick={() => handleAmountClick(val)}
                                    >
                                        ₦{val.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4 bg-white p-2 rounded-3 py-3">
                            <label className="form-label text-muted">Remark</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="What's this for? (Optional)"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </div>
                        <div className="w-75 mx-auto mt-5">
                            <button
                                type="submit"
                                className="btn btn-success w-100 p-2"
                                style={{ borderRadius: "20px" }}
                            >
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showModal && <Transfermodal/>}
        </div>
    );
}

export default Transferform;
