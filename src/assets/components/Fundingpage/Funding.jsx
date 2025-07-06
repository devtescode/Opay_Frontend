import React, { useEffect, useState } from 'react';
import Navbar from '../Navbarpage/Navbar';
import NavbarTop from '../NavbarToppage/NavbarTop';
import axios from 'axios';
import { format } from 'date-fns';
import { API_URLS } from '../../../../utils/apiConfig';

const Funding = () => {
    const [incomingTransactions, setIncomingTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIncoming();
    }, []);

    const fetchIncoming = async () => {
        try {
            const res = await axios.get(API_URLS.funding); // Should return only incoming transactions
            setIncomingTransactions(res.data);
        } catch (err) {
            console.error("Error fetching incoming transactions", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (txn) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            html: `You are about to delete <strong>₦${Math.abs(txn.amount).toLocaleString()}.00</strong> sent by <strong>${txn.userId?.username || 'N/A'}</strong>.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_URLS.delectfunding}/${txn._id}`);
                setIncomingTransactions(prev => prev.filter(t => t._id !== txn._id));

                Swal.fire('Deleted!', 'The transaction has been deleted.', 'success');
            } catch (err) {
                console.error("Error deleting transaction", err);
                Swal.fire('Error', 'Failed to delete the transaction.', 'error');
            }
        }
    };


    return (
        <div>
            <Navbar />
            <NavbarTop />

            <div className="container" style={{ marginTop: "70px" }}>
                <h4 className="fw-bold mb-2 text-white">Incoming Transactions</h4>

                {loading ? (
                    <p className='text-white'>Loading...</p>
                ) : incomingTransactions.length === 0 ? (
                    <p>No incoming transactions found.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>S/N</th>
                                    <th>Username</th>
                                    <th>Account Name</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomingTransactions.map((txn, index) => (
                                    <tr key={txn._id}>
                                        <td>{index + 1}</td>
                                        <td>{txn.userId?.username || "N/A"}</td>
                                        <td>{txn.accountName}</td>
                                        <td>₦{Math.abs(txn.amount).toLocaleString()}.00</td>
                                        <td>{format(new Date(txn.createdAt), "MMM dd, yyyy hh:mm a")}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(txn)}
                                            >
                                                <i className="ri-delete-bin-6-line"></i>
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Funding;
