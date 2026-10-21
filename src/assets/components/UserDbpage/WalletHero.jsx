import { useNavigate } from 'react-router-dom';
import './UserDb.css';

const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString()}.00`;

const WalletHero = ({
  balance,
  isBalanceVisible,
  onToggleBalance,
  earnedToday,
  isEarnedVisible,
  isLoading,
  isError,
  onRetry,
}) => {
  const navigate = useNavigate();

  const goToAddMoney = () => navigate('/addmoney');

  const renderValues = () => {
    if (isLoading) {
      return (
        <>
          <div className="opay-wallet__row opay-skeleton--row">
            <span className="opay-skeleton" style={{ width: 110, height: 26 }} />
          </div>
          <div className="opay-wallet__row opay-skeleton--row">
            <span className="opay-skeleton" style={{ width: 70, height: 12 }} />
          </div>
        </>
      );
    }

    if (isError) {
      return (
        <div className="opay-wallet__row">
          <p className="opay-state--error" style={{ color: '#fff', fontSize: 13 }}>
            Could not load your balance.
            <button
              type="button"
              className="opay-state__retry"
              onClick={() => onRetry?.()}
              style={{ marginLeft: 8 }}
            >
              Retry
            </button>
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="opay-wallet__row">
          <p className={isBalanceVisible ? 'opay-wallet__amount' : 'opay-wallet__masked'}>
            {isBalanceVisible ? formatNaira(balance) : '****'}
            <i className="ri-arrow-right-s-line opay-wallet__chev" aria-hidden="true" />
          </p>
        </div>

        <div className="opay-wallet__row">
          <p className="opay-wallet__earned">
            Earned Today {isEarnedVisible ? formatNaira(earnedToday) : '****'}
          </p>
        </div>
      </>
    );
  };

  const renderLabel = () => {
    if (isLoading) {
      return (
        <p className="opay-wallet__label">
          <span className="opay-skeleton opay-skeleton--circle" style={{ width: 26, height: 26 }} />
          <span className="opay-skeleton" style={{ width: 66, height: 12 }} />
        </p>
      );
    }

    return (
      <p className="opay-wallet__label">
        <span className="opay-wallet__shield">
          <i className="ri-shield-check-line" aria-hidden="true" />
        </span>
        Available
        <button
          type="button"
          className="opay-wallet__eye"
          onClick={() => onToggleBalance?.()}
          aria-label={isBalanceVisible ? 'Hide balance' : 'Show balance'}
          aria-pressed={isBalanceVisible}
        >
          <i className={isBalanceVisible ? 'ri-eye-line' : 'ri-eye-off-line'} aria-hidden="true" />
        </button>
      </p>
    );
  };

  return (
    <section className="opay-wallet" aria-label="Wallet balance">
      <div className="opay-wallet__row">
        {renderLabel()}

        <button type="button" className="opay-wallet__cta" onClick={goToAddMoney}>
          <i className="ri-add-line" aria-hidden="true" /> Add Money
        </button>
      </div>

      {renderValues()}
    </section>
  );
};

export default WalletHero;
