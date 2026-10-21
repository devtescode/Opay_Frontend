import { useNavigate } from 'react-router-dom';
import { BsPersonFill, BsBank, BsCashStack } from 'react-icons/bs';
import './UserDbpage/UserDb.css';

const actions = [
  { key: 'opay', label: 'To Opay', Icon: BsPersonFill, to: '/toopay' },
  { key: 'bank', label: 'To Bank', Icon: BsBank, to: '/bank' },
  { key: 'withdraw', label: 'Withdraw', Icon: BsCashStack, to: null },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section className="opay-quick" aria-label="Quick actions">
      {actions.map(({ key, label, Icon, to }) => (
        <div
          className="opay-quick__item"
          key={key}
          onClick={to ? () => navigate(to) : undefined}
          role={to ? 'button' : undefined}
          tabIndex={to ? 0 : undefined}
          onKeyDown={
            to
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(to);
                  }
                }
              : undefined
          }
        >
          <span className="opay-quick__icon">
            <Icon aria-hidden="true" />
          </span>
          <span className="opay-quick__label">{label}</span>
        </div>
      ))}
    </section>
  );
};

export default QuickActions;
