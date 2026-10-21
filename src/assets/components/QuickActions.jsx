import { useNavigate } from 'react-router-dom';
import './UserDbpage/UserDb.css';

const actions = [
  { key: 'opay', label: 'To OPay', icon: 'ri-user-line', to: '/toopay' },
  { key: 'bank', label: 'To Bank', icon: 'ri-bank-line', to: '/bank' },
  { key: 'save', label: 'Save', icon: 'ri-scan-2-line', to: null },
  { key: 'loan', label: 'Loan', icon: 'ri-hand-heart-line', to: null },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section className="opay-tiles" aria-label="Quick actions">
      {actions.map(({ key, label, icon, to }) => (
        <button
          type="button"
          key={key}
          className="opay-tile"
          onClick={to ? () => navigate(to) : undefined}
        >
          <span className="opay-tile__icon">
            <i className={icon} aria-hidden="true" />
          </span>
          <span className="opay-tile__label">{label}</span>
        </button>
      ))}
    </section>
  );
};

export default QuickActions;
