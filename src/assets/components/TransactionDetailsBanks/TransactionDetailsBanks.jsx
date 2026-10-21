import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBankLogoByName } from '../BankUtils';
import { useBeneficiaries } from '../../../hooks/useQueries';
import { useDeleteBeneficiary } from '../../../hooks/useMutations';
import { useCurrentUser } from '../../../lib/auth';

export default function TransactionDetailsBanks() {
    const [showAll, setShowAll] = useState(false);

    const navigate = useNavigate();
    const { userId } = useCurrentUser();
    const { data: transactions = [], isPending, isError, refetch } = useBeneficiaries(userId, showAll);
    const { mutate: deleteBeneficiary } = useDeleteBeneficiary();

    const handleDeleteTransaction = (transactionId) => {
        deleteBeneficiary(transactionId);
    };

    const handleTransactionClick = (transaction) => {
        localStorage.setItem("selectedAccount", JSON.stringify(transaction));
        navigate("/transfer", { state: { transaction } });
    };

    const searchBtn = () => navigate("/search");

    return (
        <div className="shadow-sm rounded-3">
            <div className="px-3 border-bottom">
                <div className="d-flex align-items-center">
                    <div className="pb-2 px-3 border-bottom border-success border-3" style={{ marginBottom: '-1px' }}>
                        <h6 className="mb-0 fw-bold text-success">Recents</h6>
                    </div>
                    <div className="pb-2 px-3">
                        <h6 className="mb-0 text-muted">Favourites</h6>
                    </div>
                    <div className="pb-2 px-3 ms-auto">
                        <h6 className="mb-0 text-muted" onClick={searchBtn}>
                            <i className="ri-search-line text-success"></i>
                        </h6>
                    </div>
                </div>
            </div>

            <div className="p-3">
                {isPending ? (
                    <p className="text-center text-muted">Loading...</p>
                ) : isError ? (
                    <div className="text-center">
                        <p className="text-danger">Could not load beneficiaries.</p>
                        <button className="btn btn-success btn-sm" onClick={() => refetch()}>
                            Try again
                        </button>
                    </div>
                ) : transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <BeneficiaryItem
                            key={transaction._id}
                            icon={transaction.accountName ? transaction.accountName[0] : '?'}
                            iconBg="primary"
                            name={transaction.accountName}
                            account={transaction.accountNumber}
                            bank={transaction.bankName}
                            transactionId={transaction._id}
                            handleDeleteTransaction={handleDeleteTransaction}
                            onClick={() => handleTransactionClick(transaction)}
                        />
                    ))
                ) : (
                    <div>No transactions available.</div>
                )}

                <div className="text-center mt-4">
                    <button
                        className="btn btn-light rounded-pill px-3 py-1"
                        onClick={() => setShowAll(!showAll)}
                        style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    >
                        {showAll ? 'View Less' : 'View All'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function BeneficiaryItem({ icon, iconBg, name, account, bank, transactionId, handleDeleteTransaction, onClick }) {
    const [showDelete, setShowDelete] = useState(false);
    const logoUrl = getBankLogoByName(bank);

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDelete(!showDelete);
    };

    return (
        <div className="d-flex align-items-center bg-white rounded-3 p-3 mb-2" onClick={onClick}>
            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt={bank}
                    style={{
                        width: 40,
                        height: 40,
                        objectFit: 'contain',
                        borderRadius: '50%',
                        backgroundColor: '#f0f0f0',
                        padding: 1,
                    }}
                    className="me-2"
                />
            ) : (
                <div
                    className={`rounded-circle bg-${iconBg} text-white d-flex align-items-center justify-content-center me-2`}
                    style={{ width: 40, height: 40, minWidth: 40 }}
                >
                    {icon}
                </div>
            )}

            <div className="ms-1 flex-grow-1">
                <div className="fw-bold">{name}</div>
                <div className="text-muted small">
                    {account} {bank}
                </div>
            </div>

            <div className="position-relative">
                <button className="btn btn-link text-muted p-0" onClick={handleDeleteClick} aria-label={`Actions for ${name}`}>
                    â‹®
                </button>
                {showDelete && (
                    <div
                        className="position-absolute bg-white p-1"
                        style={{ top: '20px', left: '-10px', borderRadius: '5px', fontSize: '12px' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTransaction(transactionId);
                        }}
                    >
                        Delete
                    </div>
                )}
            </div>
        </div>
    );
}
