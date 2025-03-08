import React, { useEffect, useState } from 'react'
import Navbar from '../Navbarpage/Navbar'
import NavbarTop from '../NavbarToppage/NavbarTop'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../../../../utils/apiConfig';
// import Swal from 'sweetalert2';
import { format } from "date-fns";

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
    const [sessions, setSessions] = useState([]);
    // Fetch users from the backend
    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             const response = await axios.get(API_URLS.getallusers);

    //             setUsers(response.data);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching users:", error);
    //             setLoading(false);
    //         }
    //     };

    //     fetchUsers();
    // }, []);

    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URLS.getallusers);  // Replace with your actual API call
                const data = await response.json();
                setUsers(data);
                // console.log(response);

            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);  // Set loading to false after fetch completes
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
            // Confirm deletion with SweetAlert
            const { isConfirmed } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
            });

            // Proceed if user confirms, otherwise exit
            if (!isConfirmed) return;

            // Call the delete API endpoint
            const response = await axios.delete(API_URLS.deleteuserTransaction(transactionId));

            // Show success message with SweetAlert
            await Swal.fire({
                title: 'Deleted!',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'Okay',
            });

            // After successful deletion, filter out the deleted transaction from the state
            setTransactions(transactions.filter(transaction => transaction._id !== transactionId));

        } catch (error) {
            console.error('Error deleting transaction:', error);

            // Show error message with SweetAlert
            await Swal.fire({
                title: 'Error!',
                text: 'There was an issue deleting the transaction. Please try again later.',
                icon: 'error',
                confirmButtonText: 'Okay',
            });
        }
    };

    const blockUser = async (userId) => {
        try {
            await axios.put(API_URLS.blockUser(userId), { blocked: true });
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? { ...user, blocked: true } : user
                )
            );
        } catch (error) {
            console.error("Error blocking user:", error);
        }
    };

    const unblockUser = async (userId) => {
        try {
            await axios.put(API_URLS.unblockUser(userId), { blocked: false });
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? { ...user, blocked: false } : user
                )
            );
        } catch (error) {
            console.error("Error unblocking user:", error);
        }
    };

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch(API_URLS.activesessions);
                const data = await response.json();
                // console.log("Fetched sessions:", data); // Log the fetched data
                // setSessions(data.sessions);
                setSessions(data || []); // Handle case where data is empty

            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        fetchSessions();
    }, []);


    const shortenDeviceInfo = (deviceInfo) => {
        if (!deviceInfo) return "Unknown Device";

        // Extract key details
        const match = deviceInfo.match(/\((.*?)\)/); // Extract content inside parentheses
        const details = match ? match[1].split(";")[0] : deviceInfo.split(" ")[0]; // Get first part

        // Detect browser
        let browser = "Unknown Browser";
        if (deviceInfo.includes("Chrome")) browser = "Chrome";
        else if (deviceInfo.includes("Safari") && !deviceInfo.includes("Chrome")) browser = "Safari";
        else if (deviceInfo.includes("Firefox")) browser = "Firefox";
        else if (deviceInfo.includes("Edge")) browser = "Edge";

        return `${details} - ${browser}`;
    };


    // const [sessions, setSessions] = useState([]);
    const handleLogoutSession = async (sessionId) => {
        try {
            const response = await fetch(API_URLS.logoutsession(sessionId), {
                method: "DELETE",
            });

            if (response.ok) {
                setSessions(sessions.filter(session => session._id !== sessionId));
                alert("Session logged out successfully!");
            } else {
                alert("Failed to log out session");
            }
        } catch (error) {
            console.error("Error logging out session:", error);
        }
    };



    const [totalBalance, setTotalBalance] = useState(0);

    const fetchtotalBalance = async () => {
        try {
            const response = await axios.get(API_URLS.getTotalBalance);
            setUsers(response.data.users);
            setTotalBalance(response.data.totalBalance);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchtotalBalance();
    }, []);




    return (
        <div>
            <Navbar />
            <NavbarTop />
            <div style={{ marginTop: "60px" }}>
                <div class="container text-center">
                    <div class="row gap-2">
                        <div class="col-12 col-md bg-white">
                            <div>
                                <h4>Amount</h4>
                            </div>
                            <div>
                                <h1>{Number(totalBalance).toLocaleString()}
                                </h1>
                            </div>
                        </div>
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
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Balance</th>
                                    <th>Username</th>
                                    <th>Fullname</th>
                                    <th>Phone No</th>
                                    <th>Device Info</th>
                                    <th>Logged In At</th>
                                    <th>Expires At</th>
                                    <th>History</th>
                                    <th>Block/Unblock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(!users || users?.length === 0) ? (
                                    <tr>
                                        <td colSpan="10" className="text-center">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => {
                                        const userSessions = (sessions || []).filter(session => session?.userId?._id === user._id);

                                        return (
                                            <React.Fragment key={user._id}>
                                                {userSessions?.length > 0 ? (
                                                    userSessions.map((session, sessionIndex) => (
                                                        <tr key={session?._id}>
                                                            {sessionIndex === 0 && (
                                                                <>
                                                                    <th scope="row" rowSpan={userSessions.length}>{index + 1}</th>
                                                                    <td rowSpan={userSessions.length}>
                                                                        {user?.walletBalance ? `₦${Number(user?.walletBalance).toLocaleString()}` : "N/A"}
                                                                    </td>
                                                                    <td rowSpan={userSessions.length}>{user?.username || "N/A"}</td>
                                                                    <td rowSpan={userSessions.length}>{user?.fullname || "N/A"}</td>
                                                                    <td rowSpan={userSessions.length}>{user?.phoneNumber || "N/A"}</td>
                                                                </>
                                                            )}
                                                            <td>{shortenDeviceInfo(session?.deviceInfo)}</td>
                                                            <td>{session?.loggedInAt ? new Date(session.loggedInAt).toLocaleString() : "N/A"}</td>
                                                            <td>
                                                                {session?.expiresAt ? new Date(session.expiresAt).toLocaleString() : "N/A"}
                                                                <p style={{ cursor: "pointer" }} className="text-danger" onClick={() => handleLogoutSession(session?._id)}>Log Out</p>
                                                            </td>
                                                            {sessionIndex === 0 && (
                                                                <>
                                                                    <td rowSpan={userSessions.length}>
                                                                        <button className="btn btn-primary btn-sm me-2"
                                                                            data-bs-toggle="modal" data-bs-target="#transactionModal"
                                                                            onClick={() => handleShowTransactions(user?._id)}>
                                                                            <i className="ri-history-line px-3"></i>
                                                                        </button>
                                                                    </td>
                                                                    <td rowSpan={userSessions.length}>
                                                                        {user?.blocked ? (
                                                                            <button className="btn btn-danger btn-sm" onClick={() => unblockUser(user?._id)}>Unblock</button>
                                                                        ) : (
                                                                            <button className="btn btn-warning btn-sm" onClick={() => blockUser(user?._id)}>Block</button>
                                                                        )}
                                                                    </td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{user?.walletBalance ? `₦${Number(user?.walletBalance).toLocaleString()}` : "N/A"}</td>
                                                        <td>{user?.username || "N/A"}</td>
                                                        <td>{user?.fullname || "N/A"}</td>
                                                        <td>{user?.phoneNumber || "N/A"}</td>
                                                        <td colSpan="3" className="text-center">No Active Sessions</td>
                                                        <td>
                                                            <button className="btn btn-primary btn-sm me-2"
                                                                data-bs-toggle="modal" data-bs-target="#transactionModal"
                                                                onClick={() => handleShowTransactions(user?._id)}>
                                                                <i className="ri-history-line px-3"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            {user?.blocked ? (
                                                                <button className="btn btn-danger btn-sm" onClick={() => unblockUser(user?._id)}>Unblock</button>
                                                            ) : (
                                                                <button className="btn btn-warning btn-sm" onClick={() => blockUser(user?._id)}>Block</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
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
                                    <span className='text-danger'> {transactions.length}</span>
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
                                                    <th>Status</th>
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
                                                        <td>₦{Math.abs(transaction.amount).toLocaleString()}.00</td>
                                                        <td>
                                                            <span
                                                                className={`badge bg-${transaction.status === "successful"
                                                                    ? "success"
                                                                    : transaction.status === "pending"
                                                                        ? "warning"
                                                                        : "danger"
                                                                    }`}
                                                            >
                                                                {transaction.status}
                                                            </span>
                                                        </td>
                                                        <td>

                                                            {format(new Date(transaction.createdAt), "MMM do, yyyy hh:mm:ss a")}
                                                        </td>
                                                        <td>
                                                            <button className='btn btn-danger' onClick={() => handleDeleteTransaction(transaction._id)}><i class="ri-close-circle-line"></i></button>
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
        </div >
    )
}

export default Admindb