import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBalance } from '../../hooks/useQueries';
import './UserDbpage/UserDb.css';

const BalanceCard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);

  const { data: balance, isPending, isError, refetch, isFetching } = useBalance();

  const goToHistory = () => navigate('/storetransaction');
  const goToAddMoney = () => navigate('/addmoney');

  return (
    <section className="opay-hero" aria-label="Wallet balance">
      <div className="d-flex justify-content-between align-items-center">
        <p className="opay-hero__label">
          Available Balance
          <button
            type="button"
            className="opay-hero__toggle"
            onClick={() => setShowBalance((prev) => !prev)}
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            aria-pressed={!showBalance}
          >
            <i className={showBalance ? 'ri-eye-line' : 'ri-eye-off-line'} aria-hidden="true" />
          </button>
        </p>

        {isFetching && !isPending && (
          <span className="opay-refetch" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <span className="opay-refetch__dot" style={{ background: '#fff' }} />
            Updating
          </span>
        )}
      </div>

      <p className={`opay-hero__amount${showBalance ? '' : ' opay-hero__amount--muted'}`}>
        {isPending
          ? 'â‚¦ â€”'
          : isError
            ? 'Unavailable'
            : showBalance
              ? `â‚¦${Number(balance || 0).toLocaleString()}.00`
              : 'â‚¦ ****'}
      </p>

      {isError && (
        <div className="d-flex align-items-center gap-2 mt-2">
          <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>Could not load your balance.</span>
          <button
            type="button"
            className="opay-hero__link"
            onClick={() => refetch()}
            style={{ textDecoration: 'underline' }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="opay-hero__meta">
        <button type="button" className="opay-hero__cta" onClick={goToAddMoney}>
          <i className="ri-add-line" aria-hidden="true" /> Add Money
        </button>

        <button type="button" className="opay-hero__link" onClick={goToHistory}>
          Transaction History <i className="ri-arrow-right-s-line" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default BalanceCard;
