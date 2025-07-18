import React, { useEffect, useState } from "react";
import Transfermodal from "../Transfermodalpage/Transfarmodal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getBankLogoByName } from '../BankUtils'
import axios from "axios";
import { API_URLS } from "../../../../utils/apiConfig";

function Transferform() {
    const [amount, setAmount] = useState(""); // Changed `amountenter` to `amount`
    const [remark, setRemark] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [accountDetails, setAccountDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Track loading state


    // const handleAmountClick = (value) => {
    //     setAmount(value);
    // };

    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digits
        if (!rawValue) {
            setAmount('');
            return;
        }
        const numericValue = parseInt(rawValue, 10);
        setAmount(numericValue.toLocaleString());
    };

    const handleAmountClick = (value) => {
        setAmount(value.toLocaleString());
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Remove ₦ and commas
        const rawAmount = amount.replace(/[₦,]/g, '');

        if (!rawAmount || isNaN(rawAmount) || rawAmount < 100 || rawAmount > 5000000) {
            alert("Please enter a valid amount between ₦100.00 and ₦5,000,000.00");
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not logged in. Please log in again.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post(API_URLS.checkTransactionLimit, { token });

            if (res.data.status) {
                localStorage.setItem("transferAmount", rawAmount); // Save as plain number
                setShowModal(true);
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            if (err.response?.status === 403) {
                Swal.fire({
                    text: "You have reached your daily transaction limit (1 per day).",
                    showClass: {
                        popup: `animate__animated animate__fadeInUp animate__faster`,
                    },
                    hideClass: {
                        popup: `animate__animated animate__fadeOutDown animate__faster`,
                    },
                });
                navigate("/makepayment");
            } else {
                alert("Could not check transaction limit. Try again.");
            }
        } finally {
            setIsLoading(false);
        }
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
                    <div className="align-items-center d-flex">
                        <div>
                            <img
                                src={accountDetails ? getBankLogoByName(accountDetails.bankName) : ""}
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop in case fallback also fails
                                    e.target.src = "";        // Optional: Clear the src so no broken icon shows
                                    e.target.style.backgroundColor = "#f8f9fa"; // Bootstrap's `bg-light` color
                                    e.target.style.objectFit = "cover";
                                    e.target.alt = "Bank logo not available";
                                }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    objectFit: "contain",
                                    borderRadius: "50%",
                                    backgroundColor: "#f0f0f0", // Initial color before failure
                                    padding: 1
                                }}
                                className="me-2"
                            />

                        </div>
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


                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 bg-white p-2 rounded-3">
                            <label className="form-label mx-2">Amount</label>
                            <input
                                type="text"
                                className="form-control border-0 border-bottom rounded-0 shadow-none border-success"
                                placeholder="₦100.00 - ₦5,000,000.00"
                                value={amount ? `₦${amount}` : ''}
                                onChange={handleAmountChange}
                                style={{
                                    borderColor: "#ccc",
                                    backgroundColor: "transparent",
                                }}
                            />


                            <div className="row row-cols-3 g-2 mt-2 mx-3">
                                {[500, 1000, 2000, 5000, 10000, 20000].map((val) => (
                                    <div className="col" key={val}>
                                        <button
                                            type="button"
                                            className="btn btn-sm w-100 py-2"
                                            onClick={() => handleAmountClick(val)}
                                            style={{
                                                backgroundColor: "#F8F8FA",
                                                border: "none",
                                                boxShadow: "none"
                                            }}
                                        >
                                            ₦{val.toLocaleString()}
                                        </button>

                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className="mb-4 bg-white p-2 rounded-3 py-3">
                            <label className="form-label text-muted">Remark</label>
                            <input
                                type="text"
                                className="form-control border-0 border-bottom rounded-0 shadow-none"
                                placeholder="What's this for? (Optional)"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            />
                        </div>
                        <div className="w-75 mx-auto mt-5">
                            <button
                                type="submit"

                                style={{ backgroundColor: "#01B575", borderRadius: "20px" }} className="w-100 btn text-white py-2 flex-grow-1 rounded-pill"
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
