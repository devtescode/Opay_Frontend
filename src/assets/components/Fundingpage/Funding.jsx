import Navbar from '../Navbarpage/Navbar';
import NavbarTop from '../NavbarToppage/NavbarTop';
import { format } from 'date-fns';
import { useAdminFunding } from '../../../hooks/useQueries';
import { useDeleteFunding } from '../../../hooks/useMutations';
import { alert } from '../../../lib/alert';

const Funding = () => {
    const { data: fundingData, isPending, isError, refetch } = useAdminFunding({ limit: 100 });
    const { mutate: deleteFunding } = useDeleteFunding();

    const incomingTransactions = fundingData?.items ?? [];

    const handleDelete = (txn) => {
        alert.confirm({
            title: 'Are you sure?',
            html: `You are about to delete <strong>₦${Math.abs(txn.amount).toLocaleString()}.00</strong> sent by <strong>${txn.userId?.username || 'N/A'}</strong>.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (!result?.isConfirmed) return;

            deleteFunding(txn._id, {
                onSuccess: () => {
                    alert.success('Deleted!', 'The transaction has been deleted.');
                },
                onError: () => {
                    alert.error('Error', 'Failed to delete the transaction.');
                },
            });
        });
    };

    return (
        <div>
            <Navbar />
            <NavbarTop />

            <div className="container" style={{ marginTop: '70px' }}>
                <h4 className="fw-bold mb-2 text-white">Incoming Transactions</h4>

                {isPending ? (
                    <p className="text-white">Loading...</p>
                ) : isError ? (
                    <div>
                        <p className="text-danger">Could not load incoming transactions.</p>
                        <button className="btn btn-sm btn-outline-light" onClick={() => refetch()}>
                            Try again
                        </button>
                    </div>
                ) : incomingTransactions.length === 0 ? (
                    <p>No incoming transactions found.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>S/N</th>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incomingTransactions.map((txn, index) => (
                                    <tr key={txn._id}>
                                        <td>{index + 1}</td>
                                        <td>{txn.userId?.username || 'N/A'}</td>
                                        <td>{txn.accountName}</td>
                                        <td>₦{Math.abs(txn.amount).toLocaleString()}.00</td>
                                        <td>{format(new Date(txn.createdAt), 'MMM dd, yyyy hh:mm a')}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(txn)}
                                                aria-label={`Delete transaction ${txn._id}`}
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
