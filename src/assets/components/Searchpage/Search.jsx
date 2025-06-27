import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, Search as SearchIcon } from 'lucide-react';
import { API_URLS } from '../../../../utils/apiConfig';
import { useNavigate } from 'react-router-dom';
import { getBankLogoByName } from '../BankUtils';

const Search = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData || !userData.userId) {
                    console.error("User ID not found in localStorage.");
                    return;
                }

                const userId = userData.userId;
                const response = await axios.get(API_URLS.getrecentransactionsearch(userId));

                if (Array.isArray(response.data)) {
                    setTransactions(response.data);
                } else {
                    console.error("Response data is not an array", response.data);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredTransactions([]);
        } else {
            setFilteredTransactions(
                transactions.filter(transaction =>
                    transaction.accountNumber.includes(searchQuery) ||
                    transaction.accountName.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, transactions]);

    const handleTransactionClick = (transaction) => {
        localStorage.setItem("selectedAccount", JSON.stringify(transaction)); // Save for backup
        navigate('/transfer', { state: { transaction } });
    };


    return (
        <div className="container-sm bg-white min-vh-100 p-3" style={{ maxWidth: '500px' }}>
            {/* Header Section */}
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-link p-0 me-2 text-dark border-0" onClick={() => navigate("/bank")}>
                    <ChevronLeft size={24} />
                </button>
                <h1 className="fs-3 fw-medium text-dark mb-0">Search Beneficiaries</h1>
            </div>

            {/* Search Input */}
            <div className="position-relative">
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                    <SearchIcon size={20} className="text-secondary" />
                </div>
                <input
                    type="text"
                    placeholder="Account number or name"
                    className="form-control ps-5 py-2 border-1 rounded-3"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderColor: '#e2e8f0' }}
                />
            </div>

            {/* Display Transactions Only When Searching */}
            {searchQuery.trim() !== '' && (
                <div className="mt-3">
                    {filteredTransactions.length === 0 ? (
                        <p className="text-center p-3">No transactions found</p>
                    ) : (
                        filteredTransactions.map((transaction) => (
                            <div
                                key={transaction._id}
                                className="p-2 border-bottom d-flex align-items-center"
                                onClick={() => handleTransactionClick(transaction)}
                                style={{ cursor: 'pointer' }}
                            >                               
                                <img
                                    src={transaction ? getBankLogoByName(transaction.bankName) : ""}
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
                                        // padding: 1
                                    }}
                                    className="me-1 mb-1"
                                />

                                <div className="ms-2 flex-grow-1">
                                    <div className="fw-bold">{transaction.accountName}</div>
                                    <div className="text-muted small">
                                        {transaction.accountNumber} {transaction.bankName}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
