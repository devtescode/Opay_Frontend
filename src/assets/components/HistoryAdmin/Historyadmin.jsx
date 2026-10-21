import { useState } from 'react';
import Navbar from '../Navbarpage/Navbar';
import NavbarTop from '../NavbarToppage/NavbarTop';
import { Modal, Button } from 'react-bootstrap';
import { useAdminPayments } from '../../../hooks/useQueries';

const Historyadmin = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const todayDate = new Date().toISOString().slice(0, 10);
    const { data: paymentsData, isPending, isError, refetch } = useAdminPayments({ limit: 200 });

    const payments = paymentsData?.items ?? [];

    // Group payments by customer email
    const groupedPayments = payments.reduce((acc, payment) => {
        const email = payment.customerEmail;
        if (!acc[email]) acc[email] = [];
        acc[email].push(payment);
        return acc;
    }, {});

    const openModal = (email) => {
        setSelectedUser(groupedPayments[email]);
        setShowModal(true);
    };

    const totalAmount = selectedUser?.reduce((sum, txn) => sum + (txn.amount || 0), 0);


    return (
        <>
            <Navbar />
            <NavbarTop />
            <div className="container" style={{ marginTop: "70px" }}>
                <h4 className="fw-bold mb-2 text-white">Payment History</h4>
                {isPending ? (
                    <p className='text-white'>Loading...</p>
                ) : isError ? (
                    <div>
                        <p className='text-danger'>Could not load payments.</p>
                        <Button size="sm" variant="outline-light" onClick={() => refetch()}>
                            Try again
                        </Button>
                    </div>
                ) : Object.keys(groupedPayments).length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover bg-white">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Email</th>
                                    <th>Transactions</th>
                                    <th>Today</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(groupedPayments).map((email, index) => {
                                    const todayTxns = groupedPayments[email].some(txn =>
                                        new Date(txn.paidAt).toISOString().slice(0, 10) === todayDate
                                    );

                                    return (
                                        <tr key={email}>
                                            <td>{index + 1}</td>
                                            <td>{email}</td>
                                            <td>{groupedPayments[email].length}</td>
                                            <td>
                                                {todayTxns ? (
                                                    <span className="badge bg-success">Yes</span>
                                                ) : (
                                                    <span className="badge bg-secondary">No</span>
                                                )}
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => openModal(email)}
                                                >
                                                    Show
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-white">No payments found.</p>
                )}

                {/* Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton className='shadow-lg'>
                        <Modal.Title className=''>Amout: ₦{Number(totalAmount || 0).toLocaleString()}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-light">
                        {selectedUser && selectedUser.length > 0 ? (
                            <div
                                style={{
                                    // maxHeight: "60vh",          
                                    // overflowY: "auto",         
                                    // overflowX: "auto",            
                                    // width: "100%",  
                                    // height:"100vh"  
                                    
                                    maxHeight: "60vh",
                                    overflowY: "auto",
                                    overflowX: "auto",
                                    width: "100%",
                                    scrollbarWidth: "none", // Firefox
                                    msOverflowStyle: "none", // IE 10+
                                }}
                                // className='border border-danger'
                            >
                                <table
                                    className="table table-dark table-bordered"
                                    style={{ minWidth: "700px" }} // 👈 set a min width so content doesn't squeeze
                                >
                                    <thead>
                                        <tr>
                                            <th>S/N</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Reference</th>
                                            <th>Channel</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedUser.map((txn, index) => {
                                            const isToday =
                                                new Date(txn.paidAt).toISOString().slice(0, 10) === todayDate;
                                            const rowClass = isToday ? "table-success" : "table-dark";

                                            return (
                                                <tr key={txn._id} className={rowClass}>
                                                    <td>{index + 1}</td>
                                                    <td>₦{txn.amount.toLocaleString()}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${txn.status === "success"
                                                                    ? "bg-success"
                                                                    : txn.status === "failed"
                                                                        ? "bg-danger"
                                                                        : "bg-warning text-dark"
                                                                }`}
                                                        >
                                                            {txn.status}
                                                        </span>
                                                    </td>
                                                    <td>{txn.reference}</td>
                                                    <td>{txn.channel}</td>
                                                    <td>{new Date(txn.paidAt).toLocaleString()}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No transactions found for this user.</p>
                        )}
                    </Modal.Body>


                    <Modal.Footer className='shadow-lg'>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Historyadmin;
