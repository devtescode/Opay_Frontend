import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "react-bootstrap-icons";
import { API_URLS } from "../../../../utils/apiConfig";
import { useNavigate } from "react-router-dom";

export default function TransactionDetailsBanks({onTransactionSelect}) {
    const [transactions, setTransactions] = useState([]);  // Initializing as an empty array
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user')); // Parse user data from localStorage
                if (!userData || !userData.userId) {
                    console.error("User ID not found in localStorage.");
                    return; // Exit if there's no user data or userId
                }

                const userId = userData.userId; // Access the userId
                const response = await axios.get(API_URLS.getrecentransaction(userId, showAll));

                // Ensure the response data is an array
                if (Array.isArray(response.data)) {
                    setTransactions(response.data); // Set the response data to the state
                } else {
                    console.error("Response data is not an array", response.data);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, [showAll]); // Refetch transactions whenever `showAll` changes

    const handleDeleteTransaction = async (transactionId) => {
        try {
            // Send the DELETE request to the backend to delete the transaction
            //   const response = await axios.delete();
            const response = await axios.delete(API_URLS.deleterecenttransaction(transactionId));

            if (response.status === 200) {
                console.log('Transaction deleted successfully');

                // Update the state to remove the deleted transaction
                setTransactions(prevTransactions =>
                    prevTransactions.filter(transaction => transaction._id !== transactionId)
                );
            } else {
                console.log('Error: Could not delete transaction');
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    // const handleTransactionClick = (transaction) => {
    //     console.log("Clicked transaction:", transaction); 
    //     console.log("Transaction ID:", transaction?._id); 
    //     if (onTransactionSelect) {
    //         // Pass the bank name and account number to the parent
    //         onTransactionSelect(transaction);
    //     }
    // };
    const navigate = useNavigate();
    const handleTransactionClick = (transaction) => {
        console.log("Clicked transaction:", transaction); 
        console.log("Transaction ID:", transaction?._id); 
    
        if (onTransactionSelect) {
            // Pass the bank name and account number to the parent
            onTransactionSelect(transaction);
        }
    
        // Navigate to the transfer page with transaction details
        navigate("/transfer", { state: { transaction } });
    };

    return (
        <div className="bg-light">
            <div className="p-3">
                {/* <div className="position-relative">
                    <input
                        type="text"
                        className="form-control bg-white rounded-3 ps-5"
                        placeholder="Account number or name"
                        style={{ height: "30px",  }}
                    />
                    <Search
                        className="position-absolute text-muted"
                        style={{ left: "15px", top: "50%", transform: "translateY(-50%)" }}
                    />
                </div> */}
            </div>

            <div className="px-3 border-bottom">
                <div className="d-flex">
                    <div className="pb-2 px-3 border-bottom border-success border-3" style={{ marginBottom: "-1px" }}>
                        <h6 className="mb-0 fw-bold text-success">Recents</h6>
                    </div>
                    <div className="pb-2 px-3">
                        <h6 className="mb-0 text-muted">Favourites</h6>
                    </div>
                </div>
            </div>

            <div className="p-3">
                {transactions && transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                        <BeneficiaryItem
                            key={index}
                            icon={transaction.accountName ? transaction.accountName[0] : "?"} // Extract first letter of accountName
                            iconBg="primary" // Example, you can dynamically change this based on the bank
                            name={transaction.accountName}
                            account={transaction.accountNumber}
                            bank={transaction.bankName}
                            transactionId={transaction._id}  // Passing transactionId as a prop
                            handleDeleteTransaction={handleDeleteTransaction}  // Passing the delete function as a prop
                            onClick={() => handleTransactionClick(transaction)} // Pass the transaction to the parent
                        />
                    ))
                ) : (
                    <div>No transactions available.</div>
                )}

                <div className="text-center mt-4">
                    <button
                        className="btn btn-light rounded-pill px-4 py-2"
                        onClick={() => setShowAll(!showAll)}
                        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                    >
                        {showAll ? "View Less" : "View All"}
                    </button>
                </div>
            </div>
        </div>
    );
}


function BeneficiaryItem({ icon, iconBg, name, account, bank, transactionId, handleDeleteTransaction, onClick }) {
    const [showDelete, setShowDelete] = useState(false);  // State to toggle the delete option

    const handleDeleteClick = () => {
        setShowDelete(!showDelete);  // Toggle the delete option visibility
    };

    return (
        <div className="d-flex align-items-center bg-white rounded-3 p-3 mb-2" onClick={onClick}>  {/* Added onClick here to trigger the parent transaction select */}
            <div
                className={`rounded-circle bg-${iconBg} text-white d-flex align-items-center justify-content-center`}
                style={{ width: 40, height: 40, minWidth: 40 }}
            >
                {icon} {/* Display first letter of accountName */}
            </div>
            <div className="ms-3 flex-grow-1">
                <div className="fw-bold">{name}</div>
                <div className="text-muted small">
                    {account} {bank}
                </div>
            </div>
            <div className="position-relative">
                <button
                    className="btn btn-link text-muted p-0"
                    onClick={handleDeleteClick}
                >
                    ⋮
                </button>
                {/* Conditionally render the "Delete" text directly below the ⋮ icon */}
                {showDelete && (
                    <div
                        className="position-absolute bg-white p-1"
                        style={{ top: '20px', left: '-10px', borderRadius: '5px', fontSize: '12px' }}
                        onClick={() => handleDeleteTransaction(transactionId)}  // Call the delete function when clicked
                    >
                        Delete
                    </div>
                )}
            </div>
        </div>
    );
}

