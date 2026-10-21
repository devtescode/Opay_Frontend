import { useNavigate } from 'react-router-dom';
import './UserDb.css';

const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString()}.00`;

const TransferStrip = ({ transfer, isLoading, onOpenTransactions }) => {
  const navigate = useNavigate();

  const isIncoming = transfer?.type === 'incoming';
  const hasTransfer = Boolean(transfer);

  const who = hasTransfer
    ? `${isIncoming ? 'Transfer from' : 'Transfer to'} ${transfer.accountName ?? ''}`
    : 'No transfers yet';

  const openTransactions = () => {
    onOpenTransactions?.();
    navigate('/storetransaction');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openTransactions();
    }
  };

  return (
    <div
      className="opay-transferstrip"
      role="button"
      tabIndex={0}
      aria-label="View transactions"
      onClick={openTransactions}
      onKeyDown={handleKeyDown}
    >
      <span className="opay-transferstrip__icon">
        <i className="ri-checkbox-circle-line" aria-hidden="true" />
      </span>

      {isLoading ? (
        <span className="opay-skeleton" style={{ width: '60%', height: 12 }} />
      ) : (
        <p className="opay-transferstrip__who" title={hasTransfer ? transfer.accountName : who}>
          {who}
        </p>
      )}

      {!isLoading && hasTransfer && (
        <>
          <span className="opay-transferstrip__amount">
            {isIncoming ? '+' : '-'}
            {formatNaira(Math.abs(transfer.amount))}
          </span>
          <span className="opay-transferstrip__label">Transactions</span>
          <i className="ri-arrow-right-s-line opay-transferstrip__chev" aria-hidden="true" />
        </>
      )}
    </div>
  );
};

export default TransferStrip;
