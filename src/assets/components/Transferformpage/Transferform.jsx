import React, { useEffect, useState } from "react";
import Transfermodal from "../Transfermodalpage/Transfarmodal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Transferform() {
    const [amount, setAmount] = useState(""); // Changed `amountenter` to `amount`
    const [remark, setRemark] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [accountDetails, setAccountDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Track loading state


    const handleAmountClick = (value) => {
        setAmount(value); // Set the selected amount directly
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true); // Disable button at the start of submission

        // Validate the amount
        if (!amount || isNaN(amount) || amount < 100 || amount > 5000000) {
            alert("Please enter a valid amount between ₦100.00 and ₦5,000,000.00");
            setIsLoading(false); // Re-enable button after validation fails
            return;
        }

        // Save the amount to localStorage
        localStorage.setItem("transferAmount", amount);

        // Open the modal
        setShowModal(true);

        // Re-enable the button after modal is set
        setIsLoading(false);
    };


    // const location = useLocation();
    // useEffect(() => {
    //     if (location.state?.transaction) {
    //         setAccountDetails(location.state.transaction);
    //     }
    // }, [location.state]);


    // useEffect(() => {
    //     // Retrieve selected account details from localStorage
    //     const storedAccount = localStorage.getItem("selectedAccount");
    //     if (storedAccount) {
    //         setAccountDetails(JSON.parse(storedAccount));
    //     }
    // }, []);


    const location = useLocation();
    useEffect(() => {
        if (location.state?.transaction) {
            setAccountDetails(location.state.transaction);
        } else {
            // Fallback to localStorage if no transaction was passed
            const storedAccount = localStorage.getItem("selectedAccount");
            if (storedAccount) {
                setAccountDetails(JSON.parse(storedAccount));
            }
        }
    }, [location.state]);

    const closeModal = () => {
        setShowModal(false); // Close modal and reset its visibility state
    };
    const navigate = useNavigate()
    const TransfarBtn = () => {
        navigate("/bank")
    }
    return (
        <div className="transfer-form-container" style={{ height: "100vh" }}>
            <div
                className="shadow-sm col-md-6 mx-auto col-sm-12"
                style={{ borderRadius: "12px", backgroundColor: "#F8F8FA" }}
            >
                <div className="card-header text-start bg-white text-center py-3 bg-white">
                    <h6 className="mb-1 text-start">
                        <i className="ri-arrow-left-s-line mx-2" onClick={TransfarBtn}></i> Transfer to Bank Account
                    </h6>
                </div>
                <div className="card-body p-2">
                    <div className="d-flex align-items-center py-4">
                        {accountDetails ? (
                            <div>
                                <h6 className="mb-1">{accountDetails.accountName}</h6>
                                <p className="mb-0 text-muted">
                                    {accountDetails.accountNumber} {accountDetails.bankName}
                                </p>
                            </div>
                        ) : (
                            <p>No account details found. Please go back and select an account.</p>
                        )}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 bg-white p-2 rounded-3">
                            <label className="form-label text-muted">Amount</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="₦100.00 - ₦5,000,000.00"
                                value={amount} // Use the `amount` state
                                onChange={(e) => setAmount(e.target.value)} // Update the `amount` state
                            />
                            <div className="d-flex mt-2 gap-2">
                                {[500, 1000, 2000, 3000, 4000, 5000].map((val) => (
                                    <button
                                        type="button"
                                        key={val}
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => handleAmountClick(val)} // Set amount on click
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
                                onChange={(e) => setRemark(e.target.value)} // Update the `remark` state
                            />
                        </div>
                        <div className="w-75 mx-auto mt-5">
                            <button
                                type="submit"
                                className="btn btn-success w-100 p-2"
                                style={{ borderRadius: "20px" }}
                                disabled={isLoading} // Disable when loading
                            >

                                {isLoading ? "Confirm" : "Confirm"}

                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Pass the modal state as props to Transfermodal */}
            {showModal && <Transfermodal showModal={showModal} setShowModal={setShowModal} />}
        </div>
    );
}

export default Transferform;
