import React, { useEffect, useState } from 'react'
import Navbar from '../Navbarpage/Navbar'
import NavbarTop from '../NavbarToppage/NavbarTop'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../../../../utils/apiConfig';

const Admindb = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if admin is logged in
        const adminToken = localStorage.getItem('adminToken');
        // console.log(adminToken); // Check what is logged here

        if (!adminToken) {
            // If not logged in, redirect to login page
            navigate('/admin');
        }
    }, [navigate]);


    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(API_URLS.getallusers);

                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const handleShowTransactions = async (userId) => {
        setSelectedUser(userId);
        setModalLoading(true);

        try {
            const response = await axios.get(API_URLS.gettransactions(userId));
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setModalLoading(false);
        }
    };

    const [userCount, setUserCount] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await axios.get(API_URLS.getCounts);
                setUserCount(response.data.userCount);
                setTransactionCount(response.data.transactionCount);
                setTotalCount(response.data.totalCount);
            } catch (error) {
                console.error("Error fetching counts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);


    const handleDeleteTransaction = async (transactionId) => {
        try {
            // Confirm deletion with the user before proceeding
            const confirmDelete = window.confirm('Are you sure you want to delete this transaction?');
            if (!confirmDelete) return; // Abort if user cancels
    
            // Call the delete API endpoint
            const response = await axios.delete(API_URLS.deleteuserTransaction(transactionId));
            alert(response.data.message); // Show success message
    
            // After successful deletion, filter out the deleted transaction from the state
            setTransactions(transactions.filter(transaction => transaction._id !== transactionId));
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Error deleting the transaction. Please try again later.');
        }
    };
    


    return (
        <div>
            <Navbar />
            <NavbarTop />
            <div>
                <div class="container text-center">
                    <div class="row gap-2">
                        <div class="col-12 col-md bg-white">
                            <div>
                                <h4>Users</h4>
                            </div>
                            <div>
                                <h1>{userCount}</h1>
                            </div>
                        </div>
                        <div class="col-12 col-md bg-white">
                            <div>
                                <h4>Transactions</h4>
                            </div>
                            <div>
                                <h1>{transactionCount}</h1>
                            </div>
                        </div>
                        <div class="col-12 col-md bg-white">
                            <div>
                                <h4>All</h4>
                            </div>
                            <div>
                                <h1>{totalCount}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3 mt-sm-4 col-md-11 mx-auto col-sm-12">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="table-responsive"> {/* Make the table scrollable */}
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Fullname</th>
                                    <th scope="col">Phone No</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user._id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{user.username || "N/A"}</td>
                                            <td>{user.fullname || "N/A"}</td>
                                            <td>{user.phoneNumber || "N/A"}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm me-2"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#transactionModal"
                                                    onClick={() => handleShowTransactions(user._id)}
                                                >
                                                    Show
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}


                <div
                    className="modal fade"
                    id="transactionModal"
                    tabIndex="-1"
                    aria-labelledby="transactionModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="transactionModalLabel">
                                    Transaction History
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                {modalLoading ? (
                                    <div
                                        className="d-flex justify-content-center align-items-center"
                                        style={{ height: "200px" }}
                                    >
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : transactions.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Bank Name</th>
                                                    <th>Account Number</th>
                                                    <th>Account Name</th>
                                                    <th>Amount</th>
                                                    {/* <th>Status</th> */}
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((transaction, index) => (
                                                    <tr key={transaction._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{transaction.bankName}</td>
                                                        <td>{transaction.accountNumber}</td>
                                                        <td>{transaction.accountName}</td>
                                                        <td>N{transaction.amount.toFixed(2)}</td>
                                                        {/* <td>
                                                            <span
                                                                className={`badge bg-${transaction.status === "success"
                                                                        ? "success"
                                                                        : transaction.status === "pending"
                                                                            ? "warning"
                                                                            : "danger"
                                                                    }`}
                                                            >
                                                                {transaction.status}
                                                            </span>
                                                        </td> */}
                                                        <td>
                                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                           <button className='btn btn-danger' onClick={() => handleDeleteTransaction(transaction._id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center">No transactions found for this user.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admindb