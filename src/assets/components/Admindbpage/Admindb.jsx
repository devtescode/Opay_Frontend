import { Fragment, useState } from 'react';
import Navbar from '../Navbarpage/Navbar';
import NavbarTop from '../NavbarToppage/NavbarTop';
import { format } from 'date-fns';
import {
  useAdminCounts,
  useAdminSessions,
  useAdminTotalBalance,
  useAdminUserTransactions,
  useAdminUsers,
} from '../../../hooks/useQueries';
import {
  useBlockUser,
  useDeleteUserTransaction,
  useLogoutSession,
  useSetUnlimited,
  useUnblockUser,
} from '../../../hooks/useMutations';
import { alert } from '../../../lib/alert';

const PAGE_SIZE = 25;

const Admindb = () => {
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);

    const { data: usersData, isPending: usersLoading, isError: usersError, refetch: refetchUsers } = useAdminUsers({ page, limit: PAGE_SIZE });
    const { data: counts } = useAdminCounts();
    const { data: totalBalance = 0 } = useAdminTotalBalance();
    const { data: sessions = [] } = useAdminSessions();
    const { data: transactionsData, isPending: modalLoading } = useAdminUserTransactions(selectedUser);

    const { mutate: deleteTransaction } = useDeleteUserTransaction();
    const { mutate: blockUser } = useBlockUser();
    const { mutate: unblockUser } = useUnblockUser();
    const { mutate: setUnlimited } = useSetUnlimited();
    const { mutate: logoutSession } = useLogoutSession();

    const users = usersData?.items ?? [];
    const totalUsers = usersData?.total ?? 0;
    const transactions = transactionsData?.items ?? [];
    const userCount = counts?.userCount ?? 0;
    const transactionCount = counts?.transactionCount ?? 0;
    const totalCount = counts?.totalCount ?? 0;

    const totalPages = Math.max(Math.ceil(totalUsers / PAGE_SIZE), 1);

    const handleShowTransactions = (userId) => {
        setSelectedUser(userId);
    };

    const handleDeleteTransaction = (transactionId) => {
        alert.confirm({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (!result?.isConfirmed) return;

            deleteTransaction(
                { transactionId, userId: selectedUser },
                {
                    onSuccess: (data) => {
                        alert.success('Deleted!', data?.message);
                    },
                    onError: () => {
                        alert.error('Error!', 'There was an issue deleting the transaction. Please try again later.');
                    },
                },
            );
        });
    };

    const handleBlockUser = (userId, username) => {
        alert.confirm({
            title: 'Are you sure?',
            html: `<strong class="text-danger">${username}</strong> will be blocked and won't be able to access the platform.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, block!',
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (!result?.isConfirmed) return;

            blockUser(userId, {
                onSuccess: () => {
                    alert.success('Blocked!', `<strong class="text-danger">${username}</strong> has been blocked.`);
                },
                onError: () => {
                    alert.error('Error', 'An error occurred while blocking the user.');
                },
            });
        });
    };

    const handleUnblockUser = (userId) => {
        unblockUser(userId, {
            onSuccess: () => {
                alert.success('Unblocked!', 'The user can access the platform again.');
            },
            onError: () => {
                alert.error('Error', 'An error occurred while unblocking the user.');
            },
        });
    };

    const shortenDeviceInfo = (deviceInfo) => {
        if (!deviceInfo) return 'Unknown Device';

        const match = deviceInfo.match(/\((.*?)\)/);
        const details = match ? match[1].split(';')[0] : deviceInfo.split(' ')[0];

        let browser = 'Unknown Browser';
        if (deviceInfo.includes('Chrome')) browser = 'Chrome';
        else if (deviceInfo.includes('Safari') && !deviceInfo.includes('Chrome')) browser = 'Safari';
        else if (deviceInfo.includes('Firefox')) browser = 'Firefox';
        else if (deviceInfo.includes('Edge')) browser = 'Edge';

        return `${details} - ${browser}`;
    };

    const handleLogoutSession = (sessionId, userObject) => {
        const actualUserId = userObject._id;
        const user = users.find((u) => u._id === actualUserId);
        const username = user ? user.username : 'Unknown';

        alert.confirm({
            title: 'Are you sure?',
            html: `Do you really want to log out <strong class="text-danger">${username}</strong>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00B875',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, log out',
            cancelButtonText: 'No',
        }).then((result) => {
            if (!result?.isConfirmed) return;

            logoutSession(sessionId, {
                onSuccess: () => {
                    alert.success('Success!', `<strong class="text-success">${username}</strong> has been logged out successfully.`);
                },
                onError: () => {
                    alert.error('Error!', `Failed to log out <strong class="text-danger">${username}</strong>`);
                },
            });
        });
    };

    const handleToggleUnlimited = (userId, isCurrentlyUnlimited, username) => {
        const newStatus = !isCurrentlyUnlimited;

        alert.confirm({
            title: 'Are you sure?',
            html: `<strong class="text-danger">${username}</strong> is about to be  <strong class="text-dark">${newStatus ? 'unlimited' : 'limit'}</strong>.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${newStatus ? 'unlimited' : 'limit'}!`,
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (!result?.isConfirmed) return;

            setUnlimited(
                { userId, unlimited: newStatus },
                {
                    onSuccess: () => {
                        alert.success('Updated!', `<strong class="text-danger">${username}</strong> is now <strong> ${newStatus ? 'Unlimited' : 'Limited'}</strong> `);
                    },
                    onError: () => {
                        alert.error('Error', 'An error occurred while updating access.');
                    },
                },
            );
        });
    };

    const outgoingTransactions = transactions.filter((txn) => txn.type !== 'incoming');
    const totalOutgoing = outgoingTransactions.reduce((sum, txn) => sum + Math.abs(txn.amount || 0), 0);

    return (
        <div>
            <Navbar />
            <NavbarTop />

            <div style={{ marginTop: '60px' }}>
                <div className="container text-center">
                    <div className="row gap-2">
                        <div className="col-12 col-md bg-white">
                            <div><h4>Amount</h4></div>
                            <div><h1>{Number(totalBalance).toLocaleString()}</h1></div>
                        </div>
                        <div className="col-12 col-md bg-white">
                            <div><h4>Users</h4></div>
                            <div><h1>{userCount}</h1></div>
                        </div>
                        <div className="col-12 col-md bg-white">
                            <div><h4>Transactions</h4></div>
                            <div><h1>{transactionCount}</h1></div>
                        </div>
                        <div className="col-12 col-md bg-white">
                            <div><h4>All</h4></div>
                            <div><h1>{totalCount}</h1></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3 mt-sm-4 col-md-11 mx-auto col-sm-12">
                {usersLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : usersError ? (
                    <div className="text-center p-4">
                        <p className="text-danger">Could not load users.</p>
                        <button className="btn btn-primary btn-sm" onClick={() => refetchUsers()}>
                            Try again
                        </button>
                    </div>
                ) : (
                    <>
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
                                        <th>Log-In</th>
                                        <th>Expires At</th>
                                        <th>History</th>
                                        <th>Block/Unblock</th>
                                        <th>Limit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user, index) => {
                                            const userSessions = (sessions || []).filter((session) => session?.userId?._id === user?._id);

                                            return (
                                                <Fragment key={user?._id || index}>
                                                    {userSessions.length > 0 ? (
                                                        userSessions.map((session, sessionIndex) => (
                                                            <tr key={session?._id || sessionIndex}>
                                                                {sessionIndex === 0 && (
                                                                    <>
                                                                        <th scope="row" rowSpan={userSessions.length}>{index + 1}</th>
                                                                        <td rowSpan={userSessions.length}>
                                                                            {user?.walletBalance ? `₦${Number(user?.walletBalance).toLocaleString()}` : 'N/A'}
                                                                        </td>
                                                                        <td rowSpan={userSessions.length}>{user?.username || 'N/A'}</td>
                                                                        <td rowSpan={userSessions.length}>{user?.fullname || 'N/A'}</td>
                                                                        <td rowSpan={userSessions.length}>{user?.phoneNumber || 'N/A'}</td>
                                                                    </>
                                                                )}
                                                                <td>{shortenDeviceInfo(session?.deviceInfo)}</td>
                                                                <td>{session?.loggedInAt ? new Date(session.loggedInAt).toLocaleString() : 'N/A'}</td>
                                                                <td>
                                                                    {session?.expiresAt ? new Date(session.expiresAt).toLocaleString() : 'N/A'}
                                                                    <p
                                                                        style={{ cursor: 'pointer' }}
                                                                        className="text-danger mb-0"
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
                                                                                <button className="btn btn-danger btn-sm" onClick={() => handleUnblockUser(user?._id)}>Blocked</button>
                                                                            ) : (
                                                                                <button className="btn btn-success btn-sm" onClick={() => handleBlockUser(user?._id, user.username)}>UnBlock</button>
                                                                            )}
                                                                        </td>
                                                                        <td rowSpan={userSessions.length}>
                                                                            <button
                                                                                className={`btn btn-sm ${user.isUnlimited ? 'btn-success' : 'btn-danger'}`}
                                                                                onClick={() => handleToggleUnlimited(user._id, user.isUnlimited, user.username)}
                                                                            >
                                                                                {user.isUnlimited ? 'Unlimited' : ' Limited'}
                                                                            </button>
                                                                        </td>
                                                                    </>
                                                                )}
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{user?.walletBalance ? `₦${Number(user?.walletBalance).toLocaleString()}` : 'N/A'}</td>
                                                            <td>{user?.username || 'N/A'}</td>
                                                            <td>{user?.fullname || 'N/A'}</td>
                                                            <td>{user?.phoneNumber || 'N/A'}</td>
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
                                                                    <button className="btn btn-danger btn-sm" onClick={() => handleUnblockUser(user?._id)}>Blocked</button>
                                                                ) : (
                                                                    <button className="btn btn-success btn-sm" onClick={() => handleBlockUser(user?._id, user.username)}>UnBlock</button>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className={`btn btn-sm ${user.isUnlimited ? 'btn-success' : 'btn-danger'}`}
                                                                    onClick={() => handleToggleUnlimited(user._id, user.isUnlimited, user.username)}
                                                                >
                                                                    {user.isUnlimited ? 'Unlimited' : ' Limited'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Fragment>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="text-center">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                disabled={page <= 1}
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </button>
                            <span className="small text-muted">
                                Page {page} of {totalPages} • {totalUsers} users
                            </span>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                disabled={page >= totalPages}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </>
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
                                    <span className="text-danger ms-2">{outgoingTransactions.length}</span>
                                    <p className="mb-0 small">
                                        Total Outgoing: ₦{totalOutgoing.toLocaleString()}.00
                                    </p>
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
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : outgoingTransactions.length > 0 ? (
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
                                            <tbody>
                                                {outgoingTransactions.map((transaction, index) => (
                                                    <tr key={transaction._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{transaction.bankName}</td>
                                                        <td>{transaction.accountNumber}</td>
                                                        <td>{transaction.accountName}</td>
                                                        <td>₦{Math.abs(transaction.amount).toLocaleString()}.00</td>
                                                        <td>
                                                            <span
                                                                className={`badge bg-${transaction.status === 'successful'
                                                                    ? 'success'
                                                                    : transaction.status === 'pending'
                                                                        ? 'warning'
                                                                        : transaction.status === 'Reversed'
                                                                            ? 'warning'
                                                                            : 'danger'
                                                                    }`}
                                                            >
                                                                {transaction.status}
                                                            </span>
                                                        </td>
                                                        <td>{format(new Date(transaction.createdAt), 'MMM do, yyyy hh:mm:ss a')}</td>
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
        </div>
    );
};

export default Admindb;
