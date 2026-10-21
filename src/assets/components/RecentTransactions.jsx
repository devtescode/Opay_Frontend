import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useTransactions } from '../../hooks/useQueries';
import { useReverseTransaction } from '../../hooks/useMutations';
import './UserDbpage/UserDb.css';

const RECENT_LIMIT = 5;
const REVERSE_AFTER_MS = 20000;

const statusClass = (status = '') => `opay-txn__status opay-txn__status--${status.toLowerCase()}`;

const RecentTransactions = ({ userId }) => {
  const navigate = useNavigate();
  const { data, isPending, isError, refetch, isFetching } = useTransactions(userId, { limit: RECENT_LIMIT });
  const { mutate: reverseTransaction } = useReverseTransaction();

  const transactions = useMemo(() => data?.items ?? [], [data]);
  const reversedRef = useRef(new Set());

  // Pending transactions are auto-reversed after 20s (unchanged behaviour).
  useEffect(() => {
    const timers = transactions
      .filter((transaction) => transaction.status === 'pending' && !reversedRef.current.has(transaction._id))
      .map((transaction) => {
        reversedRef.current.add(transaction._id);
        return setTimeout(() => reverseTransaction(transaction._id), REVERSE_AFTER_MS);
      });

    return () => timers.forEach(clearTimeout);
  }, [transactions, reverseTransaction]);

  const handleTransactionClick = (transaction) => {
    navigate('/transactiondetails', { state: transaction });
  };

  const renderBody = () => {
    if (isPending) {
      return (
        <div className="opay-txn-list" aria-busy="true" aria-label="Loading recent transactions">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="opay-skeleton-row" key={index}>
              <div className="opay-skeleton opay-skeleton-circle" />
              <div className="flex-grow-1">
                <div className="opay-skeleton" style={{ width: '55%' }} />
                <div className="opay-skeleton mt-2" style={{ width: '35%', height: 10 }} />
              </div>
              <div className="opay-skeleton" style={{ width: 62, height: 18 }} />
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="opay-txn-list">
          <div className="opay-state opay-state--error">
            <div className="opay-state__icon">
              <i className="ri-wifi-off-line" aria-hidden="true" />
            </div>
            <p className="mb-0">Could not load your transactions.</p>
            <button type="button" className="opay-state__retry" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="opay-txn-list">
          <div className="opay-state">
            <div className="opay-state__icon">
              <i className="ri-exchange-line" aria-hidden="true" />
            </div>
            <p className="mb-0">No transactions yet. Your activity will show up here.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="opay-txn-list">
        {transactions.map((transaction) => {
          const isIncoming = transaction.type === 'incoming';
          const isCredit = isIncoming || transaction.status === 'Reversed';

          return (
            <div
              className="opay-txn"
              key={transaction._id}
              onClick={() => handleTransactionClick(transaction)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleTransactionClick(transaction)}
            >
              <div className={`opay-txn__icon${isIncoming ? ' opay-txn__icon--in' : ''}`}>
                <i className={isIncoming ? 'ri-arrow-down-line' : 'ri-arrow-up-line'} aria-hidden="true" />
              </div>

              <div className="opay-txn__body">
                <p className="opay-txn__title" title={transaction.accountName}>
                  {isIncoming ? 'Transfer from' : 'Transfer to'} {transaction.accountName}
                </p>
                <p className="opay-txn__meta">
                  {format(new Date(transaction.createdAt), 'MMM do, yyyy • hh:mm a')}
                </p>
              </div>

              <div className="opay-txn__right">
                <span className={`opay-txn__amount${isCredit ? ' opay-txn__amount--in' : ''}`}>
                  {isCredit ? '+' : '-'}₦{Math.abs(transaction.amount).toLocaleString()}.00
                </span>
                <span className={statusClass(transaction.status)}>{transaction.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="opay-section">
      <div className="opay-section__head">
        <h2 className="opay-section__title">Recent Transactions</h2>

        <div className="d-flex align-items-center gap-3">
          {isFetching && !isPending && (
            <span className="opay-refetch">
              <span className="opay-refetch__dot" />
              Updating
            </span>
          )}
          <button
            type="button"
            className="opay-section__action"
            onClick={() => navigate('/storetransaction')}
          >
            View all <i className="ri-arrow-right-s-line" aria-hidden="true" />
          </button>
        </div>
      </div>

      {renderBody()}
    </section>
  );
};

export default RecentTransactions;
