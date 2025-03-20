import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, Search as SearchIcon } from 'lucide-react';
import { API_URLS } from '../../../../utils/apiConfig';

const Search = () => {
    const [transactions, setTransactions] = useState([]); // Store all transactions
    const [searchQuery, setSearchQuery] = useState('');   // Store user input for search
    const [filteredTransactions, setFilteredTransactions] = useState([]); // Filtered transactions

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user'));
                if (!userData || !userData.userId) {
                    console.error("User ID not found in localStorage.");
                    return;
                }
    
                const userId = userData.userId; // Get userId
                const response = await axios.get(API_URLS.getrecentransactionsearch(userId)); // Ensure correct endpoint
                
                if (Array.isArray(response.data)) {
                    setTransactions(response.data); // Store transactions
                } else {
                    console.error("Response data is not an array", response.data);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    // Update filtered transactions only when search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredTransactions([]); // Clear results if input is empty
        } else {
            setFilteredTransactions(
                transactions.filter(transaction =>
                    transaction.accountNumber.includes(searchQuery) ||
                    transaction.accountName.toLowerCase().includes(searchQuery.toLowerCase()) 
                )
            );
        }
    }, [searchQuery, transactions]);

    return (
        <div className="container-sm bg-white min-vh-100 p-3" style={{ maxWidth: '500px' }}>
            {/* Header Section */}
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-link p-0 me-2 text-dark border-0">
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
                            <div key={transaction._id} className="p-2 border-bottom">
                                <p className="mb-1"><strong>Account Name:</strong> {transaction.accountName}</p>
                                <p className="mb-1"><strong>Account Owner:</strong> {transaction.bankName}</p>
                                <p className="mb-1"><strong>Account Number:</strong> {transaction.accountNumber}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
