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
    const [userss, setUserss] = useState([]);
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

    const fetchUsers = async () => {
        console.log("Fetching users...");
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_URLS.getallusers);
            const data = await response.json();

            console.log("Fetched Users:", data); // Debug API response

            if (Array.isArray(data)) {
                console.log("Users found, updating state:", data);
                setUsers(data);
            } else {
                console.log("Invalid data format received.");
                setUsers([]);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setError(error.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchUsers(); // now this works as it's declared above
    }, []);






    // Debug when `users` state updates
    useEffect(() => {
        console.log("Updated Users State:", users);
    }, [users]);

    useEffect(() => {
        console.log("Loading State:", loading);
    }, [loading]);



    // useEffect(() => {
    //     console.log("Updated Users State:", users);
    // }, [users]);


    const handleShowTransactions = async (userId) => {
        setSelectedUser(userId);
        setModalLoading(true);

        try {
            const response = await axios.get(API_URLS.gettransactions(userId));
            setTransactions(response.data);
            console.log(response, "yoooooo");

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

    // const blockUser = async (userId) => {
    //     try {
    //         await axios.put(API_URLS.blockUser(userId), { blocked: true });
    //         setUsers(prevUsers =>
    //             prevUsers.map(user =>
    //                 user._id === userId ? { ...user, blocked: true } : user
    //             )
    //         );
    //     } catch (error) {
    //         console.error("Error blocking user:", error);
    //     }
    // };

    const blockUser = async (userId, username) => {
        // console.log(, "userId");

        const result = await Swal.fire({
            title: "Are you sure?",
            html: `<strong class="text-danger">${username}</strong> will be blocked and won't be able to access the platform.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, block!",
            cancelButtonText: "No, cancel"
        });


        if (result.isConfirmed) {
            try {
                await axios.put(API_URLS.blockUser(userId), { blocked: true });

                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === userId ? { ...user, blocked: true } : user
                    )
                );

                Swal.fire({
                    title: "Blocked!",
                    html: `<strong class="text-danger">${username}</strong> has been blocked.`,
                    icon: "success"
                });
            } catch (error) {
                console.error("Error blocking user:", error);
                Swal.fire("Error", "An error occurred while blocking the user.", "error");
            }
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

                console.log("Fetched Sessions:", data);  // Debugging log
                setSessions(data || []);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        fetchSessions();
    }, []);

    // console.log("Users Length:", users?.length);



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
    const handleLogoutSession = (sessionId, userObject) => {
        const actualUserId = userObject._id;
        const user = users.find((u) => u._id === actualUserId);
        const username = user ? user.username : "Unknown";

        Swal.fire({
            title: "Are you sure?",
            html: `Do you really want to log out <strong class="text-danger">${username}</strong>?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00B875",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log out",
            cancelButtonText: "No"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(API_URLS.logoutsession(sessionId), {
                        method: "DELETE",
                    });

                    if (response.ok) {
                        setSessions(prev => prev.filter(session => session._id !== sessionId));
                        Swal.fire({
                            title: "Success!",
                            html: `<strong class="text-success">${username}</strong> has been logged out successfully.`,
                            icon: "success",
                            confirmButtonColor: "#00B875",
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            html: `Failed to log out <strong class="text-danger">${username}</strong>`,
                            icon: "error",
                            confirmButtonColor: "#d33",
                        });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    Swal.fire({
                        title: "Error!",
                        html: `An error occurred while logging out <strong class="text-danger">${username}</strong>`,
                        icon: "error",
                        confirmButtonColor: "#d33",
                    });
                }
            }
        });
    };




    const [totalBalance, setTotalBalance] = useState(0);

    const fetchtotalBalance = async () => {
        try {
            const response = await axios.get(API_URLS.getTotalBalance);
            setUserss(response.data.users);
            setTotalBalance(response.data.totalBalance);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchtotalBalance();
    }, []);


    // if (Array.isArray(data)) {
    //     setUsers(data);
    // } else {
    //     setUsers([]);
    // }

    useEffect(() => {
        console.log("Users:", users);
        console.log("Sessions:", sessions);
    }, [users, sessions]);

    const userTransactions = transactions.reduce((acc, transaction) => {
        const userId = transaction.userId; // Assuming each transaction has a userId
        const username = transaction.username; // Assuming each transaction has a userId        
        if (!acc[userId]) {
            acc[userId] = { userId, totalAmount: 0 };
        }
        acc[userId].totalAmount += transaction.amount;
        return acc;
    }, {});


    // const toggleUnlimited = async (userId, status) => {
    //     try {
    //         await axios.post(API_URLS.setUnlimited, { userId, unlimited: status });
    //         alert(`User has been set to ${status ? "unlimited" : "limited"}`);
    //         fetchUsers(); // ✅ Refresh the list here
    //     } catch (err) {
    //         alert("Error updating user access");
    //     }
    // };


    // const toggleUnlimited = async (userId, isCurrentlyUnlimited) => {
    //     const newStatus = !isCurrentlyUnlimited; // ✅ Flip the value
    //     try {
    //         const response = await axios.post(API_URLS.setUnlimited, {
    //             userId,
    //             unlimited: newStatus,
    //         });

    //         console.log(`User (${userId}) access set to: ${newStatus ? "unlimited" : "limited"}`);
    //         alert(response.data.message);
    //         fetchUsers(); // Refresh the user list
    //     } catch (err) {
    //         console.error("Failed to toggle user access:", err);
    //         alert("Error updating user access");
    //     }
    // };


    // const toggleUnlimited = async (userId, isCurrentlyUnlimited) => {
    //     const newStatus = !isCurrentlyUnlimited; // ✅ flip the value
    //     console.log(`Sending newStatus: ${newStatus}`);

    //     try {
    //         const res = await axios.post(API_URLS.setUnlimited, {
    //             userId,
    //             unlimited: newStatus,
    //         });

    //         // alert(res.data.message);
    //         fetchUsers();
    //     } catch (err) {
    //         console.error(err);
    //         alert("Error updating user access");
    //     }
    // };

    // const toggleUnlimited = async (userId, isCurrentlyUnlimited) => {
    //     const newStatus = !isCurrentlyUnlimited;

    //     try {
    //         const res = await axios.post(API_URLS.setUnlimited, {
    //             userId,
    //             unlimited: newStatus,
    //         });

    //         // ✅ Only update the toggled user
    //         setUsers(prevUsers =>
    //             prevUsers.map(user =>
    //                 user._id === userId ? { ...user, isUnlimited: newStatus } : user
    //             )
    //         );
    //     } catch (err) {
    //         console.error(err);
    //         alert("Error updating user access");
    //     }
    // };

    const toggleUnlimited = async (userId, isCurrentlyUnlimited, username) => {
        const newStatus = !isCurrentlyUnlimited;

        const result = await Swal.fire({
            title: "Are you sure?",
            html: `<strong class="text-danger">${username}</strong> is about to be  <strong class="text-dark">${newStatus ? "unlimited" : "limit"}</strong>.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, ${newStatus ? "unlimited" : "limit"}!`,
            cancelButtonText: "No, cancel"
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.post(API_URLS.setUnlimited, {
                    userId,
                    unlimited: newStatus,
                });

                // ✅ Only update the toggled user locally
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === userId ? { ...user, isUnlimited: newStatus } : user
                    )
                );

                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    html: `<strong class="text-danger">${username}</strong> is now <strong> ${newStatus ? "Unlimited" : "Limited"}</strong> `,
                });

            } catch (err) {
                console.error(err);
                Swal.fire("Error", "An error occurred while updating access.", "error");
            }
        }
    };



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
                                    <th>Info</th>
                                    <th>Log-In </th>
                                    <th>Expires At</th>
                                    <th>History</th>
                                    <th>Block/Unblock</th>
                                    <th>Limit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(users) && users.length > 0 ? (
                                    users.map((user, index) => {
                                        const userSessions = (sessions || []).filter(session => session?.userId?._id === user?._id);

                                        return (
                                            <React.Fragment key={user?._id || index}>
                                                {userSessions.length > 0 ? (
                                                    userSessions.map((session, sessionIndex) => (
                                                        <tr key={session?._id || sessionIndex}>
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
                                                                <p
                                                                    style={{ cursor: "pointer" }}
                                                                    className="text-danger"
                                                                    onClick={() => handleLogoutSession(session?._id, session.userId)}
                                                                >
                                                                    Log Out
                                                                </p>
                                                            </td>
                                                            {sessionIndex === 0 && (
                                                                <>
                                                                    <td rowSpan={userSessions.length}>
                                                                        <button
                                                                            className="btn btn-primary btn-sm me-2"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#transactionModal"
                                                                            onClick={() => handleShowTransactions(user?._id)}
                                                                        >
                                                                            <i className="ri-history-line px-3"></i>
                                                                        </button>
                                                                    </td>
                                                                    <td rowSpan={userSessions.length}>
                                                                        {user?.blocked ? (
                                                                            <button className="btn btn-danger btn-sm" onClick={() => unblockUser(user?._id)}>Blocked</button>
                                                                        ) : (
                                                                            <button className="btn btn-success btn-sm" onClick={() => blockUser(user?._id, user.username)}>UnBlock</button>
                                                                        )}
                                                                    </td>
                                                                    <td rowSpan={userSessions.length}>
                                                                        <button
                                                                            className={`btn btn-sm ${user.isUnlimited ? "btn-success" : "btn-danger"}`}
                                                                            onClick={() => toggleUnlimited(user._id, user.isUnlimited, user.username)}
                                                                        >
                                                                            {user.isUnlimited ? "Unlimited" : " Limited"}
                                                                        </button>
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
                                                            <button
                                                                className="btn btn-primary btn-sm me-2"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#transactionModal"
                                                                onClick={() => handleShowTransactions(user?._id)}
                                                            >
                                                                <i className="ri-history-line px-3"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            {user?.blocked ? (
                                                                <button className="btn btn-danger btn-sm" onClick={() => unblockUser(user?._id)}>Blocked</button>
                                                            ) : (
                                                                <button className="btn btn-success btn-sm" onClick={() => blockUser(user?._id, user.username)}>UnBlock</button>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <td rowSpan={userSessions.length}>
                                                                <button
                                                                    className={`btn btn-sm ${user.isUnlimited ? "btn-success" : "btn-danger"}`}
                                                                    onClick={() => toggleUnlimited(user._id, user.isUnlimited, user.username)}
                                                                >
                                                                    {user.isUnlimited ? "Unlimited" : " Limited"}
                                                                </button>
                                                            </td>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center">No users found.</td>
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
                        <div className="modal-content border-0">
                            <div className="modal-header">
                                <h5 className="modal-title" id="transactionModalLabel">
                                    Transaction History
                                    <span className='text-danger'> {transactions.length}</span>
                                    {Object.values(userTransactions).map(user => (
                                        <p key={user.userId}>
                                            {/* User ID: {user.userId} -  */}
                                            Total ₦{Math.abs(user.totalAmount).toLocaleString()}.00
                                        </p>
                                    ))}
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
                                                    <th>S/N</th>
                                                    <th>Bank</th>
                                                    <th>Account</th>
                                                    <th>Name</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>
                                                    <th>Date</th>
                                                    <th>Action</th>

                                                </tr>
                                            </thead>
                                            <tbody >

                                                {transactions
                                                    .filter(transaction => transaction.type !== "incoming") // 👈 Filter out incoming
                                                    .map((transaction, index) => (
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
                                                                                : transaction.status === "Reversed"
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
                                                                <button className="btn btn-danger" onClick={() => handleDeleteTransaction(transaction._id)}>
                                                                    <i className="ri-close-circle-line"></i>
                                                                </button>
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