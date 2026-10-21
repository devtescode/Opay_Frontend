import { useMemo, useState } from 'react';
import { ChevronLeft, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBeneficiarySearch } from '../../../hooks/useQueries';
import { useCurrentUser } from '../../../lib/auth';
import { getBankLogoByName } from '../BankUtils';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const { userId } = useCurrentUser();
    const { data: transactions = [], isPending, isError, refetch } = useBeneficiarySearch(userId);

    const filteredTransactions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return [];

        return transactions.filter(
            (transaction) =>
                transaction.accountNumber?.includes(query) ||
                transaction.accountName?.toLowerCase().includes(query),
        );
    }, [transactions, searchQuery]);

    const handleTransactionClick = (transaction) => {
        localStorage.setItem('selectedAccount', JSON.stringify(transaction));
        navigate('/transfer', { state: { transaction } });
    };

    return (
        <div className="container-sm bg-white min-vh-100 p-3" style={{ maxWidth: '500px' }}>
            {/* Header Section */}
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-link p-0 me-2 text-dark border-0" onClick={() => navigate('/bank')} aria-label="Back">
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

            {isError && (
                <div className="text-center p-3">
                    <p className="text-danger">Could not load beneficiaries.</p>
                    <button className="btn btn-success btn-sm" onClick={() => refetch()}>
                        Try again
                    </button>
                </div>
            )}

            {/* Display Transactions Only When Searching */}
            {searchQuery.trim() !== '' && !isError && (
                <div className="mt-3">
                    {isPending ? (
                        <p className="text-center p-3 text-muted">Loading...</p>
                    ) : filteredTransactions.length === 0 ? (
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
                                    src={getBankLogoByName(transaction.bankName)}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '';
                                        e.target.style.backgroundColor = '#f8f9fa';
                                        e.target.style.objectFit = 'cover';
                                        e.target.alt = 'Bank logo not available';
                                    }}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: 'contain',
                                        borderRadius: '50%',
                                        backgroundColor: '#f0f0f0',
                                    }}
                                    className="me-1 mb-1"
                                    alt={transaction.bankName}
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
